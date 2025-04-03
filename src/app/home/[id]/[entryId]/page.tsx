import { EntryView } from "@/components/editor/entry-view";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; entryId: string }>;
}) {
  const { entryId } = await params;

  return (
    <div className="container mx-auto px-4 md:px-24">
      <EntryView entryId={entryId} />
    </div>
  );
}
