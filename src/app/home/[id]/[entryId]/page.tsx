import { EntryView } from "@/components/editor/entry-view";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; entryId: string }>;
}) {
  const { entryId } = await params;

  return (
    <div className="">
      <EntryView entryId={entryId} />
    </div>
  );
}
