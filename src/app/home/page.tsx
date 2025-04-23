"use client";

import { Entry } from "@/lib/types"; // Assuming this path is correct
import { useQuery } from "@tanstack/react-query";
import Link from "next/link"; // Import Link
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

// Helper function to format dates
const formatDate = (dateString: string) => {
  try {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  } catch (e) {
    console.error("Failed to format date:", dateString, e);
    return "Invalid Date";
  }
};

export default function Page() {
  const {
    data: history,
    isLoading,
    isError,
    error,
  } = useQuery<Entry[]>({
    queryKey: ["history"],
    queryFn: async () => {
      const response = await fetch("/api/history");
      if (!response.ok) {
        // Attempt to read error message from response body
        const errorBody = await response
          .json()
          .catch(() => ({ message: response.statusText }));
        throw new Error(
          `Failed to fetch history: ${errorBody.message || response.statusText}`,
        );
      }
      return response.json();
    },
  });

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-12 w-5/6" />
              <Skeleton className="h-12 w-2/3" />
              <Skeleton className="h-12 w-1/2" />
            </div>
          )}

          {isError && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load history: {error?.message || "Unknown error"}
              </AlertDescription>
            </Alert>
          )}

          {!isLoading && !isError && history && history.length > 0 && (
            <ul className="space-y-4">
              {history.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/home/${item.collection_id}/${item.id}`} // Dynamic link
                    className="block rounded-md bg-secondary/30 p-4 text-secondary-foreground shadow-sm hover:bg-secondary/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" // Styling on Link, added focus styles
                  >
                    <div className="font-semibold text-lg">{item.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Created: {formatDate(item.created_at)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Updated: {formatDate(item.updated_at)}
                      {item.updated_by && ` | By: ${item.updated_by}`}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {!isLoading && !isError && history && history.length === 0 && (
            <p className="text-muted-foreground text-center py-4">
              No history available.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
