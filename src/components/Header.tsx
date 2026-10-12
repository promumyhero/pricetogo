import React from "react";
import { UtensilsCrossed, Sparkles, Database, Calculator, BookOpen, Layers } from "lucide-react";
import { Button } from "./ui/button";

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
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-linear-to-br from-sky-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/10">
              <UtensilsCrossed className="h-5 w-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight text-white">PriceToGo</span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  F&B Costing
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Kalkulator HPP & Reverse Pricing GoFood / GrabFood
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab("costing")}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === "costing"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Calculator className="h-3.5 w-3.5" />
              <span>Resep & HPP Menu</span>
            </button>
            <button
              onClick={() => setActiveTab("simulator")}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === "simulator"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Simulator Ojol Anti-Rugi</span>
            </button>
            <button
              onClick={() => setActiveTab("formula")}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === "formula"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5 text-sky-400" />
              <span>Panduan & Rumus F&B</span>
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenIngredients}
              className="text-xs h-8"
            >
              <Database className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
              Master Bahan Baku
            </Button>
            <Button
              size="sm"
              onClick={onOpenNewMenu}
              className="text-xs h-8 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold"
            >
              <Layers className="h-3.5 w-3.5 mr-1.5" />
              + Menu Baru
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
