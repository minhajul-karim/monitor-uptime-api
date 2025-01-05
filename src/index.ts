import * as http from "http";

const server = http.createServer((req, res) => {
  res.end('Hello world!');
});

server.listen('3000', () => {
  console.log('Listening at port 3000');
});
