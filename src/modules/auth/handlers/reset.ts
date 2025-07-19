import { APIGatewayProxyEvent } from 'aws-lambda';
import { ErrorCatch, formatJSONResponse } from '@/libs/apiGateway.lib';
import { resetSchema } from '../validations/auth.schema';
import { resetPassword } from '../services/auth.service';

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const parsed = resetSchema.safeParse(body);

    if (!parsed.success) {
      return formatJSONResponse({
        statusCode: 'BAD_REQUEST',
        response: {
          error: 'Validation failed',
          details: parsed.error.errors,
        },
      });
    }

    const result = await resetPassword(parsed.data);

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
