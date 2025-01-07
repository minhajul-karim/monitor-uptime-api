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
  console.log('METHOD', reqProps.method);
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

usersHandler.post = (reqProps, callback) => {
  callback(200, { message: 'Post user' });
};

usersHandler.put = (reqProps, callback) => {
  callback(200, { message: 'Put user' });
};

usersHandler.delete = (reqProps, callback) => {
  callback(200, { message: 'Delete user' });
};
