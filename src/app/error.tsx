// src/app/error.tsx
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-4 rounded-xl bg-card p-6">
      <p className="text-5xl">😵</p>
      <h2 className="text-xl font-semibold text-foreground">
        Something went wrong
      </h2>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        {error.message ?? "An unexpected error occurred. Please try again."}
      </p>
      <Button
        onClick={reset}
        className="bg-blue-500 hover:bg-blue-600 duration-200"
      >
        Try again
      </Button>
    </div>
  );
}
