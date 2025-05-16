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
    <div>
      Hello "/app/collection/$"!{" "}
      <div>
        <pre className="bg-secondary rounded-lg p-4">
          {JSON.stringify(collectionQuery.data, null, 1)}
        </pre>
      </div>
    </div>
  );
}
