import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { randomUUID } from "node:crypto";
import { user } from "./auth.schema";

export const collection = pgTable("collection", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull().default("#ffffff"),
  team_id: text("team_id").references(() => team.id, { onDelete: "cascade" }),
  created_by: text("created_by").references(() => user.id, { onDelete: "cascade" }),
  updated_by: text("updated_by").references(() => user.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at").$defaultFn(() => /* @__PURE__ */ new Date()),
  updated_at: timestamp("updated_at").$defaultFn(() => /* @__PURE__ */ new Date()),
});

export const member = pgTable("member", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  teamId: text("team_id").references(() => team.id, { onDelete: "cascade" }),
});

export const team = pgTable("team", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  created_at: timestamp("created_at").$defaultFn(() => /* @__PURE__ */ new Date()),
});

export const entry = pgTable("entry", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => /* @__PURE__ */ randomUUID()),
  name: text("name").notNull(),
  content: text("content"),
  created_by: text("created_by").notNull(),
  updated_by: text("updated_by").notNull(),
  created_at: timestamp("created_at").$defaultFn(() => /* @__PURE__ */ new Date()),
  updated_at: timestamp("updated_at").$defaultFn(() => /* @__PURE__ */ new Date()),
  team_id: text("team_id")
    .references(() => team.id, { onDelete: "cascade" })
    .notNull(),
  collection_id: text("collection_id")
    .references(() => collection.id, { onDelete: "cascade" })
    .notNull(),
});
