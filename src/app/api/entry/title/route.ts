import { updateEntryTitle } from "@/app/actions/entry";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { title, entryId } = await request.json();

  const res = await updateEntryTitle(entryId, title);

  return NextResponse.json(res);
}
