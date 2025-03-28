export type Collection = {
  id: number;
  title: string;
  color: string;
};

export type Entry = {
  id: number;
  collection_id: number;
  title: string;
  created_at: Date;
  content: string;
};
