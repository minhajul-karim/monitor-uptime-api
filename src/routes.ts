import { sampleHandler } from './handlers/routeHandlers/sampleHandler';
import { notFoundHandler } from './handlers/routeHandlers/notFoundHandler';
import { usersHandler } from './handlers/routeHandlers/usersHandler';
import { tokenHandler } from './handlers/routeHandlers/tokenHandler';

const routes = {
  sample: sampleHandler.handleReqRes,
  users: usersHandler.handleReqRes,
  token: tokenHandler.handleReqRes,
  notFound: notFoundHandler.handleReqRes,
};

export { routes };
