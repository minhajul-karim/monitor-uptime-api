import { sampleHandler } from './handlers/routeHandlers/sampleHandler';
import { notFoundHandler } from './handlers/routeHandlers/notFoundHandler';

const routes = {
  sample: sampleHandler.handleReqRes,
  notFound: notFoundHandler.handleReqRes,
};

export { routes };
