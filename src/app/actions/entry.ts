"use server";

import { pool, query } from "@/lib/db";
import { Entry } from "@/lib/types";

export async function getEntryById(id: string): Promise<Entry | null> {
  const result = await query("SELECT * FROM entry WHERE id = $1", [id]);

  if (result.rows && result.rows.length > 0) {
    return result.rows[0] as Entry;
  }

  return null;
}

export async function updateEntryTitle(id: string, title: string) {
  const res = await query("UPDATE entry SET title = $1 WHERE id = $2", [
    title,
    id,
  ]);
  return res;
}

export async function updateEntryContent(id: string, content: string) {
  const res = await query("UPDATE entry SET content = $1 WHERE id = $2", [
    content,
    id,
  ]);
  return res;
}
