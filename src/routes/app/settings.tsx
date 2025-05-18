import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { db } from "~/lib/server/db";
import { member, team } from "~/lib/server/schema";

export const Route = createFileRoute("/app/settings")({
  component: RouteComponent,
  loader: async ({ context }) => {
    return { user: context.user, session: context.session, teams: context.teams };
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

    await db
      .insert(member)
      .values({ id: randomUUID(), userId: userId, teamId: teamMutation[0].insertedId });

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

function RouteComponent() {
  const { user, teams } = Route.useLoaderData();
  return (
    <div className="p-4">
      <div>
        <pre className="bg-secondary rounded-md p-4">
          {JSON.stringify(teams, null, 1)}
        </pre>
      </div>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const response = await createTeam({ data: formData });
          console.log(response);
        }}
      >
        <input type="hidden" name="user_id" value={user?.id} />
        <Input name="name" />
        <Input name="slug" />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
