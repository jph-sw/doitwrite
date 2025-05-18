import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
  loader: ({ context }) => {
    if (context.user) {
      throw redirect({ to: "/app" });
    } else {
      throw redirect({ to: "/login" });
    }
  },
});

function Home() {
  return "";
}
