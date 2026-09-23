import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // Fail fast: the app is useless without a database.
  // eslint-disable-next-line no-console
  console.warn(
    "DATABASE_URL is not set. Copy backend/.env.example to backend/.env and fill it in."
  );
}

export const pool = new Pool({
  connectionString,
});

pool.on("error", (err) => {
  // eslint-disable-next-line no-console
  console.error("Unexpected error on idle PostgreSQL client", err);
});

export default pool;
