"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getTodos() {
  const { userId, isAuthenticated } = await auth();

  if (!userId || !isAuthenticated) {
    throw new Error("Unauthorized: You must be signed in to get todos.");
  }

  // get db user by clerkUserId
  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) throw new Error("User not found");

  try {
    // get todos
    const todos = await prisma.todo.findMany({
      where: {
        userId: user.id,
      },
      include: {
        category: true,
        priority: true,
      },
      orderBy: {
        priority: {
          value: "desc",
        },
      },
    });

    return {
      success: true,
      data: todos,
    };
  } catch (error) {
    console.error("Failed to get todos");
    return {
      success: false,
      error: error,
    };
  }
}
