import { StringDecoder } from 'string_decoder';
import { IncomingMessage, ServerResponse } from 'http';
import { routes } from '../routes';

interface Handler {
  handleReqRes: (req: IncomingMessage, res: ServerResponse) => void;
}

export interface RequestProps {
  method: string;
  pathname: string;
  id: string;
  token: string;
  payload: string;
}

export const handler = {} as Handler;

handler.handleReqRes = function (req, res) {
  const baseUrl = `http://${req.headers.host}`;
  const reqUrl = req.url ?? '/';
  const url = new URL(reqUrl, baseUrl);
  const trimmedPathName = url.pathname.replace(/^\/|\/$/g, '');

  // Extract data from query string
  const id = url.searchParams.get('id');

  // Extract custom request headers
  const token = req.headers['token'];

  // Extract payload from request method 1
  /*
  const buffers: Buffer[] = [];
  req.on('data', (buffer) => {
    buffers.push(buffer);
  });

  req.on('end', () => {
    const payload = Buffer.concat(buffers).toString();
    const payloadJson = JSON.parse(payload);
    console.log('payload', payloadJson['name']);
  });*/

  // Extract payload from request method 2
  const decoder = new StringDecoder('utf-8');
  let payload: string = '';

  req.on('data', (buffer) => {
    payload += decoder.write(buffer);
  });

  req.on('end', () => {
    payload += decoder.end();
    const requestProps = {
      method: req.method,
      pathname: trimmedPathName,
      id,
      token,
      payload,
    };

    const chosenRoute =
      routes[trimmedPathName as keyof typeof routes] ?? routes['notFound'];

    chosenRoute(
      requestProps,
      (statusCode: number, response: { message: string }) => {
        res.writeHead(statusCode, { 'content-type': 'application/json' });
        res.end(JSON.stringify(response));
      },
    );
  });
};

// module.exports = handler;
