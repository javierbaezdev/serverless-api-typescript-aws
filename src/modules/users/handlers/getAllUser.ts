import { APIGatewayProxyEvent } from 'aws-lambda';
import { ErrorCatch, formatJSONResponse } from '../../../libs/apiGateway.lib';
import { getAllUsers } from '../services/user.service';
import { authMiddleware } from '@/middleware/authMiddleware';

const parseRoleId = (
  roleIdParam?: string | string[] | number[]
): number | number[] | undefined => {
  if (roleIdParam == null) {
    return undefined;
  }

  // 1) Normalizamos a un array “crudo”
  let rawItems: unknown[];
  if (Array.isArray(roleIdParam)) {
    rawItems = roleIdParam;
  } else {
    // Si es string, intentamos JSON.parse
    if (typeof roleIdParam === 'string') {
      try {
        const parsed = JSON.parse(roleIdParam);
        if (Array.isArray(parsed)) {
          rawItems = parsed;
        } else {
          rawItems = [roleIdParam];
        }
      } catch {
        // Fallback: "1,2,3" => ["1","2","3"]
        rawItems = roleIdParam.includes(',')
          ? roleIdParam.split(',')
          : [roleIdParam];
      }
    } else {
      // nunca debería llegar aquí, pero por si acaso
      rawItems = [roleIdParam];
    }
  }

  // 2) Convertimos todo a número
  const nums = rawItems
    .map((item) => parseInt(String(item).trim(), 10))
    .filter((n): n is number => !isNaN(n));

  if (nums.length === 0) {
    return undefined;
  }
  return nums.length === 1 ? nums[0] : nums;
};

export const baseHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const query = event.queryStringParameters || {};

    const q = query.q || undefined;
    const isActive =
      query.isActive === 'true'
        ? true
        : query.isActive === 'false'
        ? false
        : undefined;
    const roleId = parseRoleId(query.roleId);
    const distributorId = query.distributorId
      ? parseInt(query.distributorId, 10)
      : undefined;
    const pharmacyId = query.pharmacyId
      ? parseInt(query.pharmacyId, 10)
      : undefined;
    const page = query.page ? parseInt(query.page, 10) : 1;
    const limit = query.limit ? parseInt(query.limit, 10) : 10;

    console.log({ roleId });

    const result = await getAllUsers({
      q,
      isActive,
      roleId,
      distributorId,
      pharmacyId,
      page,
      limit,
    });

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
      response: result.data,
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
