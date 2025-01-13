import utils from '../../helpers/utils';
import lib from '../../lib/data';
import { UserHandler } from '../../helpers/types';
import { environmentToExport as environment } from '../../helpers/environments';

export const checkHandler = {} as UserHandler;
const ACCEPTED_METHODS = ['get', 'post', 'put', 'delete'];

checkHandler.handleReqRes = async (reqProps, callback) => {
  if (!ACCEPTED_METHODS.includes(reqProps.method)) {
    callback(405, { message: 'Unsupported method.' });
    return;
  }

  // Verify token
  const { tokenIdFromReqHeader } = reqProps;
  try {
    const tokenString = await lib.read(
      'tokens',
      tokenIdFromReqHeader as string,
    );
    const tokenJson = utils.parseJson(tokenString);
    const tokenVerified = await utils.verifyToken(
      tokenIdFromReqHeader as string,
      tokenJson.phone as string,
    );
    if (!tokenVerified) {
      callback(403, {
        message: 'Authentication failed. Please provide a valid token...',
      });
    }
    reqProps.phone = tokenJson.phone as string;
  } catch (error) {
    callback(403, {
      message: 'Bad request. Please provide a valid token.',
    });
    return;
  }

  const method = reqProps.method as keyof UserHandler;
  checkHandler[method](reqProps, callback);
};

checkHandler.get = async (reqProps, callback) => {
  const { tokenId: checkId } = reqProps;
  const validatedCheckId = utils.validateString(checkId, 10);
  if (!validatedCheckId) {
    callback(400, {
      message: 'Bad request. Please provide a valid check id.',
    });
    return;
  }

  try {
    const checkString = await lib.read('checks', checkId);
    const checkJson = utils.parseJson(checkString);
    callback(200, { check: checkJson });
  } catch (error) {
    callback(400, { message: 'Something went wrong. Could not find user' });
  }
};

checkHandler.post = async (reqProps, callback) => {
  const payloadJson = utils.parseJson(reqProps.payload);
  const validatedPayloadJson = utils.validateCheckPayloadJson(payloadJson);
  if (!validatedPayloadJson) {
    callback(400, { message: 'Bad request. Please provide a valid payload.' });
    return;
  }

  // Look if the user has less than 6 checks
  const userString = await lib.read('users', reqProps.phone);
  const userJson = utils.parseJson(userString);
  const currentCheckCount = utils.getChecksCount(userJson.checks as string[]);
  if (currentCheckCount > environment.maxCheckTimeoutSeconds) {
    callback(403, {
      message: `You have reached the maximum limit of ${environment.maxCheckTimeoutSeconds} resources.`,
    });
    return;
  }

  // Create check file
  const checkId = utils.createToken(10);
  const checkObject = {
    id: checkId,
    ...payloadJson,
  };
  await lib.create('checks', checkId, JSON.stringify(checkObject));

  // Update check ids to the user
  if (currentCheckCount === 0) {
    userJson.checks = [checkId];
  } else {
    const updatedChecks = [...(userJson.checks as string[]), checkId];
    userJson.checks = updatedChecks;
  }

  await lib.update('users', reqProps.phone, JSON.stringify(userJson));
  callback(201, { message: 'Check ceated.' });
};

checkHandler.put = async (reqProps, callback) => {};

checkHandler.delete = async (reqProps, callback) => {
  const { tokenId: checkId } = reqProps;
  const validatedCheckId = utils.validateString(checkId, 10);
  if (!validatedCheckId) {
    callback(400, {
      message: 'Bad request. Please provide a valid check id.',
    });
    return;
  }

  try {
    // Remove the check file
    await lib.delete('checks', checkId);
    const userString = await lib.read('users', reqProps.phone);

    // Remove the check id from user
    const userJson = utils.parseJson(userString);
    const currentChecks = userJson.checks as string[];
    const updatedChecks = currentChecks.filter(
      (check: string) => check !== checkId,
    );

    if (currentChecks.length === updatedChecks.length) {
      callback(400, {
        message: 'Something went wrong. Could not find check id inside user.',
      });
      return;
    }

    // Update user
    userJson.checks = updatedChecks;
    await lib.update('users', reqProps.phone, JSON.stringify(userJson));
    callback(200, { message: 'Check deleted.' });
  } catch (error) {
    callback(400, { message: 'Something went wrong. Could not find user' });
  }
};
