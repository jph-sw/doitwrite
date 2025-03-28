"use client";

import {
  Calendar,
  ChevronRight,
  Home,
  Inbox,
  MoreHorizontal,
  Search,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
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
import { FormEvent, useState } from "react";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
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
import { usePathname, useRouter } from "next/navigation";

export function AppSidebar() {
  const queryClient = getQueryClient();
  const pathname = usePathname();
  const router = useRouter();

  const { data: collections, isPending, error } = useQuery(collectionOptions);
  const {
    data: entries,
    entriesIsPending,
    entriesError,
  } = useQuery(entryOptions);

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

  const isCollectionPath = (collectionId: number): boolean => {
    const pattern = new RegExp(`^/home/${collectionId}(/.*)?$`);
    return pattern.test(pathname);
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Application</SidebarGroupLabel>
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
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {entries &&
                          entries
                            .filter(
                              (entry) => entry.collection_id === collection.id,
                            )
                            .map((entry) => (
                              <SidebarMenuSubItem
                                key={Math.random() + entry.id}
                              >
                                <SidebarMenuSubButton asChild>
                                  <Link
                                    href={`/home/${collection.id}/${entry.id}`}
                                  >
                                    {entry.title}
                                  </Link>
                                </SidebarMenuSubButton>
                                <SidebarMenuAction>
                                  <MoreHorizontal />
                                </SidebarMenuAction>
                              </SidebarMenuSubItem>
                            ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
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
