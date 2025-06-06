import { createFileRoute } from "@tanstack/react-router";
import { TeamsCard } from "~/components/settings/teams-card";

export const Route = createFileRoute("/app/settings/teams")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <TeamsCard />
    </div>
  );
}
