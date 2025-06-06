import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { User } from "better-auth";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { db } from "~/lib/server/db";
import { user } from "~/lib/server/schema";

const getUsers = createServerFn({ method: "GET" }).handler(async () => {
  const users = await db.select().from(user);
  return users as User[];
});

export const Route = createFileRoute("/app/settings/members")({
  component: RouteComponent,
  loader: async () => {
    const users = await getUsers();
    return { users };
  },
});

function RouteComponent() {
  const { users } = Route.useLoaderData();

  return (
    <div>
      Hello "/app/settings/members"!{" "}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              {user.image && (
                <TableCell>
                  <Avatar>
                    <AvatarImage src={user.image} />
                    <AvatarFallback>{user.name.slice(0, 3)}</AvatarFallback>
                  </Avatar>
                </TableCell>
              )}
              <TableCell className="font-medium">{user.name ?? "Unknown"}</TableCell>
              <TableCell>{user.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
