import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const schemaPath = path.resolve("prisma/schema.prisma");
let schema = fs.readFileSync(schemaPath, "utf8");

const databaseUrl = process.env.DATABASE_URL || "";
const isPostgres = databaseUrl && 
  (databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://")) &&
  !databaseUrl.includes("USER:PASSWORD@HOST");

if (isPostgres) {
  console.log("PostgreSQL database URL detected. Configured for PostgreSQL.");
  
  // Replace the SQLite provider and URL with PostgreSQL provider and env(DATABASE_URL)
  schema = schema.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
  schema = schema.replace(/url\s*=\s*"file:dev.sqlite"/g, 'url = env("DATABASE_URL")');
  
  // Ensure the binaryTargets match what Vercel needs (native + AWS Lambda rhel targets)
  if (schema.includes("generator client {") && !schema.includes("binaryTargets")) {
    schema = schema.replace(
      /generator client \{/,
      `generator client {\n  binaryTargets = ["native", "rhel-openssl-1.0.x", "rhel-openssl-3.0.x"]`
    );
  }
  
  fs.writeFileSync(schemaPath, schema, "utf8");
  
  console.log("Generating Prisma Client for PostgreSQL...");
  execSync("npx prisma generate", { stdio: "inherit" });
  
  console.log("Syncing database schema to PostgreSQL (db push)...");
  execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });
} else {
  console.log("SQLite database detected (or default placeholder URL). Configured for SQLite.");
  
  // Ensure the schema is SQLite (in case it was modified locally or we are running local commands)
  schema = schema.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
  schema = schema.replace(/url\s*=\s*env\("DATABASE_URL"\)/g, 'url = "file:dev.sqlite"');
  
  fs.writeFileSync(schemaPath, schema, "utf8");
  
  console.log("Generating Prisma Client for SQLite...");
  execSync("npx prisma generate", { stdio: "inherit" });
  
  console.log("Deploying SQLite migrations...");
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
}
