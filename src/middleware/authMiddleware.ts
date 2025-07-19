import { verifyToken } from '@/utils/jwt';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import prisma from '../libs/db';
import { Users } from '@prisma/client';

type AuthOptions = {
  allowedRoles?: string[]; // opcional: si no se pasa, deja pasar a cualquiera autenticado
};

export type AuthenticatedEvent = APIGatewayProxyEvent & { user: Users };

type AsyncAPIGatewayHandler = (
  event: APIGatewayProxyEvent,
  context: Context
) => Promise<APIGatewayProxyResult>;

export const authMiddleware =
  (handler: AsyncAPIGatewayHandler, options: AuthOptions = {}) =>
  async (event: APIGatewayProxyEvent, context: Context) => {
    const authHeader =
      event.headers.Authorization || event.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Token no proporcionado o inválido' }),
      };
    }

    try {
      const token = authHeader.replace('Bearer ', '');
      const decoded = verifyToken<{ userId: number }>(token);

      const user = await prisma.users.findUnique({
        where: { id: decoded.userId },
        include: {
          roles: true,
        },
      });

      if (!user || !user.isActive || user.isDeleted) {
        return {
          statusCode: 403,
          body: JSON.stringify({ message: 'Usuario no autorizado' }),
        };
      }

      // ⛔ Validación de rol
      if (
        options.allowedRoles &&
        !options.allowedRoles.includes(user.roles?.name)
      ) {
        return {
          statusCode: 403,
          body: JSON.stringify({ message: 'No tiene permisos suficientes' }),
        };
      }

      (event as AuthenticatedEvent).user = user;

      return await handler(event, context);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      return {
        statusCode: 403,
        body: JSON.stringify({
          message: 'Token inválido o expirado',
          error: errorMessage,
        }),
      };
    }
  };
