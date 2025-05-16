import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";

export const collection = pgTable("collection", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
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
});
