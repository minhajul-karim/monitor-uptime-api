interface User {
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

export interface Utils {
  parseJson: (stringJson: string) => User;
  validateUserPayloadJson: (jsonObject: User) => boolean;
  validateString: (
    stringToValidate: string | undefined,
    lenOfString: number,
  ) => boolean;
  validateBoolean: (booleanToValidate: boolean) => boolean;
  encrypt: (text: string) => string;
}
