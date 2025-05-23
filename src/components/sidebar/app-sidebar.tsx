import {
  BookUserIcon,
  ChevronRight,
  Home,
  SearchIcon,
  SquarePenIcon,
} from "lucide-react";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useRouteContext } from "@tanstack/react-router";
import { User } from "better-auth";
import { useEffect, useState } from "react";
import { fetchAllCollections } from "~/lib/collections";
import { createEntry, entriesByTeamsQueryOptions } from "~/lib/entries";
import { collection, team } from "~/lib/server/schema";
import { Button } from "../ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { CollectionSelect } from "./collection-select";
import { NavTeams } from "./nav-teams";
import { NavUser } from "./nav-user";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/app",
    icon: Home,
  },
];

export function AppSidebar({
  user,
  teams,
}: {
  user: User;
  teams: (typeof team.$inferSelect)[];
}) {
  const { queryClient } = useRouteContext({ from: "__root__" });

  const [commandOpen, setCommandOpen] = useState<boolean>();
  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<typeof team.$inferSelect>();
  const [selectedCollection, setSelectedCollection] =
    useState<typeof collection.$inferSelect>();

  const navigate = useNavigate();

  const collectionsQuery = useQuery({
    queryKey: ["collections"],
    queryFn: async () =>
      await fetchAllCollections({ data: teams.map((team) => team.id) }),
  });

  const entriesQuery = useQuery(entriesByTeamsQueryOptions(teams));

  const createEntryMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      team_id: string;
      collection_id: string;
      created_by: string;
      updated_by: string;
      content: string;
    }) => {
      const res = await createEntry({
        data,
      });
      return res[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
      queryClient.invalidateQueries({ queryKey: ["entry", data.id] });
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      navigate({
        to: "/app/doc/$id",
        params: {
          id: data.id,
        },
      });

      setCreateOpen(false);
    },
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex items-center justify-between">
            <span className="font-mono">doitwrite</span>
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <button type="button" className="bg-secondary rounded-lg p-1">
                  <SquarePenIcon className="h-4 w-4" />
                </button>
              </DialogTrigger>
              <DialogContent className="top-75 p-4">
                <div className="flex items-center gap-2">
                  <Select
                    onValueChange={(e) =>
                      setSelectedTeam(teams.find((team) => team.id === e))
                    }
                  >
                    <SelectTrigger className="bg-secondary w-fit border">
                      <BookUserIcon />
                      {selectedTeam ? selectedTeam.name : "Select team"}
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          <BookUserIcon /> {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ChevronRight className="h-3 w-3" />
                  <CollectionSelect
                    teamId={selectedTeam?.id || ""}
                    selectedCollection={selectedCollection}
                    setSelectedCollection={setSelectedCollection}
                  />
                  <ChevronRight className="h-3 w-3" />

                  <span className="text-foreground/70 text-sm">New entry</span>
                </div>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                />
                <DialogFooter>
                  <Button
                    onClick={() => {
                      createEntryMutation.mutate({
                        name: title,
                        team_id: selectedTeam?.id || "",
                        collection_id: selectedCollection?.id || "",
                        content: "<h1>Hello World!</h1>",
                        created_by: user.id,
                        updated_by: user.id,
                      });
                    }}
                    disabled={createEntryMutation.isPending}
                    size={"sm"}
                  >
                    Create entry
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setCommandOpen(true)}>
                  <SearchIcon />
                  Search
                </SidebarMenuButton>
                <SidebarMenuBadge>
                  <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </SidebarMenuBadge>
                <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
                  <CommandInput placeholder="Type a command or search..." />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Collections">
                      {collectionsQuery.data?.map((colletion) => (
                        <CommandItem
                          key={colletion.id}
                          value={colletion.name + colletion.id}
                          onSelect={() => {
                            navigate({
                              to: "/app/collection/$id",
                              params: {
                                id: colletion.id,
                              },
                            });
                            setCommandOpen(false);
                          }}
                        >
                          {colletion.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandGroup heading="Entries">
                      {entriesQuery.data?.map((entry) => (
                        <CommandItem
                          key={entry.id}
                          value={entry.name + entry.id}
                          onSelect={() => {
                            navigate({
                              to: "/app/doc/$id",
                              params: {
                                id: entry.id,
                              },
                            });
                            setCommandOpen(false);
                          }}
                        >
                          {entry.name}{" "}
                          <span className="text-foreground/70 text-xs">
                            {entry.updated_at?.toLocaleString()}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </CommandDialog>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Teams</SidebarGroupLabel>
          <SidebarGroupContent>
            <NavTeams teams={teams} user={user} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
