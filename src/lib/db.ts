import { Pool, QueryResultRow } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const query = <Result extends QueryResultRow>(
  text: string,
  params: string[] = [],
) => {
  return pool.query<Result>(text, params);
};
pool.query(`
  CREATE TABLE IF NOT EXISTS entry (
    id SERIAL PRIMARY KEY,
    collection_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content TEXT NOT NULL
  )
  `);

pool.query(`
  CREATE TABLE IF NOT EXISTS collection (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    color TEXT
  )
  `);
