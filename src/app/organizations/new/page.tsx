"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;

    const { data, error } = await authClient.organization.create({
      name: title,
      slug: slug,
    });

    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      router.push(`/`);
    }
  };

  return (
    <div className="container mx-auto p-4 w-full flex justify-center pt-48">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle>New Org</CardTitle>
          <CardDescription>
            Here you can create a new organization. If you want to join an
            organization you have to get an invitation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-2" onSubmit={onSubmit}>
            <div className="space-y-1">
              <Label htmlFor="title">Title</Label>
              <Input placeholder="Title" id="title" name="title" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="slug">Slug</Label>
              <Input placeholder="Slug" id="slug" name="slug" />
            </div>
            <Button>New</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
