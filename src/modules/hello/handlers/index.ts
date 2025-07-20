import { validateOrigin } from '@/middleware';

import { formatJSONResponse } from '@/libs/apiGateway.lib';
import { sendEmailService } from '../services';

export const baseHandler = async () => {
  try {
    const result = await sendEmailService();
    return formatJSONResponse({
      statusCode: 'OK',
      response: {
        data: result,
      },
    });
  } catch (err) {
    return formatJSONResponse({
      statusCode: 'INTERNAL_SERVER_ERROR',
      response: {
        errorName: err.name,
        errorMessage: err.message,
        internalErrorCode: 'TEST-SEND-EMAIL',
      },
    });
  }
};

export const handler = validateOrigin(baseHandler);
