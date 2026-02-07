"use client";

import { useEffect } from "react";
import { Button } from "@/components/atoms/Button";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[App error boundary]", error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <h1 className="mb-2 text-xl font-semibold text-red-800">
          Something went wrong
        </h1>
        <p className="mb-6 text-sm text-red-700">
          {error.message || "An unexpected error occurred."}
        </p>
        <Button variant="secondary" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
