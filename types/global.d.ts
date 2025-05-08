import { PrismaClient } from "@prisma/client";
declare module "@prisma/nextjs-monorepo-workaround-plugin";
declare global {
  var prisma: PrismaClient | undefined;
}
