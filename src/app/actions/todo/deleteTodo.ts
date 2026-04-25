"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const deleteTodo = async (id: number) => {
  const { userId, isAuthenticated } = await auth();

  if (!userId || !isAuthenticated) {
    throw new Error("Unauthorized: You must be signed in to update todo.");
  }

  // get the db user by clerkUserId
  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) throw new Error("User not found");

  try {
    await prisma.todo.delete({
      where: {
        id: id,
        userId: user.id,
      },
    });

    revalidatePath("/");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to delete todo: ", error);
    return {
      success: false,
      error: "Failed to delete todo",
    };
  }
};
