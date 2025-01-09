interface User {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  tosAgreement: boolean;
}

interface Token {
  phone: string;
  password: string;
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
  validateTokenPayloadJson: (jsonObject: Token) => boolean;
  validateString: (
    stringToValidate: string | undefined,
    lenOfString: number,
  ) => boolean;
  validateBoolean: (booleanToValidate: boolean) => boolean;
  createToken: (length: number) => string;
  hashPassword: (plainPassword: string) => Promise<string>;
  verifyPassword: (
    plainPassword: string,
    hashedPassword: string,
  ) => Promise<boolean>;
}
