"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function Page() {
  return (
    <div className="container mx-auto px-4">
      <Button
        onClick={() =>
          authClient.signIn.social({
            provider: "discord",
          })
        }
      >
        Sign In with Discord
      </Button>
    </div>
  );
}
