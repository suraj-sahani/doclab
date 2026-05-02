"use server";

import { auth } from "@clerk/nextjs/server";
import { adminDb } from "./firebase/server";
import { Action } from "./types";

export const createDocument = async (): Action<{ docId: string }> => {
  try {
    const { sessionClaims, userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }
    // Get the document collection
    const docCollection = adminDb.collection("documents");
    // Create a document in the collection
    const doc = await docCollection.add({
      title: "New Doc",
    });

    // Once the document is created, we need to add the user,
    // to the document room
    await adminDb
      .collection("users")
      .doc(sessionClaims!.email!)
      .collection("rooms")
      .doc(doc.id)
      .set({
        userId: sessionClaims?.email,
        role: "owner",
        createdAt: new Date(),
        roomId: doc.id,
      });

    return {
      success: true,
      data: { docId: doc.id },
      message: "Document created successfully.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Could not create document.",
    };
  }
};
