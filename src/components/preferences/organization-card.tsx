"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";


export function OrganizationCard() {
  const { data: activeOrg } = authClient.useActiveOrganization();

  console.log(activeOrg);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Organizations</CardTitle>
          <CardDescription>Here you can manage orgs</CardDescription>
        </CardHeader>
        <CardContent>
          {activeOrg && (
            <div className="flex flex-col gap-4">
              <h2>
                Your active Organization:{" "}
                <span className="font-semibold">{activeOrg?.name}</span>
              </h2>
              <Table>
                <TableCaption>Members</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>

                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeOrg?.members.map((member: { id: string; createdAt: Date; role: string; organizationId: string; user: { email: string; id: string; name: string; image: string | undefined } }) => (
                    <TableRow key={member.id}>
                      <TableCell><Avatar><AvatarImage src={member.user.image} /><AvatarFallback>{member.user.name.charAt(0)}</AvatarFallback></Avatar></TableCell>
                      <TableCell>{member.user.name}</TableCell>
                      <TableCell>{member.user.email}</TableCell>
                      <TableCell><RoleBadge role={member.role} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

function RoleBadge({ role }: { role: string }) {
  return (
    <Badge variant="outline">
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </Badge>
  )
}