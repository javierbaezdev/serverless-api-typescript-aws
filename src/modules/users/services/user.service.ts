import { PaginatedResponse } from '@/modules/types/paginatedList';
import prisma from '../../../libs/db';
import { GetListFarmanalisisUserInput } from '@/modules/users/validations/user.schema';
import { Prisma, Users } from '@prisma/client';
import { ResponseService } from '@/modules/types/responseService';

export const getAllUsers = async (
  data: GetListFarmanalisisUserInput
): Promise<ResponseService<PaginatedResponse<Users>>> => {
  try {
    const {
      q,
      isActive,
      roleId,
      distributorId,
      pharmacyId,
      page = 1,
      limit = 10,
    } = data;

    const where: Prisma.UsersWhereInput = {
      isDeleted: false,
    };

    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    if (typeof roleId === 'number') {
      where.roleid = roleId;
    }

    if (Array.isArray(roleId)) {
      where.roleid = { in: roleId };
    }

    if (distributorId) {
      where.distributorId = distributorId;
    }

    if (pharmacyId) {
      where.pharmacyId = pharmacyId;
    }

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { lastName: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
      ];
    }

    const users = await prisma.users.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        distributor: {
          select: {
            id: true,
            name: true,
          },
        },
        pharmacy: {
          select: {
            id: true,
            companyName: true,
          },
        },
        pharmacyBranchesUsers: {
          select: {
            pharmacyBranch: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        roles: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const usersFlattened = users.map((user) => ({
      ...user,
      pharmacyBranchesUsers: user.pharmacyBranchesUsers.map(
        (pbu) => pbu.pharmacyBranch
      ),
    }));

    const total = await prisma.users.count({ where });

    return {
      success: true,
      data: {
        data: usersFlattened,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const getUserById = async (
  id: number
): Promise<ResponseService<Users> | null> => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const deleteUser = async (
  id: number
): Promise<ResponseService<Users>> => {
  try {
    const user = await prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    //cambiar a deleted
    const updatedUser = await prisma.users.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    return {
      success: true,
      data: updatedUser,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export const toggleActiveUser = async (
  id: number
): Promise<ResponseService<Users>> => {
  try {
    const user = await prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const updatedUser = await prisma.users.update({
      where: { id },
      data: {
        isActive: !user.isActive,
      },
    });

    return {
      success: true,
      data: updatedUser,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};
