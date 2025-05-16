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

export const entryQueryOptions = (collectionId: string) =>
  queryOptions({
    queryKey: ["entries", collectionId],
    queryFn: () => fetchEntries({ data: collectionId }),
  });
