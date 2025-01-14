import { sampleHandler } from './handlers/routeHandlers/sampleHandler';
import { notFoundHandler } from './handlers/routeHandlers/notFoundHandler';
import { usersHandler } from './handlers/routeHandlers/usersHandler';
import { tokenHandler } from './handlers/routeHandlers/tokenHandler';
import { checkHandler } from './handlers/routeHandlers/checkHandler';

const routes = {
  sample: sampleHandler.handleReqRes,
  users: usersHandler.handleReqRes,
  token: tokenHandler.handleReqRes,
  check: checkHandler.handleReqRes,
  notFound: notFoundHandler.handleReqRes,
};

export { routes };
