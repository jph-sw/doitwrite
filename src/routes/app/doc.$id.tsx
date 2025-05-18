import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import debounce from "lodash.debounce";
import { PenIcon, SaveIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TipTapEditor } from "~/components/editor/editor";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { entryQueryOptions, updateEntry } from "~/lib/entries";
import { entry } from "~/lib/server/schema";
import { cn } from "~/lib/utils";

export const Route = createFileRoute("/app/doc/$id")({
  component: RouteComponent,
  loader: async ({ params: { id }, context }) => {
    const collection = await context.queryClient.ensureQueryData(entryQueryOptions(id));
    const entries = await context.queryClient.ensureQueryData(entryQueryOptions(id));

    return { collection, entries };
  },
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { queryClient } = Route.useRouteContext();
  const { data: entryData, isPending } = useSuspenseQuery(entryQueryOptions(id));

  const [title, setTitle] = useState(entryData?.name || "");
  const [content, setContent] = useState(entryData?.content || "");
  const [isEdit, setIsEdit] = useState(false);

  const hasUnsavedChanges = useRef(false);

  const updateMutation = useMutation({
    mutationFn: async (data: { newEntry: typeof entry.$inferInsert }) => {
      if (!data) {
        throw new Error("data is required");
      }
      const res = await updateEntry({ data: { newEntry: data.newEntry } });
      return res;
    },
    onSuccess: () => {
      hasUnsavedChanges.current = false;
      queryClient.invalidateQueries({ queryKey: ["entries", "entry", id] });
    },
    onError: (error) => {
      console.error("Save failed:", error);
    },
  });

  useEffect(() => {
    if (entryData) {
      setTitle(entryData.name || "");
      setContent(entryData.content || "");
    }
  }, [entryData]);

  const autosave = debounce(() => {
    if (hasUnsavedChanges.current) {
      console.log("Autosaving...");
      updateMutation.mutate({
        newEntry: {
          id: entryData.id,
          name: title,
          content: content,
          team_id: entryData.team_id,
          collection_id: entryData.collection_id,
          created_by: entryData.created_by,
          updated_by: entryData.updated_by,
        },
      });
    }
  }, 3000);

  useEffect(() => {
    if (isEdit && entryData) {
      autosave();
      return () => {
        autosave.cancel();
      };
    }
  }, [isEdit, title, content, entryData, autosave]);

  const handleSave = () => {
    console.log(`
      new name: ${title};
      new content: ${content};
      `);
    updateMutation.mutate({
      newEntry: {
        id: entryData.id,
        name: title,
        content: content,
        team_id: entryData.team_id,
        collection_id: entryData.collection_id,
        created_by: entryData.created_by,
        updated_by: entryData.updated_by,
      },
    });
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges.current && !updateMutation.isPending) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      autosave.cancel();
    };
  }, [updateMutation.isPending, autosave]);

  useEffect(() => {
    if (isEdit && entryData) {
      if (title !== entryData.name || content !== entryData.content) {
        hasUnsavedChanges.current = true;
      } else {
        hasUnsavedChanges.current = false;
      }
    }
  }, [title, content, isEdit, entryData]);

  return (
    <div className="h-dvh w-full">
      <div className="flex h-12 justify-between px-10 py-2">
        <h2></h2>
        <div className="flex items-center gap-2 py-2">
          {entryData && (
            <Dialog>
              <DialogTrigger asChild>
                <Button size={"sm"} variant={"outline"}>
                  Share
                </Button>
              </DialogTrigger>
              <DialogContent className="">
                <Input className="my-4" defaultValue={`/p/${entryData.id}`} readOnly />
              </DialogContent>
            </Dialog>
          )}
          <Button
            size={"sm"}
            onClick={() => {
              if (isEdit) {
                handleSave();
              }
              setIsEdit(!isEdit);
            }}
            disabled={updateMutation.isPending}
            variant={isEdit ? "default" : "outline"}
          >
            {isEdit ? (
              <>
                <SaveIcon className="mr-2 h-4 w-4" /> Save
              </>
            ) : (
              <>
                <PenIcon className="mr-2 h-4 w-4" />
                Edit
              </>
            )}
          </Button>
        </div>
      </div>
      <div className="container mx-auto p-4">
        {isPending && "Loading..."}
        {entryData && (
          <div className="flex flex-col overflow-visible overflow-y-scroll">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={cn("mb-1 w-fit rounded-md text-2xl focus:outline-none", {
                "border-input bg-background border px-2 py-1": isEdit,
              })}
              disabled={!isEdit}
            />
            <span className="text-foreground/70 mb-4 text-sm">
              {entryData.updated_at?.toLocaleString()}
            </span>
            <TipTapEditor
              disabled={!isEdit}
              defaultValue={entryData.content || ""}
              onChange={(v) => {
                setContent(v);
                hasUnsavedChanges.current = true;
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
