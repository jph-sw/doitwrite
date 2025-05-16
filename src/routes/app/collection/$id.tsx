import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { collectionQueryOptions } from "~/lib/collections";

export const Route = createFileRoute("/app/collection/$id")({
  component: RouteComponent,
  loader: async ({ params: { id }, context }) => {
    const data = await context.queryClient.ensureQueryData(collectionQueryOptions(id));

    return data;
  },
});

function RouteComponent() {
  const { id } = Route.useParams();
  const collectionQuery = useSuspenseQuery(collectionQueryOptions(id));

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
