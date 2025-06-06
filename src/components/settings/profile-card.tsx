import { useState } from "react";
import authClient from "~/lib/auth-client";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function ProfileCard() {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  const { data } = authClient.useSession();

  const [isEdit, setIsEdit] = useState(false);

  const handleSave = async () => {
    if (data?.user.name != name && name) {
      await authClient.updateUser({ name });
    }

    if (data?.user.image != image && image) {
      await authClient.updateUser({ image });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Profile settings{" "}
          <Button
            size={"sm"}
            variant={isEdit ? "default" : "outline"}
            onClick={() => {
              if (isEdit) {
                handleSave();
              }

              setIsEdit((edit) => !edit);
            }}
          >
            {isEdit ? "Save" : "Edit"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input
            defaultValue={data?.user.name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isEdit}
            id="name"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input defaultValue={data?.user.email} disabled id="email" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">
            Image <span className="text-foreground/70 text-xs">(url)</span>
          </Label>
          <Input
            defaultValue={data?.user.image || ""}
            onChange={(e) => setImage(e.target.value)}
            disabled={!isEdit}
            id="email"
          />
        </div>
      </CardContent>
    </Card>
  );
}
