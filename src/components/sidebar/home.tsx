import { HomeIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import Link from "next/link";
import { CommandDialogDemo } from "../search";

export function Home() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>General</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={"/home"}>
                <HomeIcon />
                Home
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <CommandDialogDemo />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
