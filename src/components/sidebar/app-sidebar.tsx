"use client";

import {
  ChevronRight,
  LogOutIcon,
  Moon,
  MoreHorizontal,
  MoreVerticalIcon,
  Notebook,
  Settings,
  Star,
  Sun,
  XIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Favorites } from "./favorites";
import { authClient } from "@/lib/auth-client";
import { Home } from "./home";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function AppSidebar() {
  const queryClient = getQueryClient();
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const { data: collections } = useQuery(collectionOptions);
  const { data: entries } = useQuery(entryOptions);

  const { theme, setTheme } = useTheme();

  const { isMobile } = useSidebar();

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

  const favoriteMutation = useMutation({
    mutationFn: async (data: { user_id: string; entry_id: number }) => {
      await fetch("/api/favorite", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  if (!session) {
    return "No user";
  }

  const isCollectionPath = (collectionId: number): boolean => {
    const pattern = new RegExp(`^/home/${collectionId}(/.*)?$`);
    return pattern.test(pathname);
  };

  return (
    <Sidebar>
      <SidebarContent>
        <Home />
        <Favorites userId={session.user.id} />
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
                          {entries
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
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <SidebarMenuAction>
                                      <MoreHorizontal />
                                    </SidebarMenuAction>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuGroup>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          favoriteMutation.mutate({
                                            entry_id: entry.id,
                                            user_id: session.user.id,
                                          })
                                        }
                                      >
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

                    console.log("New Collection:", title);

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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg grayscale">
                    <AvatarImage
                      src={session.user.image!}
                      alt={session.user.name}
                    />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {session.user.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {session.user.email}
                    </span>
                  </div>
                  <MoreVerticalIcon className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={session.user.image!}
                        alt={session.user.name}
                      />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {session.user.name}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {session.user.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Settings />
                    Preferences
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setTheme(theme == "dark" ? "light" : "dark")}
                  >
                    {theme == "light" ? <Sun /> : <Moon />} Toggle Theme
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => authClient.signOut()}>
                  <LogOutIcon />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
