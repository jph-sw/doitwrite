import { query } from "@/lib/db";
import { Favorite } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");

  const res = await query(`SELECT * FROM favorite WHERE user_id = $1`, [id!]);

  return NextResponse.json(res.rows as Favorite[]);
}

export async function POST(req: NextRequest) {
  const { entry_id, user_id } = await req.json();

  const res = query(`INSERT INTO favorite(entry_id, user_id) VALUES($1, $2)`, [
    entry_id,
    user_id,
  ]);

  return NextResponse.json(res);
}

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");

  console.log("Removing", id);

  const res = await query(`DELETE FROM favorite WHERE entry_id = $1`, [id!]);

  return NextResponse.json(res);
}
