import { pool, query } from "@/lib/db";
import { Entry } from "@/lib/types";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
  const result = await query("SELECT * FROM entry");

  return NextResponse.json(result.rows as Entry[]);
}

export async function POST(req: NextRequest) {
  const { collection_id } = await req.json();

  const result = await pool.query(
    "INSERT INTO entry(title, content, collection_id) VALUES($1, $2, $3)",
    ["New Entry", "# This is a new entry", collection_id],
  );

  return NextResponse.json(result);
}

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  console.log(searchParams);
  const id = searchParams.get("id");

  console.log(id);

  const result = await pool.query("DELETE FROM entry WHERE id = $1", [id]);

  return NextResponse.json(result);
}
