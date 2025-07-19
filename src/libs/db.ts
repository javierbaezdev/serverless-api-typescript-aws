import { PrismaClient } from '@prisma/client';

function resolveDatabaseUrl(): string {
  const env = process.env.ENV;

  const map: Record<string, string | undefined> = {
    dev: process.env.DATABASE_URL,
    qa: process.env.DATABASE_URL_QA,
    prod: process.env.DATABASE_URL_PROD,
  };

  const url = map[env!] ?? process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      `No se encontró DATABASE_URL para el entorno "${env}".\n` +
        `Asegúrate de tener definida la variable correspondiente en tu .env`
    );
  }
  return url;
}

process.env.DATABASE_URL = resolveDatabaseUrl();

console.log('🗄️  DATABASE_URL:', process.env.DATABASE_URL);

const prisma = new PrismaClient();
export default prisma;
