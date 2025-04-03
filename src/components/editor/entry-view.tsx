"use client";

import { getEntryById } from "@/app/actions/entry";
import { useMutation, useQuery } from "@tanstack/react-query";
import TiptapEditor from "./TiptapEditor";
import { Skeleton } from "../ui/skeleton";
import { FormEvent, useState } from "react";
import { Button } from "../ui/button";
import { Save, XIcon } from "lucide-react";
import { getQueryClient } from "@/lib/get-query-client";
import { debounce } from "lodash";

export function EntryView({ entryId }: { entryId: string }) {
  const queryClient = getQueryClient();
  const [newTitle, setNewTitle] = useState<string>();

  const { data, isPending } = useQuery({
    queryKey: ["entry", entryId],
    queryFn: async () => await getEntryById(entryId),
  });

  const titleMutation = useMutation({
    mutationFn: async (title: string) => {
      await fetch(`/api/entry/title`, {
        method: "POST",
        body: JSON.stringify({ title, entryId }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
  });

  const contentMutation = useMutation({
    mutationFn: async (content: string) => {
      await fetch("/api/entry/content", {
        method: "POST",
        body: JSON.stringify({ content, entryId }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entry", entryId] });
    },
  });

  const debouncedUpdate = debounce((value: string) => {
    contentMutation.mutate(value);
  }, 1000);

  return (
    <div className="">
      {isPending ? (
        <Skeleton className="w-full h-12 m-4" />
      ) : (
        data && (
          <div className="py-8">
            <div className="text-xl flex flex-col mb-4">
              <form
                className="flex"
                onSubmit={(e: FormEvent) => {
                  e.preventDefault();
                  console.log("Saving title:", newTitle); // Add this line
                  titleMutation.mutate(newTitle ?? "New Entry");
                  setNewTitle("");
                }}
              >
                <input
                  defaultValue={data.title}
                  className="text-xl focus-visible:outline-none"
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
              <span className="text-sm text-foreground/70">
                {new Date(data.created_at.toString()).toDateString()}
              </span>
            </div>
            <TiptapEditor
              defaultValue={data.content}
              onChange={(value) => debouncedUpdate(value)}
            />
          </div>
        )
      )}
    </div>
  );
}
