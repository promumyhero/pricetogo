import React from "react";
import { UtensilsCrossed, Sparkles, Database, Calculator, BookOpen, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenIngredients: () => void;
  onOpenNewMenu: () => void;
}

export function Header({
  activeTab,
  setActiveTab,
  onOpenIngredients,
  onOpenNewMenu,
}: HeaderProps) {
  return (
    <header className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Desktop & Tablet Top Bar */}
        <div className="flex items-center justify-between h-14 sm:h-15 gap-2">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
            <div className="h-8 w-8 sm:h-8.5 sm:w-8.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-zinc-50 dark:text-zinc-900 shadow-2xs">
              <UtensilsCrossed className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-50">
                  PriceToGo
                </span>
                <span className="text-[10px] font-medium tracking-wide px-1.5 py-0.2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
                  F&B
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 hidden lg:block leading-none mt-0.5">
                Kalkulator HPP & Reverse Pricing Delivery
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs (Hidden on small screens) */}
          <nav className="hidden md:flex items-center space-x-1 bg-zinc-100 dark:bg-zinc-900/90 p-1 rounded-lg border border-zinc-200/80 dark:border-zinc-800/80">
            <button
              onClick={() => setActiveTab("costing")}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "costing"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              <Calculator className="h-3.5 w-3.5" />
              <span>Resep & HPP</span>
            </button>
            <button
              onClick={() => setActiveTab("simulator")}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "simulator"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
              <span>Simulator Ojol</span>
            </button>
            <button
              onClick={() => setActiveTab("formula")}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "formula"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Panduan Rumus</span>
            </button>
          </nav>

          {/* Action Toolbar & Theme Toggle */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenIngredients}
              className="text-xs h-8 px-2 sm:px-3 text-zinc-700 dark:text-zinc-300"
              title="Buka Master Bahan Baku"
            >
              <Database className="h-3.5 w-3.5 sm:mr-1.5 text-zinc-500" />
              <span className="hidden sm:inline">Bahan</span>
            </Button>
            <Button
              size="sm"
              onClick={onOpenNewMenu}
              className="text-xs h-8 px-2.5 sm:px-3"
              title="Tambah Menu Makanan/Minuman Baru"
            >
              <Plus className="h-3.5 w-3.5 sm:mr-1" />
              <span className="hidden sm:inline">Menu Baru</span>
              <span className="sm:hidden">Menu</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Navigation Strip (Visible on mobile screens < md) */}
        <div className="md:hidden pb-2.5 pt-0.5 border-t border-zinc-100 dark:border-zinc-800/60">
          <nav className="grid grid-cols-3 gap-1 bg-zinc-100 dark:bg-zinc-900/90 p-1 rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 text-center">
            <button
              onClick={() => setActiveTab("costing")}
              className={`flex items-center justify-center space-x-1 py-1.5 px-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                activeTab === "costing"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs font-semibold"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <Calculator className="h-3 w-3 shrink-0" />
              <span className="truncate">Resep HPP</span>
            </button>
            <button
              onClick={() => setActiveTab("simulator")}
              className={`flex items-center justify-center space-x-1 py-1.5 px-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                activeTab === "simulator"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs font-semibold"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <Sparkles className="h-3 w-3 shrink-0 text-amber-500" />
              <span className="truncate">Simulator</span>
            </button>
            <button
              onClick={() => setActiveTab("formula")}
              className={`flex items-center justify-center space-x-1 py-1.5 px-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                activeTab === "formula"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs font-semibold"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <BookOpen className="h-3 w-3 shrink-0" />
              <span className="truncate">Panduan</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
