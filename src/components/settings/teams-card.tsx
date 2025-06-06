import { useRouteContext } from "@tanstack/react-router";
import { createTeam } from "~/routes/app/settings/route";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export function TeamsCard() {
  const { teams, user } = useRouteContext({ from: "/app/settings" });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Create a new team</CardTitle>
          <CardDescription>You will be the owner of the new team.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const response = await createTeam({ data: formData });
              console.log(response);
            }}
            className="space-y-2"
          >
            <input type="hidden" name="user_id" value={user?.id} />
            <Label htmlFor="name">Name</Label>
            <Input name="name" id="name" />
            <Label htmlFor="slug">Slug</Label>
            <Input name="slug" id="slug" />
            <Button type="submit">Submit</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Your teams</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell className="font-medium">{team.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
