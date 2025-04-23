import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";

import { Favorites } from "./favorites";
import { Home } from "./home";
import { Collections } from "./collections";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { UserMenu } from "./user-menu";
import { OrgSwitcher } from "./org-switcher";

export async function AppSidebar() {
  const [session, organization] = await Promise.all([
    auth.api.getSession({
      headers: await headers(),
    }),
    auth.api.getFullOrganization({
      headers: await headers(),
    }),
  ]);

  if (!session) {
    return "No user";
  }

  return (
    <Sidebar>
      <SidebarContent>
        <OrgSwitcher activeOrg={organization} />
        <Home />
        <Favorites userId={session.user.id} />
        <Collections session={session.session} />
      </SidebarContent>
      <SidebarFooter>
        <UserMenu user={session.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
