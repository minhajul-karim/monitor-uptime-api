import utils from '../../helpers/utils';
import lib from '../../lib/data';
import { UserHandler } from '../../helpers/types';

export const usersHandler = {} as UserHandler;
const ACCEPTED_METHODS = ['get', 'post', 'put', 'delete'];

usersHandler.handleReqRes = (reqProps, callback) => {
  if (!ACCEPTED_METHODS.includes(reqProps.method)) {
    callback(405, { message: 'Unsupported method' });
  } else {
    const method = reqProps.method as keyof UserHandler;
    usersHandler[method](reqProps, callback);
  }
};

usersHandler.get = async (reqProps, callback) => {
  const validatedPhone = utils.validateString(reqProps.phone, 11);
  if (!validatedPhone) {
    callback(400, {
      message: 'Bad request. Please provide a valid phone number.',
    });
    return;
  }

  try {
    const tokenVerified = await utils.verifyToken(
      reqProps.tokenIdFromReqHeader as string,
      reqProps.phone,
    );
    if (!tokenVerified) {
      callback(403, {
        message: 'Authentication failed. Please provide a valid token.',
      });
      return;
    }
    const userString = await lib.read('users', reqProps.phone);
    const userJson = utils.parseJson(userString);
    callback(200, { user: userJson });
  } catch (error) {
    callback(400, { message: 'Something went wrong. Could not find user' });
  }
};

usersHandler.post = async (reqProps, callback) => {
  const payloadJson = utils.parseJson(reqProps.payload);
  const validatedPayloadJson = utils.validateUserPayloadJson(payloadJson);
  if (!validatedPayloadJson) {
    callback(400, { message: 'Bad request' });
    return;
  }
  payloadJson.password = await utils.hashPassword(
    payloadJson.password as string,
  );

  try {
    await lib.create(
      'users',
      payloadJson.phone as string,
      JSON.stringify(payloadJson),
    );
    callback(201, { message: 'User created' });
  } catch (error) {
    callback(400, {
      message: 'Could not create user. The user may already exist',
    });
  }
};

usersHandler.put = async (reqProps, callback) => {
  const payloadJson = utils.parseJson(reqProps.payload);
  const validatedPayloadJson = utils.validateUserPayloadJson(payloadJson);
  if (!validatedPayloadJson) {
    callback(400, { message: 'Bad request' });
    return;
  }

  try {
    const tokenVerified = await utils.verifyToken(
      reqProps.tokenIdFromReqHeader as string,
      payloadJson.phone as string,
    );
    if (!tokenVerified) {
      callback(403, {
        message: 'Authentication failed. Please provide a valid token.',
      });
      return;
    }
    // Get the existing user info
    const userString = await lib.read('users', payloadJson.phone as string);
    const userJson = utils.parseJson(userString);
    // Update user info
    userJson.firstName = payloadJson.firstName;
    userJson.lastName = payloadJson.lastName;
    userJson.password = await utils.hashPassword(
      payloadJson.password as string,
    );
    userJson.tosAgreement = payloadJson.tosAgreement;
    await lib.update(
      'users',
      payloadJson.phone as string,
      JSON.stringify(userJson),
    );
    callback(200, { message: 'User updated' });
  } catch (error) {
    callback(400, {
      message: 'Something went wrong. Could not update the user',
    });
  }
};

usersHandler.delete = async (reqProps, callback) => {
  const validatedPhone = utils.validateString(reqProps.phone, 11);
  if (!validatedPhone) {
    callback(400, { message: 'Bad request' });
    return;
  }

  try {
    const tokenVerified = await utils.verifyToken(
      reqProps.tokenIdFromReqHeader as string,
      reqProps.phone,
    );
    if (!tokenVerified) {
      callback(403, {
        message: 'Authentication failed. Please provide a valid token.',
      });
      return;
    }
    await lib.delete('users', reqProps.phone);
    callback(200, { message: 'User deleted' });
  } catch (error) {
    callback(400, { message: 'Something went wrong. Could not delete user' });
  }
};
