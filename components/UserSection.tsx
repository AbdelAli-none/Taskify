// UserSection.tsx
"use client";
import { useUser } from "@clerk/nextjs";

export const UserSection = () => {
  const { user } = useUser();
  return (
    <span className="text-pink-400 dark:text-pink-500 capitalize text-md md:text-2xl font-extrabold">
      {user?.fullName}
    </span>
  );
};
