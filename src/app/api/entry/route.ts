import { db } from "@/lib/db";
import { Entry } from "@/lib/types";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
  const res = db.prepare("SELECT * FROM entry");

  return NextResponse.json(res.all() as Entry[]);
}

export async function POST(req: NextRequest) {
  const { collection_id } = await req.json();

  const res = db
    .prepare(
      "INSERT INTO entry (title, content, collection_id) VALUES (?, ?, ?)",
    )
    .run("New Entry", "This is a new entry", collection_id);

  return NextResponse.json(res);
}
