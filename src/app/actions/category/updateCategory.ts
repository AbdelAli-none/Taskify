"use server";

import { ICategoryToUpdate } from "@/components/EditCategoryDialog";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const updateCategory = async (id: number, data: ICategoryToUpdate) => {
  const { userId, isAuthenticated } = await auth();

  if (!userId || !isAuthenticated) {
    throw new Error("Unauthorized: You must be signed in to update category.");
  }

  // get the bd user by clerkUserId
  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) throw new Error("User not found");

  try {
    const updatedCategory = await prisma.category.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        name: data.name,
        iconCategory: data.iconCategory,
        color: data.color,
      },
    });

    revalidatePath("/");

    return {
      success: true,
      data: updatedCategory,
    };
  } catch (error) {
    console.error("Failed to update category: ", error);
    return {
      success: false,
      error: "Failed to update category",
    };
  }
};
