import { pgTable, text } from "drizzle-orm/pg-core";

export const collection = pgTable("collection", {
  id: text("id"),
});
