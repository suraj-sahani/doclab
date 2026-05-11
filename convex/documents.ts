import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { AccumulatedDoc } from "@/lib/types";

export const createDocument = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized");

    const userId = identity.subject;

    const document = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    });

    return document;
  },
});

export const getUserDocuments = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized");

    const userId = identity.subject;

    const userDocuments = await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    // 2. Create a Map for O(1) lookup and initialize the recursive structure
    const docMap = new Map<string, AccumulatedDoc>();

    for (const doc of userDocuments) {
      docMap.set(doc._id, { ...doc, childDocs: [] });
    }

    const rootDocs: AccumulatedDoc[] = [];

    // 3. Build the tree by reference
    for (const docId of docMap.keys()) {
      const doc = docMap.get(docId)!;
      const parentId = doc.parentDocument;

      if (parentId && docMap.has(parentId)) {
        // This is a child: add it to its parent's childDocs array
        // Because we are using references, this works for any depth
        docMap.get(parentId)!.childDocs.push(doc);
      } else {
        // This is a root document (no parent or parent is archived/missing)
        rootDocs.push(doc);
      }
    }

    return rootDocs;
  },
});
