export const sampleHandler: any = {};

sampleHandler.handleReqRes = (reqProps: any, callback: any) => {
  callback(201, { message: 'Welcome to sample page' });
};
