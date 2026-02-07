"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Loader } from "@/components/atoms/Loader";
import { DEFAULT_AUTHENTICATED_PATH } from "@/lib/auth-constants";

function getSafeRedirectTo(searchParams: URLSearchParams): string {
  const from = searchParams.get("from");
  if (!from || !from.startsWith("/") || from.includes("//")) {
    return DEFAULT_AUTHENTICATED_PATH;
  }
  return from;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.replace(getSafeRedirectTo(searchParams));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-surface-deep p-4">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative w-full max-w-[400px] rounded-2xl border border-border-dark bg-surface p-8 shadow-2xl shadow-black/40 sm:p-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary">
            <span className="text-xl font-bold text-on-primary">B</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Bulltrack Pro
            </h1>
            <p className="text-sm text-zinc-500">Classification dashboard</p>
          </div>
        </div>

        <p className="mb-6 text-sm text-zinc-400">
          Sign in to access the classification results and favorites.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-zinc-300">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="rounded-xl border border-border-muted bg-surface-input px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="you@example.com"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-zinc-300">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="rounded-xl border border-border-muted bg-surface-input px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="••••••••"
            />
          </label>
          {error && (
            <p
              className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400"
              role="alert"
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-surface-deep transition-colors hover:bg-primary-hover disabled:opacity-50 disabled:hover:bg-primary"
          >
            {loading ? (
              <>
                <Loader size="sm" variant="onPrimary" />
                <span>Signing in…</span>
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="mt-6 rounded-lg border border-border-dark bg-surface-input/80 px-3 py-2.5 text-xs text-zinc-500">
          Demo:{" "}
          <span className="font-mono text-zinc-400">admin@seed28.com</span> /{" "}
          <span className="font-mono text-zinc-400">seed28</span>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-surface-deep">
          <Loader fullPage variant="dark" label="Loading…" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
