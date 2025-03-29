"use client";

import * as React from "react";
import { Search } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { collectionOptions, entryOptions } from "@/lib/query-options";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

export function CommandDialogDemo() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { data: entries } = useQuery(entryOptions);
  const { data: collections } = useQuery(collectionOptions);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton onClick={() => setOpen(true)}>
          <Search />
          Search
        </SidebarMenuButton>

        <SidebarMenuBadge>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>J
          </kbd>
        </SidebarMenuBadge>
      </SidebarMenuItem>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Entries">
            {entries?.map((entry) => (
              <CommandItem
                key={entry.id}
                onSelect={() =>
                  router.push(`/home/${entry.collection_id}/${entry.id}`)
                }
              >
                <span>{entry.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Collections">
            {collections?.map((collection) => (
              <CommandItem
                key={collection.id}
                onSelect={() => router.push(`/home/${collection.id}`)}
              >
                <span>{collection.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
