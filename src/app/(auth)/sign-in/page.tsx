"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <div className="container mx-auto px-4">
      <Button
        onClick={() =>
          authClient.signIn.social({
            provider: "discord",
            fetchOptions: {
              onSuccess() {
                router.push("/home");
              },
            },
          })
        }
      >
        Sign In with Discord
      </Button>
    </div>
  );
}
