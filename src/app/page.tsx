"use client";

import React, { useState, useEffect } from "react";
import {
  IngredientInput,
  MenuItemInput,
  RecipeItemInput,
  calculateMenuCosting,
} from "@/lib/calculator";
import { INITIAL_INGREDIENTS, INITIAL_MENUS } from "@/lib/storage";
import { Header } from "@/components/Header";
import { MenuSelector } from "@/components/MenuSelector";
import { RecipeCostingTable } from "@/components/RecipeCostingTable";
import { DineInPricingCard } from "@/components/DineInPricingCard";
import { OnlineReversePricingCard } from "@/components/OnlineReversePricingCard";
import { IngredientsModal } from "@/components/IngredientsModal";
import { MenuModal } from "@/components/MenuModal";
import { PromoSimulatorSandbox } from "@/components/PromoSimulatorSandbox";
import { FormulaGuideView } from "@/components/FormulaGuideView";
import { Button } from "@/components/ui/button";
import { Download, Upload, RotateCcw } from "lucide-react";

export default function Home() {
  // State
  const [ingredients, setIngredients] = useState<IngredientInput[]>(INITIAL_INGREDIENTS);
  const [menus, setMenus] = useState<MenuItemInput[]>(INITIAL_MENUS);
  const [selectedMenuId, setSelectedMenuId] = useState<string>(INITIAL_MENUS[0]?.id || "");
  const [activeTab, setActiveTab] = useState<string>("costing");

  // Modals
  const [isIngredientsModalOpen, setIsIngredientsModalOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItemInput | null>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedIngs = localStorage.getItem("pricetogo_ingredients");
        const savedMenus = localStorage.getItem("pricetogo_menus");
        if (savedIngs) setIngredients(JSON.parse(savedIngs));
        if (savedMenus) {
          const parsed = JSON.parse(savedMenus);
          setMenus(parsed);
          if (parsed.length > 0) setSelectedMenuId(parsed[0].id);
        }
      } catch (e) {
        console.warn("Could not load from localStorage:", e);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    try {
      localStorage.setItem("pricetogo_ingredients", JSON.stringify(ingredients));
      localStorage.setItem("pricetogo_menus", JSON.stringify(menus));
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
  }, [ingredients, menus]);

  // Active Menu & Calculation
  const selectedMenu =
    menus.find((m) => m.id === selectedMenuId) || menus[0] || null;

  const ingredientMap = new Map<string, IngredientInput>(
    ingredients.map((i) => [i.id, i])
  );

  const costing = selectedMenu
    ? calculateMenuCosting(selectedMenu, ingredientMap)
    : {
        rawFoodCost: 0,
        overheadBufferCost: 0,
        cogsDineIn: 0,
        cogsOnline: 0,
        suggestedDineInPrice: 0,
        finalDineInPrice: 0,
        dineInGrossProfit: 0,
        dineInGrossMargin: 0,
        dineInFoodCostPercent: 0,
        itemBreakdowns: [],
      };

  // Handlers for Menu updates
  const handleUpdateRecipeItems = (newItems: RecipeItemInput[]) => {
    if (!selectedMenu) return;
    setMenus((prev) =>
      prev.map((m) => (m.id === selectedMenu.id ? { ...m, recipeItems: newItems } : m))
    );
  };

  const handleUpdateMenuParameters = (params: Partial<MenuItemInput>) => {
    if (!selectedMenu) return;
    setMenus((prev) =>
      prev.map((m) => (m.id === selectedMenu.id ? { ...m, ...params } : m))
    );
  };

  const handleSaveMenu = (menuToSave: MenuItemInput) => {
    setMenus((prev) => {
      const exists = prev.some((m) => m.id === menuToSave.id);
      if (exists) {
        return prev.map((m) => (m.id === menuToSave.id ? menuToSave : m));
      } else {
        return [...prev, menuToSave];
      }
    });
    setSelectedMenuId(menuToSave.id);
  };

  const handleDeleteMenu = (id: string) => {
    setMenus((prev) => {
      const next = prev.filter((m) => m.id !== id);
      if (next.length > 0) setSelectedMenuId(next[0].id);
      return next;
    });
  };

  // Handlers for Ingredients
  const handleAddIngredient = (newIng: IngredientInput) => {
    setIngredients((prev) => [...prev, newIng]);
  };

  const handleDeleteIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  };

  // Reset Data to Factory Defaults
  const handleResetData = () => {
    if (confirm("Reset seluruh data bahan baku dan menu ke template standar restoran?")) {
      setIngredients(INITIAL_INGREDIENTS);
      setMenus(INITIAL_MENUS);
      setSelectedMenuId(INITIAL_MENUS[0].id);
      localStorage.removeItem("pricetogo_ingredients");
      localStorage.removeItem("pricetogo_menus");
    }
  };

  // Export JSON
  const handleExportJSON = () => {
    const data = { ingredients, menus, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pricetogo-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.ingredients && parsed.menus) {
          setIngredients(parsed.ingredients);
          setMenus(parsed.menus);
          if (parsed.menus.length > 0) setSelectedMenuId(parsed.menus[0].id);
          alert("Data berhasil diimpor!");
        } else {
          alert("Format file JSON tidak valid.");
        }
      } catch {
        alert("Gagal membaca file JSON.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-white">
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenIngredients={() => setIsIngredientsModalOpen(true)}
        onOpenNewMenu={() => {
          setEditingMenu(null);
          setIsMenuModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "costing" && (
          <div className="space-y-6">
            {/* Menu Selection Toolbar */}
            <MenuSelector
              menus={menus}
              selectedMenuId={selectedMenuId}
              onSelectMenu={setSelectedMenuId}
              onEditMenu={(menu) => {
                setEditingMenu(menu);
                setIsMenuModalOpen(true);
              }}
              onDeleteMenu={handleDeleteMenu}
            />

            {selectedMenu ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Section: Recipe Ingredients BOM & Costing Waterfall */}
                <div className="lg:col-span-7 space-y-6">
                  <RecipeCostingTable
                    menu={selectedMenu}
                    ingredients={ingredients}
                    costing={costing}
                    onUpdateRecipeItems={handleUpdateRecipeItems}
                    onUpdateMenuParameters={handleUpdateMenuParameters}
                    onOpenIngredientsModal={() => setIsIngredientsModalOpen(true)}
                  />
                </div>

                {/* Right Section: Dine-in Pricing Card & Reverse Delivery Card */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Offline Pricing Card */}
                  <DineInPricingCard
                    menu={selectedMenu}
                    costing={costing}
                    onUpdateMenuParameters={handleUpdateMenuParameters}
                  />

                  {/* Online Delivery Reverse Pricing (GoFood / GrabFood) */}
                  <OnlineReversePricingCard costing={costing} />
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-xl">
                <p className="text-sm text-slate-400">Belum ada menu yang dibuat.</p>
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingMenu(null);
                    setIsMenuModalOpen(true);
                  }}
                  className="mt-3 text-xs bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold"
                >
                  Buat Menu Baru Sekarang
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "simulator" && <PromoSimulatorSandbox />}

        {activeTab === "formula" && <FormulaGuideView />}
      </main>

      {/* Footer & Data Utilities */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-4 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400 font-mono text-[11px]">
              PostgreSQL Schema Ready • Local Fast Cache Active
            </span>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            <button
              onClick={handleExportJSON}
              className="flex items-center space-x-1 hover:text-slate-300 transition-colors cursor-pointer"
            >
              <Download className="h-3 w-3" />
              <span>Backup JSON</span>
            </button>

            <label className="flex items-center space-x-1 hover:text-slate-300 transition-colors cursor-pointer">
              <Upload className="h-3 w-3" />
              <span>Pulihkan JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />
            </label>

            <button
              onClick={handleResetData}
              className="flex items-center space-x-1 hover:text-rose-400 transition-colors cursor-pointer text-slate-500"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset Data Contoh</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <IngredientsModal
        isOpen={isIngredientsModalOpen}
        onClose={() => setIsIngredientsModalOpen(false)}
        ingredients={ingredients}
        onAddIngredient={handleAddIngredient}
        onDeleteIngredient={handleDeleteIngredient}
      />

      <MenuModal
        isOpen={isMenuModalOpen}
        onClose={() => {
          setIsMenuModalOpen(false);
          setEditingMenu(null);
        }}
        initialMenu={editingMenu}
        onSaveMenu={handleSaveMenu}
      />
    </div>
  );
}
