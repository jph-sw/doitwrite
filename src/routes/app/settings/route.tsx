import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { Settings, User, Users } from "lucide-react";
import { db } from "~/lib/server/db";
import { member, team } from "~/lib/server/schema";

export const Route = createFileRoute("/app/settings")({
  component: RouteComponent,
  loader: async ({ context }) => {
    return {
      user: context.user,
      session: context.session,
      teams: context.teams,
    };
  },
});

export const createTeam = createServerFn({ method: "POST" })
  .validator((data) => {
    if (!(data instanceof FormData)) {
      throw new Error("Invalid form data");
    }
    const name = data.get("name");
    const userId = data.get("user_id");
    const slug = data.get("slug");

    if (!name || !userId || !slug) {
      throw new Error("Name is required");
    }

    return {
      name: name.toString(),
      userId: userId.toString(),
      slug: slug.toString(),
    };
  })
  .handler(async ({ data: { name, userId, slug } }) => {
    const teamMutation = await db
      .insert(team)
      .values({ id: randomUUID(), name, slug })
      .returning({ insertedId: team.id });

    await db.insert(member).values({
      id: randomUUID(),
      userId: userId,
      teamId: teamMutation[0].insertedId,
    });

    return;
  });

export const getTeams = createServerFn({ method: "GET" })
  .validator((userId: string) => {
    return userId;
  })
  .handler(async (ctx) => {
    const teams: (typeof team.$inferSelect)[] = [];
    const memberQuery = await db.select().from(member).where(eq(member.userId, ctx.data));

    await Promise.all(
      memberQuery.map(async (member) => {
        const teamQuery = await db
          .select()
          .from(team)
          .where(eq(team.id, member.teamId || ""));

        teams.push(teamQuery[0]);
      }),
    );

    teams.sort((a, b) => {
      if (!a.created_at || !b.created_at) return 0;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return teams;
  });

const navigationItems = [
  {
    url: "/app/settings/profile",
    title: "Profile",
    description: "Manage your personal information",
    icon: User,
  },
  {
    url: "/app/settings/members",
    title: "Members",
    description: "Manage team members and permissions",
    icon: Users,
  },
  {
    url: "/app/settings/teams",
    title: "Teams",
    description: "Create and manage your teams",
    icon: Settings,
  },
];

function RouteComponent() {
  const { teams } = Route.useLoaderData();

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-foreground/70 mt-2 text-sm">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Navigation */}
          <div className="lg:w-80">
            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    to={item.url}
                    key={item.title}
                    className="group bg-muted hover:border-border/80 flex items-start gap-3 rounded-lg border p-4 shadow-sm transition-all hover:shadow-md"
                    activeProps={{
                      className: "border bg-blue-50 shadow-md ring-1",
                    }}
                  >
                    <div className="flex-shrink-0">
                      <Icon className="group-hover:text-foreground/70 h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-foreground/70 text-xs">{item.description}</p>
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Quick Stats Card */}
            <div className="bg-muted mt-6 rounded-lg border p-4 shadow-sm">
              <h3 className="text-sm font-medium">Quick Overview</h3>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">Teams</span>
                  <span className="font-medium">{teams?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
