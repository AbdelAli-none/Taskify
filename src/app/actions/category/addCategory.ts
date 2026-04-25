"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const addCategory = async ({
  name,
  color,
  iconCategory,
}: {
  name: string;
  color: string;
  iconCategory: string;
}) => {
  const { userId, isAuthenticated } = await auth();

  if (!userId || !isAuthenticated) {
    throw new Error("Unauthorized: You must be signed in to create category.");
  }

  // get db user via clerkUserId
  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) throw new Error("User not found");

  // check if this category is found already
  const existingCategory = await prisma.category.findFirst({
    where: {
      userId: user.id,
      name: {
        equals: name,
        mode: "insensitive", // This handles "Work" vs "work" automatically
      },
    },
  });

  if (existingCategory) {
    return {
      success: false,
      error: "This category is already created!",
    };
  }

  try {
    const createdCategory = await prisma.category.create({
      data: {
        name,
        color,
        iconCategory,
        userId: user.id,
      },
      include: {
        todos: true,
        user: true,
      },
    });

    revalidatePath("/");

    return {
      success: true,
      data: createdCategory,
    };
  } catch (error) {
    console.error("Failed to create a category: ", error);
    return {
      success: false,
      error: "Failed to create a category",
    };
  }
};
