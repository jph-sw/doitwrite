import Database from "better-sqlite3";

export const db = new Database("./db.db");

db.prepare(`
  CREATE TABLE IF NOT EXISTS collection (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    icon TEXT,
    color TEXT
  )
  `);
