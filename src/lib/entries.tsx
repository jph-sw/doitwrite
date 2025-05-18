import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "./server/db";
import { entry } from "./server/schema";

export const fetchEntries = createServerFn({ method: "GET" })
  .validator((collectionId: string) => {
    if (!collectionId) {
      throw new Error("collectionId is neeeded");
    }

    return collectionId;
  })
  .handler(async (ctx) => {
    const res = await db.select().from(entry).where(eq(entry.collection_id, ctx.data));

    return res;
  });

export const fetchEntry = createServerFn({ method: "GET" })
  .validator((entryId: string) => {
    if (!entryId) {
      throw new Error("entryId is required");
    }

    return entryId;
  })
  .handler(async (ctx) => {
    const res = await db.select().from(entry).where(eq(entry.id, ctx.data));

    return res[0];
  });

export const createEntry = createServerFn({ method: "POST" })
  .validator(
    (newEntry: {
      name: string;
      team_id: string;
      collection_id: string;
      created_by: string;
      updated_by: string;
      content: string;
    }) => {
      if (!newEntry) {
        throw new Error("newEntry is required");
      }

      return newEntry;
    },
  )
  .handler(async (ctx) => {
    const res = await db.insert(entry).values(ctx.data).returning();

    console.log(res);

    return res;
  });

export const updateEntry = createServerFn({ method: "POST" })
  .validator((data: { newEntry: typeof entry.$inferInsert }) => {
    if (!data.newEntry) {
      throw new Error("newEntry is required");
    }

    console.log("data: ", data);

    return data;
  })
  .handler(async (ctx) => {
    console.log("updating");
    const res = await db
      .update(entry)
      .set(ctx.data.newEntry)
      .where(eq(entry.id, ctx.data.newEntry.id || ""))
      .returning();

    return res;
  });

export const entriesQueryOptions = (collectionId: string) =>
  queryOptions({
    queryKey: ["entries", collectionId],
    queryFn: () => fetchEntries({ data: collectionId }),
  });

export const entryQueryOptions = (entryId: string) =>
  queryOptions({
    queryKey: ["entry", entryId],
    queryFn: () => fetchEntry({ data: entryId }),
  });
