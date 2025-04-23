"use client";

import * as React from "react";
import { ChevronDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { ActiveOrganization } from "@/lib/types";
import Link from "next/link";

export function OrgSwitcher({
  activeOrg,
}: {
  activeOrg: ActiveOrganization | null;
}) {
  const { data: orgs } = authClient.useListOrganizations();

  const [optimisticOrg, setOptimisticOrg] =
    React.useState<ActiveOrganization | null>(activeOrg);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-fit px-1.5">
              <div className="flex aspect-square size-5 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                {optimisticOrg?.name.slice(0, 1)}
              </div>
              <span className="truncate font-semibold">
                {optimisticOrg?.name || "Personal"}
              </span>
              <ChevronDown className="opacity-50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 rounded-lg"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Organizations
            </DropdownMenuLabel>
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={async () => {
                await authClient.organization.setActive({
                  organizationId: null,
                });
                setOptimisticOrg(null);
              }}
            >
              <div className="flex size-6 items-center justify-center rounded-sm border">
                P
              </div>
              Personal
            </DropdownMenuItem>
            {orgs?.map((org, index) => (
              <DropdownMenuItem
                key={org.name}
                className="gap-2 p-2"
                onClick={async () => {
                  if (org.id === optimisticOrg?.id) {
                    return;
                  }

                  setOptimisticOrg({
                    members: [],
                    invitations: [],
                    ...org,
                  });

                  const { data } = await authClient.organization.setActive({
                    organizationId: org.id,
                  });
                  setOptimisticOrg(data);
                }}
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  {org.name.slice(0, 1)}
                </div>
                {org.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" asChild>
              <Link href="/organizations/new">
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">Add organization</div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
