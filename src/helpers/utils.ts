import crypto from 'crypto';

interface Utils {
  parseJson: (stringJson: string) => User;
  validateJson: (jsonObject: User) => boolean;
  validateString: (stringToValidate: string, lenOfString: number) => boolean;
  validateBoolean: (booleanToValidate: boolean) => boolean;
  encrypt: (text: string) => string;
}

interface User {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  tosAgreement: boolean;
}

const utils = {} as Utils;

utils.parseJson = (stringJson) => {
  try {
    const json = JSON.parse(stringJson);
    return json;
  } catch (error) {
    return {};
  }
};

utils.validateJson = (jsonObject) => {
  if (typeof jsonObject !== 'object') {
    return false;
  }

  const validatedFirstName = utils.validateString(jsonObject.firstName, 2);
  if (!validatedFirstName) return false;

  const validatedLastName = utils.validateString(jsonObject.lastName, 2);
  if (!validatedLastName) return false;

  const validatedPhone = utils.validateString(jsonObject.phone, 11);
  if (!validatedPhone) return false;

  const validatedPassword = utils.validateString(jsonObject.password, 5);
  if (!validatedPassword) return false;

  const validatedTosAgreement = utils.validateBoolean(jsonObject.tosAgreement);
  if (!validatedTosAgreement) return false;

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

utils.validateBoolean = (booleanToValidate) => {
  if (typeof booleanToValidate !== 'boolean') {
    return false;
  }
  return true;
};

// Secret key and algorithm
const algorithm = 'aes-256-cbc'; // Encryption algorithm
const secretKey = crypto.randomBytes(32); // 32 bytes secret key
const iv = crypto.randomBytes(16); // Initialization vector (IV)

utils.encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

export default utils;
