import { defineConfig } from 'prisma/config';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL || 
  'postgresql://admin:adminpassword@localhost:5432/kristallball?schema=public';

export default defineConfig({
  earlyAccess: true,
  schema: 'prisma/schema.prisma',
});
