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
    <header className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="h-8.5 w-8.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-zinc-50 dark:text-zinc-900 shadow-2xs">
              <UtensilsCrossed className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-50">
                  PriceToGo
                </span>
                <span className="text-[10px] font-medium tracking-wide px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
                  F&B Pricing
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 hidden sm:block">
                Kalkulator HPP & Reverse Pricing Delivery
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 bg-zinc-100 dark:bg-zinc-900/90 p-1 rounded-lg border border-zinc-200/80 dark:border-zinc-800/80">
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
              <span className="hidden md:inline">Panduan Rumus</span>
              <span className="md:hidden">Panduan</span>
            </button>
          </nav>

          {/* Action Toolbar & Theme Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenIngredients}
              className="hidden sm:inline-flex text-xs h-8"
            >
              <Database className="h-3.5 w-3.5 mr-1.5 text-zinc-500" />
              Master Bahan
            </Button>
            <Button
              size="sm"
              onClick={onOpenNewMenu}
              className="text-xs h-8"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Menu Baru
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
