"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Loader } from "@/components/atoms/Loader";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isReady } = useAuth();

  useEffect(() => {
    if (!isReady) return;
    if (isAuthenticated) {
      router.replace("/classification-results");
    } else {
      router.replace("/login");
    }
  }, [isReady, isAuthenticated, router]);

  return (
    <div className="min-h-dvh bg-zinc-50">
      <Loader fullPage variant="light" label="Loading…" />
    </div>
  );
}
