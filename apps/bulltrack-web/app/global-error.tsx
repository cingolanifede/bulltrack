"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-zinc-100 antialiased">
        <div className="flex min-h-dvh flex-col items-center justify-center p-6">
          <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h1 className="mb-2 text-xl font-semibold text-red-800">
              Application error
            </h1>
            <p className="mb-6 text-sm text-red-700">
              {error.message || "A critical error occurred. Please try again."}
            </p>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 py-2.5 font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
