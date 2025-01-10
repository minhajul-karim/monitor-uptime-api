import utils from '../../helpers/utils';
import lib from '../../lib/data';
import { UserHandler } from '../../helpers/types';

export const tokenHandler = {} as UserHandler;
const ACCEPTED_METHODS = ['get', 'post', 'put', 'delete'];

tokenHandler.handleReqRes = (reqProps, callback) => {
  if (!ACCEPTED_METHODS.includes(reqProps.method)) {
    callback(405, { message: 'Unsupported method' });
  } else {
    const method = reqProps.method as keyof UserHandler;
    tokenHandler[method](reqProps, callback);
  }
};

tokenHandler.get = async (reqProps, callback) => {};

tokenHandler.post = async (reqProps, callback) => {
  const payloadJson = utils.parseJson(reqProps.payload);
  const validatedPayloadJson = utils.validateTokenPayloadJson(payloadJson);
  if (!validatedPayloadJson) {
    callback(400, { message: 'Bad request' });
    return;
  }

  try {
    const userString = await lib.read('users', payloadJson.phone);
    const user = utils.parseJson(userString);
    const passwordMatched = await utils.verifyPassword(
      payloadJson.password,
      user.password,
    );

    if (!passwordMatched) {
      callback(400, {
        message: 'Bad request. Please provide valid phone & password',
      });
      return;
    }

    const tokenId = utils.createToken(20);
    const expirationOffset = 1 * 60 * 60 * 1000;
    const expirationTime = Date.now() + expirationOffset;
    const token = {
      id: tokenId,
      phone: payloadJson.phone,
      expirationTime,
    };

    // Create token
    await lib.create('tokens', payloadJson.phone, JSON.stringify(token));
    callback(200, { message: 'Token created' });
  } catch (error) {
    callback(400, {
      message: 'Something went wrong. The token may already exist',
    });
  }
};

tokenHandler.put = async (reqProps, callback) => {};

tokenHandler.delete = async (reqProps, callback) => {};
