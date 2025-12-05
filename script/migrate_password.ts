
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../shared/schema";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";

console.log("CWD:", process.cwd());
console.log("Files in CWD:", fs.readdirSync(process.cwd()));

const envPath = path.resolve(process.cwd(), ".env");
console.log("Loading .env from:", envPath);
console.log(".env exists:", fs.existsSync(envPath));

dotenv.config({ path: envPath });

if (!process.env.DATABASE_URL) {
    console.error("Env vars loaded:", Object.keys(process.env));
    throw new Error("DATABASE_URL is not set");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

async function main() {
    console.log("Migrating database...");
    try {
        await sql`ALTER TABLE users ALTER COLUMN password DROP NOT NULL`;
        console.log("Migration successful: password column is now optional.");
    } catch (error) {
        console.error("Migration failed:", error);
    }
    process.exit(0);
}

main();
