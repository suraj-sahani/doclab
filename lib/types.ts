import { Doc } from "@/convex/_generated/dataModel";

export type Action<T> =
  | Promise<{ success: true; message: string; data: T }>
  | Promise<{ success: false; error: string }>;

export interface AccumulatedDoc extends Doc<"documents"> {
  childDocs: Doc<"documents">[];
}
