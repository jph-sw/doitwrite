import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "./server/db";
import { collection } from "./server/schema";

export const createCollection = createServerFn({ method: "POST" })
  .validator((data) => {
    if (!(data instanceof FormData)) {
      throw new Error("Invalid form data");
    }

    const name = data.get("name");
    const color = data.get("color");
    const team_id = data.get("team_id");
    const created_by = data.get("created_by");
    const updated_by = data.get("updated_by");

    if (!name || !color || !team_id || !created_by || !updated_by) {
      throw new Error("Param is required");
    }

    return {
      name: name.toString(),
      color: color.toString(),
      team_id: team_id.toString(),
      created_by: created_by.toString(),
      updated_by: updated_by.toString(),
    };
  })
  .handler(async (ctx) => {
    const res = await db
      .insert(collection)
      .values({ id: randomUUID(), ...ctx.data })
      .returning();

    return res;
  });

export const fetchCollection = createServerFn({ method: "GET" })
  .validator((collectionId: string) => {
    console.log("collectionId: ", collectionId);
    if (!collectionId) {
      throw new Error("collectionId is required");
    }

    return collectionId;
  })
  .handler(async (ctx) => {
    const res = await db.select().from(collection).where(eq(collection.id, ctx.data));

    return res[0];
  });

export const collectionQueryOptions = (collectionId: string) =>
  queryOptions({
    queryKey: ["collection", collectionId],
    queryFn: () => fetchCollection({ data: collectionId }),
  });

export const collectionsQueryOptions = (teamId: string) =>
  queryOptions({
    queryKey: ["collections", teamId],
    queryFn: () => fetchCollections({ data: teamId }),
  });

export const fetchCollections = createServerFn({ method: "GET" })
  .validator((teamId: string) => {
    if (!teamId) {
      throw new Error("teamId is required");
    }

    return teamId;
  })
  .handler(async (ctx) => {
    const res = await db
      .select()
      .from(collection)
      .where(eq(collection.team_id, ctx.data));

    return res;
  });

export const fetchAllCollections = createServerFn({ method: "GET" })
  .validator((teamIds: string[]) => {
    if (!teamIds) {
      throw new Error("teamIds is required");
    }

    return teamIds;
  })
  .handler(async (ctx) => {
    const res: (typeof collection.$inferSelect)[] = [];

    for (const teamId of ctx.data) {
      const response = await db
        .select()
        .from(collection)
        .where(eq(collection.team_id, teamId));

      res.push(...response);
    }

    return res;
  });
