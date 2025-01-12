import crypto from 'crypto';
import bcrypt from 'bcrypt';
import lib from '../lib/data';
import { Utils } from './types';
import { environmentToExport as environment } from './environments';

const utils = {} as Utils;

utils.parseJson = (stringJson) => {
  try {
    const json = JSON.parse(stringJson);
    return json;
  } catch (error) {
    console.error(error);
    return {};
  }
};

utils.validateUserPayloadJson = (jsonObject) => {
  if (typeof jsonObject !== 'object') {
    return false;
  }

  const validatedFirstName = utils.validateString(
    jsonObject.firstName as string,
    2,
  );
  if (!validatedFirstName) return false;

  const validatedLastName = utils.validateString(
    jsonObject.lastName as string,
    2,
  );
  if (!validatedLastName) return false;

  const validatedPhone = utils.validateString(jsonObject.phone as string, 11);
  if (!validatedPhone) return false;

  const validatedPassword = utils.validateString(
    jsonObject.password as string,
    5,
  );
  if (!validatedPassword) return false;

  const validatedTosAgreement = utils.validateBoolean(
    jsonObject.tosAgreement as boolean,
  );
  if (!validatedTosAgreement) return false;

  return true;
};

utils.validateCheckPayloadJson = (jsonObject) => {
  if (typeof jsonObject !== 'object') {
    return false;
  }

  const validatedProtocol = utils.validateStringInArray(
    jsonObject.protocol as string,
    ['http', 'https'],
  );
  if (!validatedProtocol) return false;

  const validatedUrl =
    typeof jsonObject.url === 'string' && jsonObject.url.trim().length > 0;
  if (!validatedUrl) return false;

  const validatedMethod = utils.validateStringInArray(
    jsonObject.method as string,
    ['get', 'post', 'put', 'delete'],
  );
  if (!validatedMethod) return false;

  const validatedSuccessCodes = jsonObject.successCodes instanceof Array;
  if (!validatedSuccessCodes) return false;

  const validatedTimeOutSeconds = utils.validateTimeOutSeconds(
    jsonObject.timeoutSeconds as number,
  );
  if (!validatedTimeOutSeconds) return false;

  return true;
};

utils.validateTokenPayloadJson = (jsonObject) => {
  if (typeof jsonObject !== 'object') {
    return false;
  }

  const validatedPhone = utils.validateString(jsonObject.phone as string, 11);
  if (!validatedPhone) return false;

  const validatedPassword = utils.validateString(
    jsonObject.password as string,
    5,
  );
  if (!validatedPassword) return false;

  return true;
};

utils.validateTokenUpdatePayloadJson = (jsonObject) => {
  if (typeof jsonObject !== 'object') {
    return false;
  }

  const validatedTokenId = utils.validateTokenId(jsonObject.id as string, 20);
  if (!validatedTokenId) return false;

  const validatedExtend = utils.validateBoolean(jsonObject.extend as boolean);
  if (!validatedExtend) return false;

  return true;
};

utils.validateString = (stringToValidate, lenOfString) => {
  if (
    typeof stringToValidate !== 'string' ||
    stringToValidate.length === 0 ||
    stringToValidate.length < lenOfString
  ) {
    return false;
  }
  return true;
};

utils.validateTokenId = (stringToValidate, lenOfString) => {
  if (
    typeof stringToValidate !== 'string' ||
    stringToValidate.length === 0 ||
    stringToValidate.length !== lenOfString
  ) {
    return false;
  }
  return true;
};

utils.validateBoolean = (booleanToValidate) => {
  if (typeof booleanToValidate !== 'boolean') {
    return false;
  }
  return true;
};

utils.validateStringInArray = (str, arr) => {
  if (typeof str === 'string' && arr.includes(str)) {
    return true;
  }
  return false;
};

utils.validateTimeOutSeconds = (timeout) => {
  if (
    timeout % 1 === 0 &&
    timeout > 0 &&
    timeout <= environment.maxCheckTimeoutSeconds
  ) {
    return true;
  }
  return false;
};

utils.hashPassword = async (plainPassword) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
};

utils.verifyPassword = async (plainPassword, hashedPassword) => {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
};

utils.createToken = (length) => {
  const numberOfBytes = Math.floor(length / 2);
  const token = crypto.randomBytes(numberOfBytes).toString('hex');
  return token;
};

utils.verifyToken = async (tokenId, phone) => {
  const validatedTokenId = utils.validateTokenId(tokenId, 20);
  if (!validatedTokenId) return false;

  try {
    const tokenString = await lib.read('tokens', tokenId);
    const token = utils.parseJson(tokenString);
    if (token.phone !== phone) {
      return false;
    }
    return true;
  } catch (error) {
    console.error(`Couldn't read the file ${tokenId}`);
    return false;
  }
};

export default utils;
