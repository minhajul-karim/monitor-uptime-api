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
lib.create('b', 'Line 1\n');

// Update a file
lib.update('b', 'Line 2\n');
lib.update('b', 'Line 3\n');

// Read a file
lib.read('b');

// Delete a file
lib.delete('b');
