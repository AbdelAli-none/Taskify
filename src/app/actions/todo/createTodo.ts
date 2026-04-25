"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface ICreateTodoProps {
  title: string;
  description: string;
  categoryId: number;
  priorityId: number;
}

export async function createTodo({
  title,
  description,
  categoryId,
  priorityId,
}: ICreateTodoProps) {
  const { userId, isAuthenticated } = await auth();

  if (!userId || !isAuthenticated) {
    throw new Error("Unauthorized: You must be signed in to create todo.");
  }

  // get the bd user  by clerkUserId
  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) throw new Error("User not found");

  // verify category belongs to this user
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      userId: user.id,
    },
  });

  if (!category) throw new Error("Category not found or doesn't belong to you");

  try {
    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        categoryId,
        priorityId,
        userId: user.id,
      },
      include: {
        category: true,
        priority: true,
      },
    });

    revalidatePath("/");

    return {
      success: true,
      data: todo,
    };
  } catch (error) {
    console.error("Failed to create todo: ", error);
    return {
      success: false,
      error: "Failed to create todo",
    };
  }
}
