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
  CREATE DATABASE IF NOT EXISTS doitwrite
  `);

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

pool.query(`
  CREATE TABLE IF NOT EXISTS favorite (
    id SERIAL PRIMARY KEY,
    entry_id INTEGER NOT NULL,
    user_id TEXT NOT NULL
  )
  `);

pool.query(
  `create table if not exists "user" ("id" text not null primary key, "name" text not null, "email" text not null unique, "emailVerified" boolean not null, "image" text, "createdAt" timestamp not null, "updatedAt" timestamp not null);`,
);

pool.query(
  `create table if not exists "session" ("id" text not null primary key, "expiresAt" timestamp not null, "token" text not null unique, "createdAt" timestamp not null, "updatedAt" timestamp not null, "ipAddress" text, "userAgent" text, "userId" text not null references "user" ("id"));`,
);

pool.query(
  `create table if not exists "account" ("id" text not null primary key, "accountId" text not null, "providerId" text not null, "userId" text not null references "user" ("id"), "accessToken" text, "refreshToken" text, "idToken" text, "accessTokenExpiresAt" timestamp, "refreshTokenExpiresAt" timestamp, "scope" text, "password" text, "createdAt" timestamp not null, "updatedAt" timestamp not null);`,
);

pool.query(
  `create table if not exists "verification" ("id" text not null primary key, "identifier" text not null, "value" text not null, "expiresAt" timestamp not null, "createdAt" timestamp, "updatedAt" timestamp);`,
);
