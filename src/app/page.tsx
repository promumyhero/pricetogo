"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  IngredientInput,
  MenuItemInput,
  RecipeItemInput,
  calculateMenuCosting,
  DEFAULT_PLATFORMS,
  calculateOnlinePricing,
} from "@/lib/calculator";
import { INITIAL_INGREDIENTS, INITIAL_MENUS } from "@/lib/storage";
import { formatIDR } from "@/lib/utils";
import { useToast } from "@/components/ToastProvider";
import { Header } from "@/components/Header";
import { MenuSelector } from "@/components/MenuSelector";
import { RecipeCostingTable } from "@/components/RecipeCostingTable";
import { DineInPricingCard } from "@/components/DineInPricingCard";
import { OnlineReversePricingCard } from "@/components/OnlineReversePricingCard";
import { Button } from "@/components/ui/button";
import {
  Download,
  Upload,
  RotateCcw,
  Layers,
  ChefHat,
  BadgePercent,
  ArrowRight,
} from "lucide-react";

// LAZY LOADING: On-demand dynamic imports for modals and heavy simulator views
const IngredientsModal = dynamic(
  () => import("@/components/IngredientsModal").then((mod) => mod.IngredientsModal),
  { ssr: false }
);

const MenuModal = dynamic(
  () => import("@/components/MenuModal").then((mod) => mod.MenuModal),
  { ssr: false }
);

const PromoSimulatorSandbox = dynamic(
  () => import("@/components/PromoSimulatorSandbox").then((mod) => mod.PromoSimulatorSandbox),
  {
    loading: () => (
      <div className="p-8 text-center text-xs text-zinc-500 animate-pulse">
        Memuat Simulator Promo Ojol...
      </div>
    ),
  }
);

const FormulaGuideView = dynamic(
  () => import("@/components/FormulaGuideView").then((mod) => mod.FormulaGuideView),
  {
    loading: () => (
      <div className="p-8 text-center text-xs text-zinc-500 animate-pulse">
        Memuat Panduan Formula...
      </div>
    ),
  }
);

