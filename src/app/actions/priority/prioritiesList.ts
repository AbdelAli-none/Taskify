"use server";

import { prisma } from "@/lib/prisma";

export async function getPrioritiesList() {
  try {
    const priorities = await prisma.priority.findMany({
      orderBy: {
        value: "desc",
      },
    });

    return {
      success: true,
      data: priorities,
    };
  } catch (error) {
    console.error("Failed to fetch priorities: ", error);
    return {
      success: false,
      error: "Failed to load priorities",
    };
  }
}
