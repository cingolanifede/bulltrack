"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { FiltersProvider, useFilters } from "@/lib/filters-context";
import { SidebarFilters } from "@/components/organisms/SidebarFilters";
import { Icon } from "@/components/atoms/Icon";
import { Avatar } from "@/components/atoms/Avatar";
import { Loader } from "@/components/atoms/Loader";

const LOCATION_OPTIONS = [
  "La soledad",
  "El remanso",
  "San Antonio",
  "Santa Rosa",
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isReady, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location, setLocation] = useState(LOCATION_OPTIONS[0]);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isReady, isAuthenticated, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!locationDropdownOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(e.target as Node)
      ) {
        setLocationDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [locationDropdownOpen]);

  if (!isReady || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface">
        <Loader fullPage label="Redirecting to login…" />
      </div>
    );
  }

  return (
    <FiltersProvider>
      <div className="flex h-screen min-h-0 overflow-hidden bg-surface">
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
          className={`fixed inset-0 z-40 bg-zinc-900/50 transition-opacity min-[1025px]:hidden ${
            sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />

        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 shrink-0 bg-surface transition-transform duration-200 ease-out min-[1025px]:static min-[1025px]:translate-x-0 ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full min-[1025px]:translate-x-0"
          }`}
        >
          <div className="flex h-14 items-center justify-between pl-6 lg:pl-10 min-[1025px]:h-16">
            <Link
              href="/classification-results"
              className="font-semibold text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                  <span className="text-[18px] font-semibold leading-5 text-on-primary">
                    B
                  </span>
                </div>
                <span className="text-[18px] font-semibold leading-5 text-white">
                  Bulltrack
                </span>
              </div>
            </Link>

            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 min-[1025px]:hidden"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex h-[calc(100%-4rem)] flex-col pl-6 pr-4 pt-4 min-[1025px]:max-w-[267px] min-[1025px]:pl-10">
            <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto pb-4">
              <SidebarFiltersContainer />
            </div>
            <div className="shrink-0 border-t border-border-dark py-4">
              <button
                type="button"
                onClick={() => logout()}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-[14px] font-medium text-zinc-400 transition-colors hover:bg-surface-elevated hover:text-white cursor-pointer"
              >
                <Icon name="log-out" className="h-5 w-5 shrink-0" />
                Log out
              </button>
            </div>
          </div>
        </aside>

        <div className="min-h-0 min-w-0 flex-1 flex flex-col">
          <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 bg-surface px-4 min-[1025px]:hidden">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setSidebarOpen(true)}
              className="-ml-1 rounded-lg p-2 text-zinc-200 hover:bg-surface-elevated hover:text-white"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <span className="font-semibold text-white">Bulltrack Pro</span>
          </header>

          <header className="hidden h-16 shrink-0 items-center justify-end gap-3 bg-surface px-6 min-[1025px]:flex pt-3">
            <div className="relative" ref={locationDropdownRef}>
              <button
                type="button"
                onClick={() => setLocationDropdownOpen((o) => !o)}
                aria-expanded={locationDropdownOpen}
                aria-haspopup="listbox"
                aria-label="Select location"
                className="flex h-10 items-center gap-2 rounded-xl border border-primary bg-surface-panel px-4 py-3 text-[14px] font-semibold text-primary transition-colors hover:bg-surface-panel-hover"
              >
                <Icon name="location-pin" className="h-6 w-6" />
                <span>{location}</span>
                <Icon
                  name="chevron-down"
                  className={`h-6 w-6 transition-transform ${locationDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
              {locationDropdownOpen && (
                <div
                  role="listbox"
                  className="absolute right-0 z-20 mt-1 min-w-[180px] rounded-xl border border-primary/30 bg-surface-panel py-1 shadow-lg"
                >
                  {LOCATION_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      role="option"
                      aria-selected={opt === location}
                      onClick={() => {
                        setLocation(opt);
                        setLocationDropdownOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-[14px] font-medium transition-colors hover:bg-surface-panel-hover ${
                        opt === location ? "text-primary" : "text-white"
                      }`}
                    >
                      <Icon name="location-pin" className="h-4 w-4 shrink-0" />
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Avatar size={56} showBadge={true} />
          </header>

          <main className="min-h-0 min-w-0 flex-1 pt-4 pl-4 min-[1025px]:pl-0">
            <div className="h-full min-h-0 rounded-t-[40px] bg-surface-content px-4 py-6 sm:px-8 sm:py-6 overflow-hidden flex flex-col">
              {children}
            </div>
          </main>
        </div>
      </div>
    </FiltersProvider>
  );
}

function SidebarFiltersContainer() {
  const {
    origen,
    setOrigen,
    paraVaquillona,
    setParaVaquillona,
    pelaje,
    setPelaje,
    sortByScore,
    setSortByScore,
  } = useFilters();

  return (
    <SidebarFilters
      origen={origen}
      onOrigenChange={setOrigen}
      paraVaquillona={paraVaquillona}
      onParaVaquillonaChange={setParaVaquillona}
      pelaje={pelaje}
      onPelajeChange={setPelaje}
      sortByScore={sortByScore}
      onSortByScoreChange={setSortByScore}
    />
  );
}
