export interface User {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  tosAgreement: boolean;
}

export interface UserResponse {
  message?: string;
  user?: User;
}

interface RequestProps {
  method: string;
  pathname: string;
  phone: string;
  token: string;
  payload: string;
}

type HandleReqRes = (
  reqProps: RequestProps,
  callback: (statusCode: number, response: UserResponse) => void,
) => void;

export interface UserHandler {
  handleReqRes: HandleReqRes;
  get: HandleReqRes;
  post: HandleReqRes;
  put: HandleReqRes;
  delete: HandleReqRes;
}
