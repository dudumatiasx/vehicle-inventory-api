// src/db.js
import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;
export const pool = new Pool({
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id SERIAL PRIMARY KEY,
      plate VARCHAR(10) UNIQUE NOT NULL,
      model VARCHAR(50) NOT NULL,
      year INTEGER NOT NULL,
      mileage INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log('✔️ vehicles table initialized');
}
