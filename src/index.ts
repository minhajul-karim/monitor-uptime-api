import * as http from 'http';

// Define the App interface
interface App {
  port: number;
  createServer: () => void;
  handleReqRes: (req: http.IncomingMessage, res: http.ServerResponse) => void;
}

const app: App = {} as App;

app.port = 3000;

app.createServer = function () {
  const server = http.createServer(app.handleReqRes);
  server.listen(app.port, () => {
    console.log(`Listening at port ${app.port}`);
  });
};

app.handleReqRes = function (req, res) {
  res.end('Hello world');
};

app.createServer();
