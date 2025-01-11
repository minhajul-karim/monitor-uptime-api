import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { Utils } from './types';

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

  const validatedFirstName = utils.validateString(jsonObject.firstName as string, 2);
  if (!validatedFirstName) return false;

  const validatedLastName = utils.validateString(jsonObject.lastName as string, 2);
  if (!validatedLastName) return false;

  const validatedPhone = utils.validateString(jsonObject.phone as string, 11);
  if (!validatedPhone) return false;

  const validatedPassword = utils.validateString(jsonObject.password as string, 5);
  if (!validatedPassword) return false;

  const validatedTosAgreement = utils.validateBoolean(jsonObject.tosAgreement as boolean);
  if (!validatedTosAgreement) return false;

  return true;
};

utils.validateTokenPayloadJson = (jsonObject) => {
  if (typeof jsonObject !== 'object') {
    return false;
  }

  const validatedPhone = utils.validateString(jsonObject.phone as string, 11);
  if (!validatedPhone) return false;

  const validatedPassword = utils.validateString(jsonObject.password as string, 5);
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

export default utils;
