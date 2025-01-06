export const notFoundHandler: any = {};

notFoundHandler.handleReqRes = (reqProps: any, callback: any) => {
  callback(404, {message: "Not found!"});
};
