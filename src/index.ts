import server from './lib/server';

// Define the App interface
interface App {
  init: () => void;
}

const app: App = {} as App;

app.init = () => {
  server.init();
};

app.init();
