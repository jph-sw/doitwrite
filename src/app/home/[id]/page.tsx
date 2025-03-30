import { DangerSettings } from "@/components/collection/danger-settings";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
      </Card>
      <DangerSettings id={id} />
    </div>
  );
}
