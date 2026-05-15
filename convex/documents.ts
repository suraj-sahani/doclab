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
        const currentDoc = docMap.get(parentId)!;
        currentDoc.childDocs.push(doc);
      } else {
        // This is a root document (no parent or parent is archived/missing)
        rootDocs.push(doc);
      }
    }

    return rootDocs;
  },
});

export const archiveDoc = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized");

    const userId = identity.subject;

    const existingDoc = await ctx.db.get("documents", args.id);

    if (!existingDoc) throw new Error("Document not found");

    if (existingDoc.userId !== userId) throw new Error("Unauthorized");

    // We also need to archive all the child docs of the current doc.
    const recursiveArchive = async (docId: Id<"documents">) => {
      // Get all children docs for a particular doc ID
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", docId),
        )
        .collect();

      // Update every single child doc
      for (const child of children) {
        await ctx.db.patch("documents", child._id, { isArchived: true });

        // Do the same thing if this child also has its own children docs
        await recursiveArchive(child._id);
      }
    };

    // Archive the current doc
    const updatedDoc = await ctx.db.patch("documents", args.id, {
      isArchived: true,
    });

    await recursiveArchive(args.id);

    return updatedDoc;
  },
});

export const getArchivedDocs = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized");

    const userId = identity.subject;

    const archivedDocs = ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return archivedDocs;
  },
});

export const restoreArchivedDoc = mutation({
  args: {
    docId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized");

    const userId = identity.subject;

    const existingDoc = await ctx.db.get("documents", args.docId);

    if (!existingDoc) throw new Error("Document not found.");
    if (existingDoc.userId === userId) throw new Error("Unauthorized");

    const recursiveRestore = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId),
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch("documents", child._id, { isArchived: false });
        await recursiveRestore(child._id);
      }
    };

    const options: Partial<Doc<"documents">> = {};
    if (existingDoc.parentDocument) {
      const parent = await ctx.db.get("documents", existingDoc.parentDocument);
      if (parent?.isArchived) {
        options.parentDocument = undefined;
      }
    }

    await ctx.db.patch("documents", args.docId, options);
    await recursiveRestore(args.docId);
    return existingDoc;
  },
});
