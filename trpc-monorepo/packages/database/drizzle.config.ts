import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { env } from "./env";

console.log("DATABASE_URL =", env.DATABASE_URL);

export default defineConfig({
  out: "./drizzle",
  schema: "./schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});