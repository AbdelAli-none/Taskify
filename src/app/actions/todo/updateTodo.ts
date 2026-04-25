"use server";

import { ITodo } from "@/interfaces";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const updateTodo = async (newTodo: ITodo) => {
  const {
    title,
    id,
    description,
    category: { id: idCategory },
    priority: { id: idPriority },
  } = newTodo;

  const { userId, isAuthenticated } = await auth();

  if (!userId || !isAuthenticated)
    throw new Error("Unauthorized: You must be signed in to update todo.");

  // get the db user by clerkUserId
  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) throw new Error("User not found");

  try {
    const updatedTodo = await prisma.todo.update({
      where: {
        id: id,
        userId: user.id,
      },
      data: {
        title: title,
        description: description,
        categoryId: idCategory,
        priorityId: idPriority,
      },
      include: {
        category: true,
        priority: true,
      },
    });

    revalidatePath("/");

    return {
      success: true,
      data: updatedTodo,
    };
  } catch (error) {
    console.error("Failed to update todo: ", error);
    return {
      success: false,
      error: "Failed to update todo",
    };
  }
};
