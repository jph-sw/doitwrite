import { query } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { content, entryId } = await req.json();

  const res = await query("UPDATE entry SET content = $1 WHERE id = $2", [
    content,
    entryId,
  ]);

  return NextResponse.json(res);
}
