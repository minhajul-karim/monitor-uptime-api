import { StringDecoder } from 'string_decoder';
import { IncomingMessage, ServerResponse } from 'http';

interface Handler {
  handleReqRes: (req: IncomingMessage, res: ServerResponse) => void;
}

const handler = {} as Handler;

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
    res.end(
      JSON.stringify({
        method: req.method,
        pathname: trimmedPathName,
        id,
        token,
        payload,
      }),
    );
  });
};

module.exports = handler;
