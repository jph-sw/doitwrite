"use server";

import { db } from "@/lib/db";
import { Entry } from "@/lib/types";

export async function getEntryById(id: string) {
  const res = (await db
    .prepare("SELECT * FROM entry WHERE id = ?")
    .get(id)) as Promise<Entry>;

  return res;
}

export async function updateEntryTitle(id: string, title: string) {
  const res = db
    .prepare("UPDATE entry SET title = ? WHERE id = ?")
    .run(title, id);

  return res;
}

export async function updateEntryContent(id: string, content: string) {
  const res = db
    .prepare("UPDATE entry SET content = ? WHERE id = ?")
    .run(content, id);

  return res;
}
