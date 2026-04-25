import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function syncCurrentUser() {
  try {
    const clerkUser = await currentUser();

    // console.log(clerkUser);

    if (!clerkUser) {
      return null;
    }

    const email = clerkUser.emailAddresses[0].emailAddress;

    if (!email) {
      throw new Error("User email is not found");
    }

    // check if user exists in db via clerkUserId
    let dbUser = await prisma.user.findUnique({
      where: {
        clerkUserId: clerkUser.id,
      },
    });

    // check if user exists in db via email
    if (!dbUser) {
      dbUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });
    }

    if (dbUser) {
      // update existing User
      dbUser = await prisma.user.update({
        where: {
          id: dbUser.id,
        },
        data: {
          email,
          name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
          image: clerkUser.imageUrl,
        },
      });
    } else {
      // create a new user in db

      dbUser = await prisma.user.create({
        data: {
          clerkUserId: clerkUser.id,
          email,
          name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
          image: clerkUser.imageUrl,
        },
      });
      // console.log(`New user has created: ${email}`);
    }

    return dbUser;
  } catch (error) {
    console.error("Error syncing user from Clerk: ", error);
  }
}
