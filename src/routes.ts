import { sampleHandler } from './handlers/routeHandlers/sampleHandler';
import { notFoundHandler } from './handlers/routeHandlers/notFoundHandler';
import { usersHandler } from './handlers/routeHandlers/usersHandler';

const routes = {
  sample: sampleHandler.handleReqRes,
  users: usersHandler.handleReqRes,
  notFound: notFoundHandler.handleReqRes,
};

export { routes };
