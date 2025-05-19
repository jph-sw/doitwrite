import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, MoveDown } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { fetchAllCollections } from "~/lib/collections";
import { entryQueryOptions, updateEntry } from "~/lib/entries";
import { collection } from "~/lib/server/schema";

export const Route = createFileRoute("/app/move/$id")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/login" });
    }
  },
  loader: async ({ params: { id }, context }) => {
    const entry = await context.queryClient.ensureQueryData(entryQueryOptions(id));

    return {
      user: context.user,
      session: context.session,
      teams: context.teams,
      queryClient: context.queryClient,
      entry,
    };
  },
});

function RouteComponent() {
  const { queryClient } = Route.useLoaderData();

  const [selectedCollection, setSelectedCollection] =
    useState<typeof collection.$inferSelect>();

  const { teams, entry } = Route.useLoaderData();

  const navigate = useNavigate();

  const collections = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const teamIds = teams.map((team) => team.id);
      const res = await fetchAllCollections({ data: teamIds });
      return res || [];
    },
  });

  const currentCollection =
    collections.data?.find((collection) => collection.id === entry.collection_id)?.name ||
    "Unknown collection";

  const moveEntry = async () => {
    if (!selectedCollection) {
      throw new Error("No collection selected");
    }

    await updateEntry({
      data: {
        newEntry: {
          id: entry.id,
          name: entry.name,
          content: entry.content,
          team_id: teams.find((team) => team.id === selectedCollection.team_id)?.id || "",
          collection_id: selectedCollection.id,
          created_by: entry.created_by,
          updated_by: entry.updated_by,
        },
      },
    });
  };

  const moveMutation = useMutation({
    mutationFn: moveEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entry", "entries", "collections"] });
      navigate({ to: "/app/doc/$id", params: { id: entry.id } });
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-md">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 flex items-center gap-1"
          asChild
        >
          <Link to={"/app/doc/$id"} params={{ id: entry.id }}>
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Move Entry</CardTitle>
            <CardDescription>
              Move "{entry.name}" to a different collection
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-muted-foreground text-sm font-medium">
                Current Collection
              </h3>
              <div className="rounded-md border px-4 py-3 font-medium">
                {currentCollection}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <MoveDown className="text-muted-foreground h-5 w-5" />
            </div>

            <div className="space-y-2">
              <h3 className="text-muted-foreground text-sm font-medium">
                Destination Collection
              </h3>
              <Select
                onValueChange={(e) =>
                  setSelectedCollection(
                    collections.data?.find((collection) => collection.id === e),
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a collection" />
                </SelectTrigger>
                <SelectContent>
                  {collections.data?.map((collection) => (
                    <SelectItem key={collection.id} value={collection.id}>
                      {collection.name}{" "}
                      <span className="text-muted-foreground text-xs">
                        {teams.find((team) => team.id === collection.team_id)?.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end border-t pt-4">
            <Button
              onClick={() => moveMutation.mutate()}
              disabled={moveMutation.isPending || !selectedCollection}
            >
              Move Entry
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default RouteComponent;
