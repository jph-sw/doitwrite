"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { entryOptions } from "@/lib/query-options";
import { Favorite } from "@/lib/types";
import { Star, XIcon } from "lucide-react";
import { getQueryClient } from "@/lib/get-query-client";
import Link from "next/link";

export function Favorites({ userId }: { userId: string }) {
  const queryClient = getQueryClient();
  const { data: entries } = useQuery(entryOptions);

  const { data: favorites } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await fetch(`/api/favorite?id=${userId}`, {
        method: "GET",
      });
      const rows = (await res.json()) as Favorite[];
      return rows;
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`/api/favorite?id=${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });

  return (
    favorites &&
    favorites.length > 0 && (
      <SidebarGroup>
        <SidebarGroupLabel>Favorites</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {entries
              ?.filter((entry) =>
                favorites.some((favorite) => favorite.entry_id === entry.id),
              )
              .map((entry) => (
                <SidebarMenuItem key={entry.id}>
                  <SidebarMenuButton asChild>
                    <Link href={`/home/${entry.collection_id}/${entry.id}`}>
                      <Star className="text-yellow-300" />
                      {entry.title}
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuAction
                    onClick={() => removeMutation.mutate(entry.id)}
                  >
                    <XIcon />
                  </SidebarMenuAction>
                </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    )
  );
}
