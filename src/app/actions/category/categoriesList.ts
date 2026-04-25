"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getCategoriesList() {
  const { userId, isAuthenticated } = await auth();

  if (!userId || !isAuthenticated) {
    throw new Error(
      "Unauthorized: You must be signed in to access categories.",
    );
  }

  // get the bd user by clerkUserId
  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) throw new Error("User not found");

  try {
    const categories = await prisma.category.findMany({
      where: {
        userId: user.id,
      },
      orderBy: { updatedAt: "desc" },
    });

    return {
      success: true,
      data: categories,
    };
  } catch (error) {
    console.error("Failed to fetch categories: ", error);
    return {
      success: false,
      error: "Failed to load categories",
    };
  }
}
