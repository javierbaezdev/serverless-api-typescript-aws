import { APIGatewayProxyEvent } from 'aws-lambda';
import { ErrorCatch, formatJSONResponse } from '../../../libs/apiGateway.lib';
import { toggleActiveUser } from '../services/user.service';
import { authMiddleware } from '@/middleware/authMiddleware';

export const baseHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return formatJSONResponse<ErrorCatch>({
        response: {
          errorName: 'USER',
          errorMessage: 'No id provided',
          internalErrorCode: 'USER',
        },
        statusCode: 'INTERNAL_SERVER_ERROR',
      });
    }

    const result = await toggleActiveUser(Number(id));

    if (!result) {
      return formatJSONResponse<ErrorCatch>({
        response: {
          errorName: 'USER',
          errorMessage: 'User not found',
          internalErrorCode: 'USER',
        },
        statusCode: 'INTERNAL_SERVER_ERROR',
      });
    }

    return formatJSONResponse({
      response: {
        data: result.data,
      },
      statusCode: 'OK',
    });
  } catch (error) {
    return formatJSONResponse<ErrorCatch>({
      response: {
        errorName: error.name,
        errorMessage: error.message,
        internalErrorCode: 'USER',
      },
      statusCode: 'INTERNAL_SERVER_ERROR',
    });
  }
};

export const handler = authMiddleware(baseHandler, {
  allowedRoles: ['ADMIN'],
});
