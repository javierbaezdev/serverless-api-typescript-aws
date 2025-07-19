import { APIGatewayProxyEvent } from 'aws-lambda';
import { ErrorCatch, formatJSONResponse } from '@/libs/apiGateway.lib';
import { updateFarmanalisisUser } from '@/modules/users/services/adminUser.service';
import { updateFarmanalisisUserSchema } from '@/modules/users/validations/user.schema';
import { authMiddleware } from '@/middleware/authMiddleware';

export const baseHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const parsed = updateFarmanalisisUserSchema.safeParse(body);

    if (!parsed.success) {
      return formatJSONResponse({
        statusCode: 'BAD_REQUEST',
        response: {
          error: 'Validation failed',
          details: parsed.error.errors,
        },
      });
    }

    const result = await updateFarmanalisisUser(parsed.data);

    if (!result.success) {
      return formatJSONResponse({
        statusCode: 'INTERNAL_SERVER_ERROR',
        response: {
          error: result.error,
        },
      });
    }

    return formatJSONResponse({
      statusCode: 'OK',
      response: {
        data: result.data,
      },
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
