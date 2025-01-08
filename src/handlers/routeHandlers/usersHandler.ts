import utils from '../../helpers/utils';
import lib from '../../lib/data';

interface RequestProps {
  method: string;
  pathname: string;
  id: string;
  token: string;
  payload: string;
}

type HandleReqRes = (
  reqProps: RequestProps,
  callback: (statusCode: number, response: { message: string }) => void,
) => void;

interface UserHandler {
  handleReqRes: HandleReqRes;
  get: HandleReqRes;
  post: HandleReqRes;
  put: HandleReqRes;
  delete: HandleReqRes;
}

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

usersHandler.get = (reqProps, callback) => {
  callback(200, { message: 'Users list' });
};

usersHandler.post = async (reqProps, callback) => {
  const payloadJson = utils.parseJson(reqProps.payload);
  const validatedPayloadJson = utils.validateJson(payloadJson);
  if (!validatedPayloadJson) {
    callback(400, { message: 'Bad request' });
  }
  payloadJson.password = utils.encrypt(payloadJson.password);
  const userCreated = await lib.create(
    'users',
    payloadJson.phone,
    JSON.stringify(payloadJson),
  );
  userCreated
    ? callback(201, { message: 'User created' })
    : callback(400, {
        message: 'Something went wrong. The user may already exist',
      });
};

usersHandler.put = (reqProps, callback) => {
  callback(200, { message: 'Put user' });
};

usersHandler.delete = (reqProps, callback) => {
  callback(200, { message: 'Delete user' });
};
