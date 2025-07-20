import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const prismaDir = join(__dirname, 'prisma');

// 1. Leer header
const header = readFileSync(join(prismaDir, 'schema.header.prisma'), 'utf-8');

// 2. Leer enums
const enums = readFileSync(join(prismaDir, 'enums.prisma'), 'utf-8');

// 3. Leer todos los modelos
const modelsDir = join(prismaDir, 'models');
const modelFiles = readdirSync(modelsDir).filter((f) => f.endsWith('.prisma'));

const models = modelFiles
  .map((f) => readFileSync(join(modelsDir, f), 'utf-8'))
  .join('\n\n');

// 4. Construir schema.prisma
const finalSchema = [header, enums, models].join('\n\n');
writeFileSync(join(prismaDir, 'schema.prisma'), finalSchema);

console.log('✅ prisma/schema.prisma regenerado');
