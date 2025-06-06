import { createFileRoute } from "@tanstack/react-router";
import { ProfileCard } from "~/components/settings/profile-card";

export const Route = createFileRoute("/app/settings/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <ProfileCard />
    </div>
  );
}
