import lib from './data';
import url from 'url';
import utils from '../helpers/utils';
import http from 'http';
import https from 'https';

interface Worker {
  gatherAllChecks: () => void;
  loop: () => void;
  init: () => void;
  performCheck: (checkJson: Record<string, unknown>) => void;
}

const worker = {} as Worker;

worker.gatherAllChecks = async () => {
  // Gather all checks
  const listOfCheckFiles = await lib.getFileNames('checks');
  for (const fileName of listOfCheckFiles) {
    const checkContentStr = await lib.read('checks', fileName);
    const checkJson = utils.parseJson(checkContentStr);
    worker.performCheck(checkJson);
  }
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
        checkResult.error = false;
        checkResult.statusCode = response.statusCode ?? 0;
        checkResultSent = true;
        console.log('SUCCESS!');
        // TODO: Call a method to process check result(checkjson, checkresult)
      }
    });
  });

  request.on('error', (error) => {
    console.error(error);
    if (!checkResultSent) {
      checkResult.error = true;
      checkResult.statusCode = 0;
    }
  });

  request.on('timeout', () => {
    console.error(`Request timeout for ${requestOptions.hostname}`);
    if (!checkResultSent) {
      checkResult.error = true;
      checkResult.statusCode = 0;
    }
  });

  request.end();
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
