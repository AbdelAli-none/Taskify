"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const handleTodoStatus = async (id: number, isDone: boolean) => {
  await prisma.todo.update({
    where: {
      id: id,
    },
    data: {
      isDone: !isDone,
      completedAt: !isDone ? new Date() : null,
    },
  });

  revalidatePath("/");
};
