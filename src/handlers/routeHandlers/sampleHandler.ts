import { RequestProps } from '../../helpers/handleReqRes';

export const sampleHandler: any = {};

sampleHandler.handleReqRes = (
  reqProps: RequestProps,
  callback: (statusCode: number, response: { message: string }) => void,
) => {
  callback(200, { message: 'Welcome to sample page' });
};
