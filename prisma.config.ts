import type { PrismaConfig } from 'prisma'

export default {
  earlyAccess: true,
  schema: './apps/api/prisma/schema.prisma',
} satisfies PrismaConfig
