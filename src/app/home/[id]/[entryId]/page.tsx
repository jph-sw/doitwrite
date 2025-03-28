export default async function Page({
  params,
}: {
  params: Promise<{ id: string; entryId: string }>;
}) {
  const { id, entryId } = await params;

  return (
    <div>
      {id}, {entryId}
    </div>
  );
}
