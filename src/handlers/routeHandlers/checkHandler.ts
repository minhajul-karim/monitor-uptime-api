import utils from '../../helpers/utils';
import lib from '../../lib/data';
import { UserHandler } from '../../helpers/types';

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
  } catch (error) {
    callback(403, {
      message: 'Bad request. Please provide a valid token.',
    });
    return;
  }

  const method = reqProps.method as keyof UserHandler;
  checkHandler[method](reqProps, callback);
};

checkHandler.get = async (reqProps, callback) => {};

checkHandler.post = async (reqProps, callback) => {};

checkHandler.put = async (reqProps, callback) => {};

checkHandler.delete = async (reqProps, callback) => {};
