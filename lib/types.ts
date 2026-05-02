export type Action<T> =
  | Promise<{ success: true; message: string; data: T }>
  | Promise<{ success: false; error: string }>;

export interface User {
  first_name: string;
  last_name: string | null;
  email: string;
  imageUrl: string;
}

export interface DocRef {
  createdAt: string;
  role: "owner" | "editor";
  roomId: string;
  userId: string;
}

export interface DocumentInfo {
  title: string;
}
