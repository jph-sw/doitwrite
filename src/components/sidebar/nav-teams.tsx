import { useRouteContext } from "@tanstack/react-router";
import { User } from "better-auth";
import { ChevronRight, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { createCollection } from "~/lib/collections";
import { team } from "~/lib/server/schema";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { NavCollections } from "./nav-collections";

const LOCAL_STORAGE_KEY = "navTeamsOpenState";

export function NavTeams({
  teams,
  user,
}: {
  teams: (typeof team.$inferSelect)[];
  user: User;
}) {
  const { queryClient } = useRouteContext({ from: "__root__" });

  const [openState, setOpenState] = useState<{ [key: string]: boolean }>(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedState ? JSON.parse(savedState) : {};
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(openState));
    }
  }, [openState]);

  const handleOpenChange = (teamId: string, isOpen: boolean) => {
    setOpenState((prevState) => ({
      ...prevState,
      [teamId]: isOpen,
    }));
  };

  return (
    <SidebarMenu>
      {teams.map((team) => {
        const isOpen = openState[team.id] !== undefined ? openState[team.id] : true; // Default to open

        return (
          <Collapsible
            id={team.id}
            key={team.id}
            className="group/collapsible"
            open={isOpen}
            onOpenChange={(isOpen) => handleOpenChange(team.id, isOpen)}
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={team.name} className="justify-between">
                  <div className="flex items-center gap-1">
                    <span>{team.name}</span>
                  </div>
                  <div
                    className="flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className="hover:bg-secondary/50 cursor-pointer opacity-0 transition-opacity group-hover/collapsible:opacity-100"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <form
                          onSubmit={async (event) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);

                            const response = await createCollection({ data: formData });

                            queryClient.invalidateQueries({ queryKey: ["collections"] });

                            console.log(response);
                          }}
                        >
                          <Input name="name" placeholder="Name" />
                          <Input name="color" type="color" />
                          <input type="hidden" name="team_id" value={team.id} />
                          <input type="hidden" name="created_by" value={user.id} />
                          <input type="hidden" name="updated_by" value={user.id} />
                          <Button type="submit">Create</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </div>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <NavCollections teamId={team.id} />
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        );
      })}
    </SidebarMenu>
  );
}
