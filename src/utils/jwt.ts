// src/utils/jwt.ts
import * as jwt from 'jsonwebtoken';

const ENV = process.env.ENV;

// Secrets y expirations
const JWT_SECRET = process.env.JWT_SECRET ?? 'TOKEN_LOGIN';
const JWT_DEFAULT_EXPIRATION = process.env.JWT_DEFAULT_EXPIRATION ?? '1h';

const JWT_RESET_SECRET = process.env.JWT_RESET ?? '';
const JWT_RESET_EXPIRATION = process.env.JWT_RESET_EXPIRATION ?? '15m';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required');
}

interface JwtPayload {
  [key: string]: unknown;
}

export const generateToken = (
  payload: JwtPayload,
  /**
   * Para LOGIN permite sobreescribir; para RESET ignora este parámetro.
   */
  expiresIn: string | number = JWT_DEFAULT_EXPIRATION,
  variant: 'LOGIN' | 'RESET' = 'LOGIN'
): string => {
  // Elegimos el secret
  const secretToUse: jwt.Secret =
    variant === 'RESET' && JWT_RESET_SECRET
      ? (JWT_RESET_SECRET as jwt.Secret)
      : (JWT_SECRET as jwt.Secret);

  // Elegimos la expiración
  const expirationToUse: string | number =
    variant === 'RESET' ? JWT_RESET_EXPIRATION : expiresIn;

  return jwt.sign(payload, secretToUse, {
    // casteamos a StringValue | number
    expiresIn: expirationToUse as jwt.SignOptions['expiresIn'],
  } as jwt.SignOptions);
};

export const verifyToken = <T = JwtPayload>(
  token: string,
  variant: 'LOGIN' | 'RESET' = 'LOGIN'
): T => {
  const secretToUse: jwt.Secret =
    variant === 'RESET' && JWT_RESET_SECRET
      ? (JWT_RESET_SECRET as jwt.Secret)
      : (JWT_SECRET as jwt.Secret);

  const verifyOptions: jwt.VerifyOptions =
    ENV === 'dev' ? { ignoreExpiration: true } : {};

  return jwt.verify(token, secretToUse, verifyOptions) as T;
};
