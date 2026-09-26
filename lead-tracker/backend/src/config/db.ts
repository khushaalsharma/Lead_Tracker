import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,              // server hosting the DB
    database: process.env.DB_NAME, 
    password: process.env.DB_PASS,
    port: 5432
  });

pool.on("error", (err) => {
  // eslint-disable-next-line no-console
  console.error("Unexpected error on idle PostgreSQL client", err);
});

export default pool;
