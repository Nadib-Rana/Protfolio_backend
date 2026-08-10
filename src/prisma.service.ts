import "dotenv/config";
import { Injectable } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const connectionString =
      process.env.DATABASE_URL ||
      "postgresql://postgres:postgres@localhost:5432/portfolio_db";

    const isSslRequired =
      connectionString.includes("sslmode=require") ||
      connectionString.includes("sslmode=no-verify") ||
      process.env.DATABASE_SSL === "true";

    const adapter = new PrismaPg({
      connectionString,
      ssl: isSslRequired ? { rejectUnauthorized: false } : undefined,
    });
    super({ adapter });
  }
}
