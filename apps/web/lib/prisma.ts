import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/prisma/generated/prisma/client";
import { PrismaNeon } from '@prisma/adapter-neon'

const isProduction = process.env.PROD === "True";
const connectionString = `${process.env.DATABASE_URL_LOCAL}`;

let adapter

if (isProduction) {
  adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL_LOCAL! });
} else {
  adapter = new PrismaLibSql({ url: connectionString });
}
 
export const prisma = new PrismaClient({ adapter });
