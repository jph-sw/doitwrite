"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getQueryClient } from "@/lib/get-query-client";
import { entryOptions } from "@/lib/query-options";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function DangerSettings({ id }: { id: string }) {
  const queryClient = getQueryClient();

  const { data: entries } = useQuery(entryOptions);

  const [isPending, setIsPending] = useState(false);

  // Count entries in this collection
  const entriesInCollection =
    entries?.filter((entry) => entry.collection_id.toString() === id) || [];
  const entriesCount = entriesInCollection.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danger</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Deleting this collection will also delete {entriesCount}{" "}
          {entriesCount === 1 ? "entry" : "entries"} that belong to it. This
          action cannot be undone.
        </p>
        <Button
          disabled={isPending}
          onClick={async () => {
            setIsPending(true);
            try {
              await fetch(`/api/collection?id=${id}`, { method: "DELETE" });

              // Invalidate both collections and entries queries
              queryClient.invalidateQueries({ queryKey: ["collections"] });
              queryClient.invalidateQueries({ queryKey: ["entries"] });
            } catch (error) {
              console.error("Failed to delete collection:", error);
            } finally {
              setIsPending(false);
            }
          }}
          variant={"destructive"}
        >
          {isPending ? "Deleting..." : "Delete Collection"}
        </Button>
      </CardContent>
    </Card>
  );
}
