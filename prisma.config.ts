import { config } from 'dotenv';
import { defineConfig, env } from 'prisma/config';

config({ path: '.env.local' });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Supabase: use direct connection (port 5432) for Prisma CLI / migrations
    url: env('DIRECT_URL'),
  },
});
