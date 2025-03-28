import { db } from "@/lib/db";
import { Collection } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const res = db.prepare("SELECT * FROM collection");

  return NextResponse.json(res.all() as Collection[]);
}

export async function POST(req: NextRequest) {
  const { title, color } = await req.json();

  const res = db
    .prepare("INSERT INTO collection (title, color) VALUES (?, ?)")
    .run(title, color);

  return NextResponse.json(res);
}
