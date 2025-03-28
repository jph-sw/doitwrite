"use client";

import { getEntryById, updateEntryTitle } from "@/app/actions/entry";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Input } from "../ui/input";
import TiptapEditor from "./TiptapEditor";
import { Skeleton } from "../ui/skeleton";
import { FormEvent, useState } from "react";
import { Button } from "../ui/button";
import { Save, XIcon } from "lucide-react";
import { getQueryClient } from "@/lib/get-query-client";

export function EntryView({ entryId }: { entryId: string }) {
  const queryClient = getQueryClient();
  const [newTitle, setNewTitle] = useState<string>();

  const { data, isPending, error } = useQuery({
    queryKey: ["entry", entryId],
    queryFn: async () => await getEntryById(entryId),
  });

  const titleMutation = useMutation({
    mutationFn: async (title: string) => {
      await updateEntryTitle(entryId, title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
  });

  return (
    <div className="">
      {isPending ? (
        <Skeleton className="w-full h-12 m-4" />
      ) : (
        data && (
          <div>
            <form
              className="p-4 flex gap-2"
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                titleMutation.mutate(newTitle ?? "New Entry");
                setNewTitle("");
              }}
            >
              <Input
                className="w-[300px]"
                defaultValue={data.title}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              {newTitle && newTitle.length > 0 && (
                <div className="flex gap-2">
                  <Button size={"icon"} type="submit">
                    <Save />
                  </Button>
                  <Button
                    size={"icon"}
                    type="button"
                    variant={"secondary"}
                    onClick={() => setNewTitle("")}
                  >
                    <XIcon />
                  </Button>
                </div>
              )}
            </form>
            <TiptapEditor defaultValue={data.content} />
          </div>
        )
      )}
    </div>
  );
}
