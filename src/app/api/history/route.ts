import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { Entry } from "@/lib/types";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const res = await query(`SELECT * FROM entry WHERE updated_by = $1`, [
    session?.user?.id.toString() || "",
  ]);

  if (!res.rows.length) {
    return NextResponse.json({ message: "No history found" }, { status: 404 });
  }

  return NextResponse.json(res.rows as Entry[]);
}
