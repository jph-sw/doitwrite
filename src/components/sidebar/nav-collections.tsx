import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { LibraryIcon } from "lucide-react";
import { collectionsQueryOptions } from "~/lib/collections";
import { SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";

export function NavCollections({ teamId }: { teamId: string }) {
  const collections = useQuery(collectionsQueryOptions(teamId));
  return (
    <SidebarMenuSub>
      {collections.isPending && (
        <>
          <SidebarMenuSubItem>
            <Skeleton className="h-6 w-full" />
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <Skeleton className="h-6 w-full" />
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <Skeleton className="h-6 w-full" />
          </SidebarMenuSubItem>
        </>
      )}
      {collections.data?.map((collection) => (
        <SidebarMenuSubItem key={collection.id}>
          {" "}
          <SidebarMenuSubButton asChild>
            <Link to="/app/collection/$id" params={{ id: collection.id }}>
              <LibraryIcon style={{ color: collection.color }} />
              <span>{collection.name}</span>
            </Link>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      ))}
      {collections.data?.length == 0 && (
        <span className="text-foreground/60 text-xs">No collections for this team</span>
      )}
    </SidebarMenuSub>
  );
}
