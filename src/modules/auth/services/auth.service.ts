/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from '@/libs/db';
import { ResponseService } from '@/modules/types/responseService';
import {
  ForgotPasswordInput,
  LoginInput,
  ResetSchemaInput,
} from '@/modules/auth/validations/auth.schema';
import { comparePassword, hashPassword } from '@/utils/bcrypt';
import { generateToken, verifyToken } from '@/utils/jwt';
import {
  forgotPasswordResponse,
  loginResponse,
  resetPasswordResponse,
} from '../types';

export const login = async (
  data: LoginInput
): Promise<ResponseService<loginResponse>> => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        email: data.email,
        isDeleted: false,
        isActive: true,
      },
      include: {
        roles: {
          select: {
            name: true,
          },
        },
        distributor: {
          select: {
            name: true,
          },
        },
        pharmacy: {
          select: {
            companyName: true,
          },
        },
        pharmacyBranchesUsers: {
          select: {
            pharmacyBranch: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return {
        success: false,
        error: 'Usuario no encontrado',
      };
    }

    const compare = await comparePassword(data.password, user.password);

    if (!compare) {
      return {
        success: false,
        error: 'Error al autenticar',
      };
    }

    const token = generateToken(
      {
        userId: user.id,
      },
      '15d'
    );

    if (!token) {
      return {
        success: false,
        error: 'Error al generar token',
      };
    }

    return {
      success: true,
      data: {
        user: user,
        token,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const forgotPassword = async (
  data: ForgotPasswordInput
): Promise<ResponseService<forgotPasswordResponse>> => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        email: data.email,
        isDeleted: false,
        isActive: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: 'Usuario no encontrado',
      };
    }

    //TODO: enviar correo con link de reseteo de contraseña y token

    const token = generateToken(
      {
        userId: user.id,
      },
      undefined,
      'RESET'
    );

    return {
      success: true,
      data: {
        message: 'Correo enviado, revisa tu bandeja de entrada',
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const resetPassword = async (
  data: ResetSchemaInput
): Promise<ResponseService<resetPasswordResponse>> => {
  try {
    const { token, password, confirmPassword } = data;

    const decodedToken = verifyToken<{ userId: number }>(token, 'RESET');

    if (!decodedToken) {
      return {
        success: false,
        error: 'Token no válido',
      };
    }

    const user = await prisma.users.findUnique({
      where: {
        id: decodedToken.userId,
        isDeleted: false,
        isActive: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: 'Usuario no encontrado',
      };
    }

    if (password !== confirmPassword) {
      return {
        success: false,
        error: 'Las contraseñas no coinciden',
      };
    }

    const passwordHash = await hashPassword(password);

    await prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        password: passwordHash,
      },
    });

    return {
      success: true,
      data: {
        message: 'Contraseña actualizada',
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
