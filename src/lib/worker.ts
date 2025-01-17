import lib from './data';
import utils from '../helpers/utils';
import http from 'http';
import https from 'https';
import { Worker } from '../helpers/types';
import messages from '../helpers/messages';

const worker = {} as Worker;

worker.gatherAllChecks = async () => {
  // Gather all checks
  const listOfCheckFiles = await lib.getFileNames('checks');
  for (const fileName of listOfCheckFiles) {
    const checkContentStr = await lib.read('checks', fileName);
    const checkJson = utils.parseJson(checkContentStr);
    worker.validateCheckStatusAndLastCheckedTime(checkJson);
  }
};

worker.validateCheckStatusAndLastCheckedTime = (checkJson) => {
  const checkStatus = checkJson.status as string;
  const lastCheckedTime = checkJson.lastCheckedTime as number;
  checkJson.status = worker.validateCheckStatus(checkStatus);
  checkJson.lastCheckedTime = worker.validateLastCheckedTime(lastCheckedTime);
  worker.performCheck(checkJson);
};

worker.validateCheckStatus = (checkStatus) => {
  if (typeof checkStatus === 'string' && ['up', 'down'].includes(checkStatus)) {
    return checkStatus;
  }
  return 'down';
};

worker.validateLastCheckedTime = (lastCheckedTime) => {
  if (typeof lastCheckedTime === 'number' && lastCheckedTime > 0) {
    return lastCheckedTime;
  }
  return 0;
};

worker.performCheck = (checkJson) => {
  const url = new URL(`${checkJson.protocol}://${checkJson.url}`);
  const method = checkJson.method as string;
  const protocol = checkJson.protocol as string;
  const timeoutSeconds = checkJson.timeoutSeconds as number;
  const requestOptions = {
    protocol: `${protocol}:`,
    hostname: url.hostname,
    pathname: url.pathname,
    method: method.toUpperCase(),
    timeout: timeoutSeconds * 1000,
  };

  const moduleToUse = protocol === 'https' ? https : http;
  let checkResultSent = false;
  const checkResult = {
    error: false,
    statusCode: 0,
  };

  const request = moduleToUse.request(requestOptions, (response) => {
    response.on('data', () => {});

    response.on('end', () => {
      if (!checkResultSent) {
        checkResultSent = true;
        checkResult.error = false;
        checkResult.statusCode = response.statusCode ?? 0;
        worker.processCheckResult(checkJson, checkResult);
      }
    });
  });

  request.on('error', (error) => {
    console.error(error);
    if (!checkResultSent) {
      checkResultSent = true;
      checkResult.error = true;
      checkResult.statusCode = 0;
      worker.processCheckResult(checkJson, checkResult);
    }
  });

  request.on('timeout', () => {
    console.error(`Request timeout for ${requestOptions.hostname}`);
    if (!checkResultSent) {
      checkResultSent = true;
      checkResult.error = true;
      checkResult.statusCode = 0;
      worker.processCheckResult(checkJson, checkResult);
    }
  });

  request.end();
};

worker.processCheckResult = async (checkJson, checkResult) => {
  const successCodes = checkJson.successCodes as number[];
  const updatedStatus =
    !checkResult.error && successCodes.includes(checkResult.statusCode)
      ? 'up'
      : 'down';

  // Send sms if the status has altered, up to down or down to up
  const currentStatus = checkJson.status;
  const lastCheckedTime = checkJson.lastCheckedTime as number;

  // Add status and lastCheckedTime to the check
  checkJson.status = updatedStatus;
  checkJson.lastCheckedTime = Date.now();

  try {
    await lib.update(
      'checks',
      checkJson.id as string,
      JSON.stringify(checkJson),
    );
    const shouldSendSms =
      lastCheckedTime > 0 && currentStatus !== checkJson.status;
    if (shouldSendSms) {
      const message = `${checkJson.protocol}://${checkJson.url} is now ${checkJson.status}`;
      messages.sendMessage(checkJson.phone as string, message, (resCode) => {
        console.log(
          resCode === 'queued'
            ? `${message} - This sms has been sent to ${checkJson.phone}`
            : `Something went wrong while sending sms to ${checkJson.phone}`,
        );
      });
    }
  } catch (error) {
    console.error(error);
  }
};

worker.loop = () => {
  setInterval(
    () => {
      worker.gatherAllChecks();
    },
    1 * 60 * 1000,
  );
};

worker.init = () => {
  worker.gatherAllChecks();
  worker.loop();
};

export default worker;
