import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppSidebar } from "~/components/sidebar/app-sidebar";
import { SidebarProvider } from "~/components/ui/sidebar";

export const Route = createFileRoute("/app")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/login" });
    }

    // `context.queryClient` is also available in our loaders
    // https://tanstack.com/start/latest/docs/framework/react/examples/start-basic-react-query
    // https://tanstack.com/router/latest/docs/framework/react/guide/external-data-loading
  },
  loader: async ({ context }) => {
    return { user: context.user, session: context.session, teams: context.teams };
  },
});

function RouteComponent() {
  const { user, teams } = Route.useLoaderData();
  return (
    <SidebarProvider>
      <AppSidebar user={user!} teams={teams!} />
      <div className="flex w-full justify-center">
        <Outlet />
      </div>
    </SidebarProvider>
  );
}
