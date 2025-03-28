"use client";

import {
  ChevronRight,
  MoreHorizontal,
  Notebook,
  Star,
  XIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { collectionOptions, entryOptions } from "@/lib/query-options";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Collection } from "@/lib/types";
import { Plus } from "lucide-react";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { getQueryClient } from "@/lib/get-query-client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function AppSidebar() {
  const queryClient = getQueryClient();
  const pathname = usePathname();

  const { data: collections } = useQuery(collectionOptions);
  const { data: entries } = useQuery(entryOptions);

  const mutation = useMutation({
    mutationFn: async (data: { title: string; color: string }) => {
      fetch("/api/collection", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionOptions.queryKey });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const entryMutation = useMutation({
    mutationFn: async (data: { collection_id: number }) => {
      await fetch("/api/entry", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: entryOptions.queryKey });
    },
  });

  const deleteEntryMutation = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`/api/entry?id=${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: entryOptions.queryKey });
    },
  });

  const isCollectionPath = (collectionId: number): boolean => {
    const pattern = new RegExp(`^/home/${collectionId}(/.*)?$`);
    return pattern.test(pathname);
  };

  const isActive = (entryId: number): boolean => {
    const pattern = new RegExp(`/home/[^/]+/${entryId}$`);
    return pattern.test(window.location.pathname);
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Collections</SidebarGroupLabel>
          <SidebarMenu>
            {collections &&
              collections.map((collection: Collection, i: number) => (
                <Collapsible
                  key={i}
                  asChild
                  defaultOpen={isCollectionPath(collection.id)}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip={collection.title} asChild>
                      <CollapsibleTrigger asChild>
                        <Link href={"/home/" + collection.id.toString()}>
                          <Notebook style={{ color: collection.color }} />
                          {collection.title}
                        </Link>
                      </CollapsibleTrigger>
                    </SidebarMenuButton>
                    <SidebarMenuAction
                      showOnHover
                      className="me-5"
                      onClick={() =>
                        entryMutation.mutate({ collection_id: collection.id })
                      }
                    >
                      <Plus />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    {entries && entries?.length > 0 && (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {entries &&
                            entries
                              .filter(
                                (entry) =>
                                  entry.collection_id === collection.id,
                              )
                              .map((entry) => (
                                <SidebarMenuSubItem
                                  key={Math.random() + entry.id}
                                >
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={!isActive(entry.id)}
                                  >
                                    <Link
                                      href={`/home/${collection.id}/${entry.id}`}
                                    >
                                      {entry.title}
                                    </Link>
                                  </SidebarMenuSubButton>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <SidebarMenuAction>
                                        <MoreHorizontal />
                                      </SidebarMenuAction>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                      <DropdownMenuGroup>
                                        <DropdownMenuItem>
                                          Favorite <Star className="ml-auto" />
                                        </DropdownMenuItem>
                                      </DropdownMenuGroup>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuGroup>
                                        <DropdownMenuItem
                                          onClick={async () =>
                                            deleteEntryMutation.mutate(entry.id)
                                          }
                                        >
                                          Delete <XIcon className="ml-auto" />
                                        </DropdownMenuItem>
                                      </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </SidebarMenuSubItem>
                              ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            <Dialog>
              <DialogTrigger asChild>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Plus /> New Collection...
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>New Collection</DialogTitle>
                <form
                  className="space-y-2"
                  onSubmit={(e: React.FormEvent) => {
                    e.preventDefault();

                    const form = e.target as HTMLFormElement;
                    const formData = new FormData(form);
                    const title = formData.get("title") as string;
                    const color = formData.get("color") as string;

                    mutation.mutate({ title, color });
                  }}
                >
                  <div>
                    <Label>Title</Label>
                    <Input name="title" />
                  </div>
                  <div>
                    <Label>Color</Label>
                    <Input name="color" type="color" />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="submit">New</Button>
                    </DialogClose>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
