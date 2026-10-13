"use client";

import * as React from "react";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-8 w-24 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/50 animate-pulse",
          className
        )}
      />
    );
  }

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
          "flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer select-none",
          theme === "light"
            ? "bg-white text-zinc-950 shadow-xs font-semibold"
            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
        )}
        title="Aktifkan Mode Terang (Light Mode)"
        aria-pressed={theme === "light"}
      >
        <Sun
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            theme === "light" ? "text-amber-500 scale-105" : "text-zinc-400"
          )}
        />
        <span className="hidden sm:inline">Terang</span>
      </button>

      {/* Dark Mode Button */}
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={cn(
          "flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer select-none",
          theme === "dark"
            ? "bg-zinc-800 text-zinc-50 shadow-xs font-semibold"
            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
        )}
        title="Aktifkan Mode Gelap (Dark Mode)"
        aria-pressed={theme === "dark"}
      >
        <Moon
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            theme === "dark" ? "text-blue-400 scale-105" : "text-zinc-400"
          )}
        />
        <span className="hidden sm:inline">Gelap</span>
      </button>
    </div>
  );
}
