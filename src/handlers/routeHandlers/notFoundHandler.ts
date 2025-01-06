import { RequestProps } from '../../helpers/handleReqRes';

export const notFoundHandler: any = {};

notFoundHandler.handleReqRes = (
  reqProps: RequestProps,
  callback: (statusCode: number, response: { message: string }) => void,
) => {
  callback(404, { message: 'Not found!' });
};
