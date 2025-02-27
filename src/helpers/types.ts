export interface UserResponse {
  message?: string;
  user?: Record<string, unknown>;
  token?: Record<string, unknown>;
  check?: Record<string, unknown>;
}

interface RequestProps {
  method: string;
  pathname: string;
  phone: string;
  payload: string;
  tokenId: string;
  tokenIdFromReqHeader: undefined | string;
}

type Callback = (statusCode: number, response: UserResponse) => void;

type HandleReqRes = (reqProps: RequestProps, callback: Callback) => void;

export interface UserHandler {
  handleReqRes: HandleReqRes;
  get: HandleReqRes;
  post: HandleReqRes;
  put: HandleReqRes;
  delete: HandleReqRes;
}

export interface Utils {
  parseJson: (stringJson: string) => Record<string, unknown>;
  validateUserPayloadJson: (jsonObject: Record<string, unknown>) => boolean;
  validateCheckPayloadJson: (jsonObject: Record<string, unknown>) => boolean;
  validateTokenPayloadJson: (jsonObject: Record<string, unknown>) => boolean;
  validateTokenUpdatePayloadJson: (
    jsonObject: Record<string, unknown>,
  ) => boolean;
  validateString: (
    stringToValidate: string | undefined,
    lenOfString: number,
  ) => boolean;
  validateTokenId: (stringToValidate: string, lenOfString: number) => boolean;
  validateBoolean: (booleanToValidate: boolean) => boolean;
  createToken: (length: number) => string;
  hashPassword: (plainPassword: string) => Promise<string>;
  verifyPassword: (
    plainPassword: string,
    hashedPassword: string,
  ) => Promise<boolean>;
  verifyToken: (token: string, phone: string) => Promise<boolean>;
  validateStringInArray: (str: string, arr: string[]) => boolean;
  validateTimeOutSeconds: (timeout: number) => boolean;
  getChecksCount: (checksCount: string[]) => number;
}

export interface Lib {
  create: (folderName: string, fileName: string, content: string) => void;
  update: (folderName: string, fileName: string, content: string) => void;
  read: (folderName: string, fileName: string) => Promise<string>;
  delete: (folderName: string, fileName: string) => void;
  getFileNames: (folderName: string) => Promise<string[]>;
}

interface Env {
  port: number;
  envName: string;
  maxCheckTimeoutSeconds: number;
}

export interface Environments {
  development: Env;
  staging: Env;
  production: Env;
}

export interface Messages {
  sendMessage: (
    toPhoneNumber: string,
    message: string,
    callback: (status: string | number) => void,
  ) => void;
}

export interface Worker {
  gatherAllChecks: () => void;
  loop: () => void;
  init: () => void;
  performCheck: (checkJson: Record<string, unknown>) => void;
  validateCheckStatusAndLastCheckedTime: (
    checkJson: Record<string, unknown>,
  ) => void;
  validateCheckStatus: (checkStatus: string) => string;
  validateLastCheckedTime: (lastCheckedTime: number) => number;
  processCheckResult: (
    checkJson: Record<string, unknown>,
    checkResult: {
      error: boolean;
      statusCode: number;
    },
  ) => void;
}
