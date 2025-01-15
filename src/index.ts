import server from './lib/server';
import worker from './lib/worker';

// Define the App interface
interface App {
  init: () => void;
}

const app: App = {} as App;

app.init = () => {
  server.init();
  worker.init();
};

app.init();
