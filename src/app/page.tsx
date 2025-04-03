"use client";

import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default function Home() {
  const { data: organizations } = authClient.useListOrganizations();

  console.log(organizations);
  return redirect("/home");
}
