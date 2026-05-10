export type Action<T> =
  | Promise<{ success: true; message: string; data: T }>
  | Promise<{ success: false; error: string }>;
