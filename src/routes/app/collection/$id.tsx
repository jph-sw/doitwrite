import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { collectionQueryOptions } from "~/lib/collections";
import { entryQueryOptions } from "~/lib/entries";

export const Route = createFileRoute("/app/collection/$id")({
  component: RouteComponent,
  loader: async ({ params: { id }, context }) => {
    const collection = await context.queryClient.ensureQueryData(
      collectionQueryOptions(id),
    );
    const entries = await context.queryClient.ensureQueryData(entryQueryOptions(id));

    return { collection, entries };
  },
});

function RouteComponent() {
  const { id } = Route.useParams();
  const collectionQuery = useSuspenseQuery(collectionQueryOptions(id));
  const entriesQuery = useSuspenseQuery(entryQueryOptions(id));

  return (
    <div className="max-w-4xl py-4 xl:w-1/2">
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
          <div>
            <pre className="bg-secondary rounded-lg p-4">
              {JSON.stringify(collectionQuery.data, null, 1)}
            </pre>
          </div>
        </>
      )}
    </div>
  );
}
