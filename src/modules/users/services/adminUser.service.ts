import prisma from '@/libs/db';
import {
  CreateFarmanalisisUserInput,
  UpdateFarmanalisisUserInput,
  UpdateProfileFarmanalisisUserInput,
} from '@/modules/users/validations/user.schema';
import { Users } from '@prisma/client';
import { ResponseService } from '@/modules/types/responseService';
import { comparePassword, hashPassword } from '@/utils/bcrypt';
import { ROLES_ID } from '@/constants/app';
import { randomBytes } from 'crypto';

export const createFamanalisisUser = async (
  data: CreateFarmanalisisUserInput
): Promise<ResponseService<Users>> => {
  try {
    //validar si correo existe
    const user = await prisma.users.findUnique({
      where: {
        email: data.email,
      },
    });
    if (user) {
      return {
        success: false,
        error: 'El correo ya existe',
      };
    }

    const randomString = randomBytes(16).toString('hex');
    //emcriptar el password
    const hashedPassword = await hashPassword(randomString);

    const userCreated: Users = await prisma.users.create({
      data: {
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        roleid: ROLES_ID.FARMANALISIS,
        isActive: data.isActive,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        sellerCode: null,
        isActiveSellerCode: false,
      },
    });

    if (!userCreated) {
      return {
        success: false,
        error: 'Error al crear el usuario',
      };
    }

    return {
      success: true,
      data: userCreated,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const updateFarmanalisisUser = async (
  data: UpdateFarmanalisisUserInput
): Promise<ResponseService<Users>> => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: data.id, roleid: ROLES_ID.FARMANALISIS }, // role 1: farmanalisis
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const emailExists = await prisma.users.findFirst({
      where: {
        email: data.email,
        id: { not: data.id },
        isDeleted: false,
      },
    });

    if (emailExists) {
      return {
        success: false,
        error: 'El correo ya está en uso por otro usuario',
      };
    }

    const dataToUpdate: Partial<Users> = {
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      isActive: data.isActive,
    };

    const updatedUser = await prisma.users.update({
      where: { id: data.id },
      data: dataToUpdate,
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

export const updateProfileFarmanalisisUser = async (
  data: UpdateProfileFarmanalisisUserInput,
  currentUser: Users
): Promise<ResponseService<Partial<Users>>> => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: currentUser.id },
    });

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    // Validamos que el email no esté en uso por otro usuario
    const emailExists = await prisma.users.findFirst({
      where: {
        email: data.email,
        id: { not: currentUser.id },
        isDeleted: false,
      },
    });

    if (emailExists) {
      return {
        success: false,
        error: 'El correo ya está en uso por otro usuario',
      };
    }

    let formatBody: Partial<Users> = {
      name: data.name,
      lastName: data.lastName,
      email: data.email,
    };

    if (data.currentPassword) {
      const isPasswordCorrect = await comparePassword(
        data.currentPassword,
        currentUser.password
      );

      if (!isPasswordCorrect) {
        return {
          success: false,
          error: 'La contraseña actual no es correcta',
        };
      }

      if (data.newPassword && data.newPassword !== data.confirmPassword) {
        return {
          success: false,
          error: 'La nueva contraseña y su confirmación no coinciden',
        };
      }

      if (data.newPassword) {
        const hashedPassword = await hashPassword(data.newPassword);
        formatBody = {
          ...formatBody,
          password: hashedPassword,
        };
      }
    }

    // actualizar
    const updatedUser = await prisma.users.update({
      where: { id: currentUser.id },
      data: formatBody,
    });

    const userResponse = {
      name: updatedUser.name,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
    };

    return {
      success: true,
      data: userResponse,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};
