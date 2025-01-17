import * as http from 'http';
import { handler } from '../helpers/handleReqRes';
import { environmentToExport as environment } from '../helpers/environments';

// Define the Server interface
interface Server {
  init: () => void;
  handleReqRes: (req: http.IncomingMessage, res: http.ServerResponse) => void;
}

const server: Server = {} as Server;

server.init = function () {
  const httpServer = http.createServer(server.handleReqRes);
  httpServer.listen(environment.port, () => {
    console.log(`Listening at port ${environment.port}`);
  });
};

server.handleReqRes = handler.handleReqRes;

// server.createServer();
export default server;
