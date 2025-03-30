import { query } from "@/lib/db";
import { Collection } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const res = await query("SELECT * FROM collection");

  return NextResponse.json(res.rows as Collection[]);
}

export async function POST(req: NextRequest) {
  const { title, color } = await req.json();

  const result = await query(
    `INSERT INTO collection(title, color) VALUES($1, $2) RETURNING *`,
    [title, color],
  );

  return NextResponse.json(result);
}

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "Missing id", status: 400 });
  }

  await query("DELETE FROM entry WHERE collection_id = $1", [id]);
  const result = await query("DELETE FROM collection WHERE id = $1", [id]);

  return NextResponse.json(result);
}
