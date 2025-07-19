import { validateOrigin } from '@/middleware';

export const baseHandler = async () => {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Hello World',
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message,
      }),
    };
  }
};

export const handler = validateOrigin(baseHandler);
