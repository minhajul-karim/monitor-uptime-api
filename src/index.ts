import * as http from 'http';
import { handler } from './helpers/handleReqRes';
import { environmentToExport as environment } from './helpers/environments';
import lib from './lib/data';

// Define the App interface
interface App {
  createServer: () => void;
  handleReqRes: (req: http.IncomingMessage, res: http.ServerResponse) => void;
}

const app: App = {} as App;

app.createServer = function () {
  const server = http.createServer(app.handleReqRes);
  server.listen(environment.port, () => {
    console.log(`Listening at port ${environment.port}`);
  });
};

app.handleReqRes = handler.handleReqRes;

app.createServer();

// Create a new file
lib.create('b', 'A file content');

// Read a file
lib.read('b');
