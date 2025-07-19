import { ErrorCatch, formatJSONResponse } from '@/libs/apiGateway.lib';
import { updateProfileFarmanalisisUser } from '@/modules/users/services/adminUser.service';
import { updateProfileFarmanalisisUserSchema } from '@/modules/users/validations/user.schema';
import {
  AuthenticatedEvent,
  authMiddleware,
} from '@/middleware/authMiddleware';

export const baseHandler = async (event: AuthenticatedEvent) => {
  try {
    const currentUser = event.user;
    const body = JSON.parse(event.body || '{}');
    const parsed = updateProfileFarmanalisisUserSchema.safeParse(body);

    if (!parsed.success) {
      return formatJSONResponse({
        statusCode: 'BAD_REQUEST',
        response: {
          error: 'Validation failed',
          details: parsed.error.errors,
        },
      });
    }

    if (!currentUser) {
      return formatJSONResponse({
        statusCode: 'UNAUTHORIZED',
        response: {
          error: 'No autorizado',
        },
      });
    }

    const result = await updateProfileFarmanalisisUser(
      parsed.data,
      currentUser
    );

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
