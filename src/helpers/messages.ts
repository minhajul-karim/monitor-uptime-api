import https from 'https';
import querystring from 'querystring';
import utils from './utils';
import { environmentToExport as environment } from './environments';
import { Messages } from './types';

const messages = {} as Messages;

messages.sendMessage = (toPhoneNumber, message, callback) => {
  // Validate to phone number
  const validatedToPhoneNumber = utils.validateTokenId(toPhoneNumber, 11);
  if (!validatedToPhoneNumber) {
    callback(400);
    return;
  }

  const validatedMessage = message.trim().length > 0;
  if (!validatedMessage) {
    callback(400);
    return;
  }
  // Validate message
  const postData = querystring.stringify({
    To: `+88${toPhoneNumber}`,
    From: process.env.FROMPHONE,
    Body: message.trim(),
  });

  const options = {
    hostname: 'api.twilio.com',
    path: `/2010-04-01/Accounts/${process.env.ACCOUNTSID}/Messages.json`,
    method: 'POST',
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(
          `${process.env.ACCOUNTSID}:${process.env.AUTHTOKEN}`,
        ).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const req = https.request(options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      const responseJson = JSON.parse(responseData);
      callback(responseJson.status);
    });
  });

  req.on('error', (error) => {
    console.error(error);
  });

  req.write(postData);
  req.end();
};

export default messages;
