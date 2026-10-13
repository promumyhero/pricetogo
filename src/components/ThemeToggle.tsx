"use client";

import * as React from "react";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-8 w-16 sm:w-28 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/50 animate-pulse",
          className
        )}
      />
    );
  }

  const activeTheme = resolvedTheme || theme || "dark";
  const isDark = activeTheme === "dark";

  return (
    <div
      className={cn(
        "inline-flex items-center p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/90 shadow-2xs",
        className
      )}
      role="group"
      aria-label="Pengaturan Mode Tampilan"
    >
      {/* Light Mode Button */}
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={cn(
          "flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer select-none",
          !isDark
            ? "bg-white text-zinc-950 shadow-xs font-semibold"
            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
        )}
        title="Aktifkan Mode Terang (Light Mode)"
        aria-pressed={!isDark}
      >
        <Sun
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            !isDark ? "text-amber-500 scale-105" : "text-zinc-400"
          )}
        />
        <span className="hidden sm:inline">Terang</span>
      </button>

      {/* Dark Mode Button */}
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={cn(
          "flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer select-none",
          isDark
            ? "bg-zinc-800 text-zinc-50 shadow-xs font-semibold"
            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
        )}
        title="Aktifkan Mode Gelap (Dark Mode)"
        aria-pressed={isDark}
      >
        <Moon
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            isDark ? "text-blue-400 scale-105" : "text-zinc-400"
          )}
        />
        <span className="hidden sm:inline">Gelap</span>
      </button>
    </div>
  );
}