export default function Home() {
  const toast = useToast();

  // State
  const [ingredients, setIngredients] = useState<IngredientInput[]>(INITIAL_INGREDIENTS);
  const [menus, setMenus] = useState<MenuItemInput[]>(INITIAL_MENUS);
  const [selectedMenuId, setSelectedMenuId] = useState<string>(INITIAL_MENUS[0]?.id || "");
  const [activeTab, setActiveTab] = useState<string>("costing");
  const [mobileView, setMobileView] = useState<"all" | "recipe" | "pricing">("all");

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

  // Preview quick reverse price for mobile pill
  const quickOnlinePricing = calculateOnlinePricing(
    costing,
    DEFAULT_PLATFORMS[0]
  );

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
      const target = prev.find((m) => m.id === id);
      const next = prev.filter((m) => m.id !== id);
      if (next.length > 0) setSelectedMenuId(next[0].id);
      if (target) {
        toast.info("Menu Dihapus", `Menu "${target.name}" telah dihapus.`);
      }
      return next;
    });
  };

  // Handlers for Ingredients
  const handleAddIngredient = (newIng: IngredientInput) => {
    setIngredients((prev) => [...prev, newIng]);
  };

  const handleDeleteIngredient = (id: string) => {
    setIngredients((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) {
        toast.info("Bahan Dihapus", `Bahan "${target.name}" telah dihapus dari Master Data.`);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  // Reset Data to Defaults
  const handleResetData = () => {
    if (confirm("Reset seluruh data bahan baku dan menu ke template standar restoran?")) {
      setIngredients(INITIAL_INGREDIENTS);
      setMenus(INITIAL_MENUS);
      setSelectedMenuId(INITIAL_MENUS[0].id);
      localStorage.removeItem("pricetogo_ingredients");
      localStorage.removeItem("pricetogo_menus");
      toast.info(
        "Data Template Direset",
        "Seluruh bahan baku dan menu telah dikembalikan ke template awal."
      );
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
    toast.success("Cadangan Diunduh", "File backup data JSON berhasil diunduh.");
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
          toast.success(
            "Data Berhasil Dipulihkan",
            "Seluruh data bahan baku dan resep berhasil dimuat dari file backup."
          );
        } else {
          toast.error(
            "Format File Tidak Valid",
            "File JSON tidak memiliki struktur data bahan dan menu yang valid."
          );
        }
      } catch {
        toast.error("Gagal Membaca File", "Terjadi kesalahan saat memproses file JSON.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-zinc-100/60 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors pb-16 lg:pb-0">
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-6">
        {activeTab === "costing" && (
          <div className="space-y-4 sm:space-y-6">
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
              <div className="space-y-4">
                {/* Responsive View Switcher on Mobile & Tablet (< lg) */}
                <div className="lg:hidden flex items-center p-1 rounded-xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setMobileView("all")}
                    className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      mobileView === "all"
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                    }`}
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span>Semua</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileView("recipe")}
                    className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      mobileView === "recipe"
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                    }`}
                  >
                    <ChefHat className="h-3.5 w-3.5" />
                    <span>Resep BOM</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileView("pricing")}
                    className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      mobileView === "pricing"
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                    }`}
                  >
                    <BadgePercent className="h-3.5 w-3.5" />
                    <span>Hasil Harga</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
                  {/* Left Section: Recipe Ingredients BOM & Costing Waterfall */}
                  {(mobileView === "all" || mobileView === "recipe") && (
                    <div className="lg:col-span-7 space-y-4 sm:space-y-6">
                      <RecipeCostingTable
                        menu={selectedMenu}
                        ingredients={ingredients}
                        costing={costing}
                        onUpdateRecipeItems={handleUpdateRecipeItems}
                        onUpdateMenuParameters={handleUpdateMenuParameters}
                        onOpenIngredientsModal={() => setIsIngredientsModalOpen(true)}
                      />
                    </div>
                  )}

                  {/* Right Section: Dine-in Pricing Card & Reverse Delivery Card */}
                  {(mobileView === "all" || mobileView === "pricing") && (
                    <div className="lg:col-span-5 space-y-4 sm:space-y-6">
                      {/* Offline Pricing Card */}
                      <DineInPricingCard
                        menu={selectedMenu}
                        costing={costing}
                        onUpdateMenuParameters={handleUpdateMenuParameters}
                      />

                      {/* Online Delivery Reverse Pricing (GoFood / GrabFood) */}
                      <OnlineReversePricingCard costing={costing} />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs px-4">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Belum ada menu yang dibuat.</p>
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingMenu(null);
                    setIsMenuModalOpen(true);
                  }}
                  className="mt-3 text-xs"
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

      {/* Floating Bottom Quick Price Summary on Mobile (< lg) */}
      {activeTab === "costing" && selectedMenu && (
        <div className="lg:hidden fixed bottom-3 left-3 right-3 z-30">
          <div className="bg-zinc-900/95 dark:bg-zinc-900/95 text-white backdrop-blur-md border border-zinc-800 rounded-xl p-2.5 px-3.5 shadow-xl flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[10px] text-zinc-400 truncate flex items-center space-x-1.5">
                <span className="font-medium text-zinc-200 truncate">{selectedMenu.name}</span>
                <span>•</span>
                <span>HPP: {formatIDR(costing.cogsOnline)}</span>
              </div>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="font-mono text-sm font-bold text-white tabular-nums">
                  {formatIDR(quickOnlinePricing.recommendedListingPrice)}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono tabular-nums">
                  (Net: {formatIDR(quickOnlinePricing.netPayoutToMerchant)})
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setMobileView("pricing");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center space-x-1 bg-white text-zinc-950 px-2.5 py-1.5 rounded-lg text-xs font-semibold shrink-0 cursor-pointer shadow-2xs hover:bg-zinc-100 transition-colors"
            >
              <span>Rincian</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* Footer & Data Utilities */}
      <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 py-4 text-xs text-zinc-500 mt-8 sm:mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-zinc-600 dark:text-zinc-400 font-mono text-[11px]">
              PostgreSQL Ready • Local Fast Cache Active
            </span>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4 text-[11px]">
            <button
              onClick={handleExportJSON}
              className="flex items-center space-x-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            >
              <Download className="h-3 w-3" />
              <span>Backup JSON</span>
            </button>

            <label className="flex items-center space-x-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-pointer">
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
              className="flex items-center space-x-1 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset Contoh</span>
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
        existingMenus={menus}
      />
    </div>
  );
}
