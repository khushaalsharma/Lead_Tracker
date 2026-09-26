/* eslint-disable no-console */
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

export async function migrate() {
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,              // server hosting the DB
    database: process.env.DB_NAME, 
    password: process.env.DB_PASS,
    port: 5432
  });
  const migrationsDir = path.join(__dirname, "..", "migrations");
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
    console.log(`Applying migration: ${file}`);
    await pool.query(sql);
  }

  console.log("All migrations applied successfully.");
  await pool.end();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
