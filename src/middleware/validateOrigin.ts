import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
} from 'aws-lambda';

type LambdaHandler = (
  event: APIGatewayProxyEvent,
  context: Context
) => Promise<APIGatewayProxyResult>;

/**
 * Middleware que valida el Origin contra ORIGIN_<ENV> variables
 * y permite '*' (todos) si está definido así.
 */
export const validateOrigin = (handler: LambdaHandler): LambdaHandler => {
  return async (event, context) => {
    const requestOrigin = event.headers?.origin || '';
    const env = (process.env.ENV || 'dev').toUpperCase();
    const dynamicKey = `ORIGIN_${env}`;

    const allowedOriginString = process.env[dynamicKey] || '';
    const allowedOrigins = allowedOriginString
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);

    const isWildcard = allowedOrigins.includes('*');
    const isAllowed = isWildcard || allowedOrigins.includes(requestOrigin);

    if (!isAllowed) {
      return {
        statusCode: 403,
        headers: {
          'Content-Type': 'application/json',
          Vary: 'Origin',
        },
        body: JSON.stringify({
          message: `Forbidden: Origin ${requestOrigin} not allowed`,
        }),
      };
    }

    const response = await handler(event, context);

    const mergedHeaders: { [key: string]: string } = {
      ...(response.headers || {}),
      'Access-Control-Allow-Origin': isWildcard ? '*' : requestOrigin,
      'Access-Control-Allow-Credentials': 'true',
      Vary: 'Origin',
    };

    return {
      ...response,
      headers: mergedHeaders,
    };
  };
};
