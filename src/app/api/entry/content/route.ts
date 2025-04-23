import { query } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { content, entryId, updated_by } = await req.json();

  const res = await query(
    "UPDATE entry SET content = $1, updated_by = $3 WHERE id = $2",
    [content, entryId, updated_by],
  );

  return NextResponse.json(res);
}
