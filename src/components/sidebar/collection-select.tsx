import { useQuery } from "@tanstack/react-query";
import { LibraryIcon } from "lucide-react";
import { collectionsQueryOptions } from "~/lib/collections";
import { collection } from "~/lib/server/schema";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";

export function CollectionSelect({
  teamId,
  selectedCollection,
  setSelectedCollection,
}: {
  teamId: string;
  selectedCollection: typeof collection.$inferSelect | undefined;
  setSelectedCollection: React.Dispatch<
    React.SetStateAction<typeof collection.$inferSelect | undefined>
  >;
}) {
  const collectionsQuery = useQuery(collectionsQueryOptions(teamId));

  return (
    <Select
      onValueChange={(e) =>
        setSelectedCollection(
          collectionsQuery.data?.find((collection) => collection.id === e),
        )
      }
    >
      <SelectTrigger className="bg-secondary w-fit border">
        <LibraryIcon />
        {selectedCollection?.name}
      </SelectTrigger>
      <SelectContent>
        {collectionsQuery.data?.map((collection) => (
          <SelectItem key={collection.id} value={collection.id}>
            <LibraryIcon /> {collection.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
