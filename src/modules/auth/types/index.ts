import { Users } from '@prisma/client';

export type loginResponse = {
  user: Users;
  token: string;
};

export type forgotPasswordResponse = {
  message: string;
};

export type resetPasswordResponse = {
  message: string;
};
