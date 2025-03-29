import { EntryView } from "@/components/editor/entry-view";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; entryId: string }>;
}) {
  const { id, entryId } = await params;

  return (
    <div>
      <EntryView entryId={entryId} />
    </div>
  );
}
