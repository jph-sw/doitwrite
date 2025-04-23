import { authClient } from "./auth-client";

export type Collection = {
  id: number;
  title: string;
  color: string;
};

export type Entry = {
  id: number;
  collection_id: number;
  title: string;
  created_at: string;
  updated_at: string;
  updated_by: string;
  content: string;
};

export type Favorite = {
  id: number;
  entry_id: number;
  user_id: string;
};

export type ActiveOrganization = typeof authClient.$Infer.ActiveOrganization;
