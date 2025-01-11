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

tokenHandler.get = async (reqProps, callback) => {
  if (typeof reqProps.tokenId !== 'string' || reqProps.tokenId.length !== 20) {
    callback(400, {
      message: 'Bad request. Please provide a valid token.',
    });
    return;
  }
  try {
    const tokenString = await lib.read('tokens', reqProps.tokenId);
    const tokenJson = utils.parseJson(tokenString);
    callback(200, { token: tokenJson });
  } catch (error) {
    callback(400, {
      message: 'Something went wrong. Could not find the token',
    });
  }
};

tokenHandler.post = async (reqProps, callback) => {
  const payloadJson = utils.parseJson(reqProps.payload);
  const validatedPayloadJson = utils.validateTokenPayloadJson(payloadJson);
  if (!validatedPayloadJson) {
    callback(400, { message: 'Bad request' });
    return;
  }

  try {
    const userString = await lib.read('users', payloadJson.phone as string);
    const user = utils.parseJson(userString);
    const passwordMatched = await utils.verifyPassword(
      payloadJson.password as string,
      user.password as string,
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
    await lib.create('tokens', token.id, JSON.stringify(token));
    callback(200, { message: 'Token created' });
  } catch (error) {
    callback(400, {
      message:
        'Something went wrong. Please check if the user exists or the token may already exists',
    });
  }
};

tokenHandler.put = async (reqProps, callback) => {
  const payloadJson = utils.parseJson(reqProps.payload);
  const validatedPayload = utils.validateTokenUpdatePayloadJson(payloadJson);
  if (!validatedPayload) {
    callback(400, {
      message: 'Bad request. Please provide a valid token id and extend.',
    });
    return;
  }

  try {
    const tokenString = await lib.read('tokens', payloadJson.id as string);
    const tokenJson = await utils.parseJson(tokenString);
    if (payloadJson.extend !== true) {
      callback(400, {
        message: 'Bad request. Please check the extend value.',
      });
      return;
    }

    const expirationOffset = 1 * 60 * 60 * 1000;
    (tokenJson.expirationTime as number) += expirationOffset;

    // Update token
    await lib.update(
      'tokens',
      payloadJson.id as string,
      JSON.stringify(tokenJson),
    );
    callback(200, { message: 'Token updated.' });
  } catch (error) {
    callback(400, { message: 'Bad request.' });
  }
};

tokenHandler.delete = async (reqProps, callback) => {
  const validatedTokenId = utils.validateTokenId(reqProps.tokenId, 20);
  if (!validatedTokenId) {
    callback(400, { message: 'Bad request. Please check the token ID.' });
    return;
  }

  try {
    await lib.delete('tokens', reqProps.tokenId);
    callback(200, { message: 'Token deleted' });
  } catch (error) {
    callback(400, { message: 'Something went wrong. Could not delete token' });
  }
};
