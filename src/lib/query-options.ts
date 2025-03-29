import { queryOptions } from "@tanstack/react-query";
import { Entry, Collection } from "./types";

export const collectionOptions = queryOptions({
  queryKey: ["collections"],
  queryFn: async () => {
    const res = await fetch("/api/collection");
    return res.json() as Promise<Collection[]>;
  },
});

export const entryOptions = queryOptions({
  queryKey: ["entries"],
  queryFn: async () => {
    const res = await fetch("/api/entry");

    return res.json() as Promise<Entry[]>;
  },
});
