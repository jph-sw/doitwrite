import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, FileText } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { collectionQueryOptions } from "~/lib/collections";
import { entriesQueryOptions } from "~/lib/entries";

export const Route = createFileRoute("/app/collection/$id")({
  component: RouteComponent,
  loader: async ({ params: { id }, context }) => {
    const collection = await context.queryClient.ensureQueryData(
      collectionQueryOptions(id),
    );
    const entries = await context.queryClient.ensureQueryData(entriesQueryOptions(id));

    return { collection, entries };
  },
});

function RouteComponent() {
  const { id } = Route.useParams();
  const collectionQuery = useSuspenseQuery(collectionQueryOptions(id));
  const entriesQuery = useSuspenseQuery(entriesQueryOptions(id));

  return (
    <div className="container mx-auto p-4">
      {collectionQuery.data && (
        <>
          <h1 className="text-xl">{collectionQuery.data.name}</h1>
          <div className="flex gap-2">
            <span className="text-foreground/70 text-sm">
              {collectionQuery.data.created_at?.toLocaleDateString()}
            </span>
            <span className="text-foreground text-sm">
              {collectionQuery.data.created_by}
            </span>
          </div>
        </>
      )}
      <ScrollArea className="mt-8 h-[calc(100vh-220px)] w-full rounded-md">
        <div className="space-y-2 p-1">
          {entriesQuery.data.map((entry) => (
            <Link
              key={entry.id}
              to="/app/doc/$id"
              params={{ id: entry.id }}
              className="block"
            >
              <Card className="group border-border/40 bg-card/30 hover:bg-accent/5 w-full border transition-all hover:shadow-sm">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/5 text-primary flex h-9 w-9 items-center justify-center rounded-md">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-foreground group-hover:text-primary font-medium">
                        {entry.name}
                      </span>
                      {entry.updated_at && (
                        <span className="text-muted-foreground text-xs">
                          Updated {new Date(entry.updated_at).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ChevronRight className="text-muted-foreground group-hover:text-foreground h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
