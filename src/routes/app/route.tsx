import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppSidebar } from "~/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";

export const Route = createFileRoute("/app")({
  component: RouteComponent,
  loader: ({ context }) => {
    return { user: context.user, session: context.session };
  },
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/login" });
    }

    // `context.queryClient` is also available in our loaders
    // https://tanstack.com/start/latest/docs/framework/react/examples/start-basic-react-query
    // https://tanstack.com/router/latest/docs/framework/react/guide/external-data-loading
  },
});

function RouteComponent() {
  const { user, session } = Route.useLoaderData();
  return (
    <SidebarProvider>
      <AppSidebar user={user!} session={session!} />
      <div>
        <SidebarTrigger />
        <Outlet />
      </div>
    </SidebarProvider>
  );
}
