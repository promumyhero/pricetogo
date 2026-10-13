import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  IngredientInput,
  MenuItemInput,
  RecipeItemInput,
  SUPPORTED_UNITS,
  calculateItemCost,
  MenuCostingBreakdown,
} from "@/lib/calculator";
import { formatIDR } from "@/lib/utils";
import { useToast } from "./ToastProvider";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import {
  Plus,
  Trash2,
  Package,
  Flame,
  ArrowRight,
  Search,
  Check,
  AlertTriangle,
  Sparkles,
  X,
} from "lucide-react";

interface RecipeCostingTableProps {
  menu: MenuItemInput;
  ingredients: IngredientInput[];
  costing: MenuCostingBreakdown;
  onUpdateRecipeItems: (newItems: RecipeItemInput[]) => void;
  onUpdateMenuParameters: (params: Partial<MenuItemInput>) => void;
  onOpenIngredientsModal?: () => void;
}

export function RecipeCostingTable({
  menu,
  ingredients,
  costing,
  onUpdateRecipeItems,
  onUpdateMenuParameters,
  onOpenIngredientsModal,
}: RecipeCostingTableProps) {
  const { warning: toastWarning, success: toastSuccess } = useToast();

  // New item draft state
  const [selectedIngredientId, setSelectedIngredientId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [usageQty, setUsageQty] = useState<string>("100");
  const [usageUnit, setUsageUnit] = useState<string>("GRAM");
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const ingredientMap = useMemo(
    () => new Map<string, IngredientInput>(ingredients.map((i) => [i.id, i])),
    [ingredients]
  );

  // O(1) Set lookup to check duplicate ingredients in this recipe
  const existingIngredientIds = useMemo(
    () => new Set(menu.recipeItems.map((item) => item.ingredientId)),
    [menu.recipeItems]
  );

  const selectedIngredient = selectedIngredientId
    ? ingredientMap.get(selectedIngredientId)
    : null;

  const isDuplicateInRecipe = selectedIngredientId
    ? existingIngredientIds.has(selectedIngredientId)
    : false;

  // Filter ingredients for autocomplete search
  const filteredIngredients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      // Prioritize ingredients not yet in recipe
      return [...ingredients].sort((a, b) => {
        const aIn = existingIngredientIds.has(a.id) ? 1 : 0;
        const bIn = existingIngredientIds.has(b.id) ? 1 : 0;
        return aIn - bIn;
      });
    }

    return ingredients
      .filter(
        (ing) =>
          ing.name.toLowerCase().includes(q) ||
          ing.category.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        const aIn = existingIngredientIds.has(a.id) ? 1 : 0;
        const bIn = existingIngredientIds.has(b.id) ? 1 : 0;
        return aIn - bIn;
      });
  }, [ingredients, searchQuery, existingIngredientIds]);

  // Autofill handler when selecting an ingredient
  const handleSelectIngredient = (ing: IngredientInput) => {
    setSelectedIngredientId(ing.id);
    setSearchQuery(ing.name);
    setIsSearchOpen(false);

    // Notify user if item is already in recipe
    if (existingIngredientIds.has(ing.id)) {
      toastWarning(
        "Bahan Sudah Ada di Resep",
        `"${ing.name}" sudah ada di dalam resep ini. Data duplikat tidak dapat ditambahkan.`
      );
    }

    // Intelligent metric unit & quantity autofill
    if (ing.purchaseUnit === "KG") {
      setUsageUnit("GRAM");
      setUsageQty("100");
    } else if (ing.purchaseUnit === "LITER") {
      setUsageUnit("ML");
      setUsageQty("100");
    } else if (ing.purchaseUnit === "PCS") {
      setUsageUnit("PCS");
      setUsageQty("1");
    } else if (ing.purchaseUnit === "BUTIR") {
      setUsageUnit("BUTIR");
      setUsageQty("1");
    } else if (ing.purchaseUnit === "LEMBAR") {
      setUsageUnit("LEMBAR");
      setUsageQty("1");
    } else {
      setUsageUnit(ing.purchaseUnit);
      setUsageQty("1");
    }
  };

  const handleAddIngredient = () => {
    if (!selectedIngredientId || isDuplicateInRecipe) return;
    const ing = ingredientMap.get(selectedIngredientId);
    if (!ing) return;

    const newItem: RecipeItemInput = {
      id: "ri-" + Date.now(),
      ingredientId: selectedIngredientId,
      usageQty: parseFloat(usageQty) || 1,
      usageUnit: usageUnit || ing.purchaseUnit,
    };

    onUpdateRecipeItems([...menu.recipeItems, newItem]);
    toastSuccess(
      "Bahan Ditambahkan",
      `"${ing.name}" (${newItem.usageQty} ${newItem.usageUnit}) berhasil dimasukkan ke resep.`
    );

    setSelectedIngredientId("");
    setSearchQuery("");
    setUsageQty("100");
    setUsageUnit("GRAM");
  };

  const handleRemoveItem = (itemId: string) => {
    onUpdateRecipeItems(menu.recipeItems.filter((i) => i.id !== itemId));
  };

  const handleUpdateItemQty = (itemId: string, newQty: number) => {
    onUpdateRecipeItems(
      menu.recipeItems.map((item) =>
        item.id === itemId ? { ...item, usageQty: Math.max(0, newQty) } : item
      )
    );
  };

  return (
    <Card className="border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-xs">
      {/* Table Header Section */}
      <CardHeader className="flex flex-row items-center justify-between p-3.5 sm:p-5 border-b border-zinc-100 dark:border-zinc-800/70 gap-2">
        <div className="space-y-0.5 sm:space-y-1">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Komposisi Resep (BOM)
            </CardTitle>
            <Badge variant="outline" className="font-mono text-[10px] px-1.5 py-0 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
              {menu.recipeItems.length} Bahan
            </Badge>
          </div>
          <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 sm:line-clamp-none">
            Kalkulasi biaya bahan per porsi dengan konversi metrik & faktor susut
          </p>
        </div>
        {onOpenIngredientsModal && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenIngredientsModal}
            className="h-7.5 sm:h-8 text-xs text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 shrink-0 px-2.5 sm:px-3"
          >
            Master Bahan
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-3.5 sm:p-5 space-y-4 sm:space-y-5">
        {/* Quick Add Form Bar with Searchable Combobox & Autofill */}
        <div className="bg-zinc-50/90 dark:bg-zinc-950/70 p-3 sm:p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
              Tambah Komponen Bahan
            </span>
            <span className="text-[10px] text-zinc-400 hidden sm:inline">
              *Ketik nama bahan untuk autofill takaran
            </span>
          </div>

          <div className="grid grid-cols-12 gap-2 sm:gap-2.5 items-end">
            {/* Searchable Autocomplete Combobox */}
            <div className="col-span-12 sm:col-span-5 relative" ref={searchContainerRef}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 block">
                  Cari & Pilih Bahan Baku
                </label>
                {selectedIngredient && !isDuplicateInRecipe && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center">
                    <Check className="h-2.5 w-2.5 mr-0.5" /> Terpilih
                  </span>
                )}
              </div>

              <div className="relative">
                <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-zinc-400 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Ketik untuk cari bahan..."
                  value={searchQuery}
                  onFocus={() => setIsSearchOpen(true)}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSearchQuery(val);
                    setIsSearchOpen(true);

                    // Check exact match to auto-select
                    const exact = ingredients.find(
                      (i) => i.name.toLowerCase() === val.trim().toLowerCase()
                    );
                    if (exact) {
                      handleSelectIngredient(exact);
                    } else if (selectedIngredientId && val !== selectedIngredient?.name) {
                      setSelectedIngredientId("");
                    }
                  }}
                  className={`h-8 text-xs pl-8 pr-7 bg-white dark:bg-zinc-900 transition-colors ${
                    isDuplicateInRecipe
                      ? "border-rose-500 text-rose-900 dark:text-rose-100 focus-visible:ring-rose-500/20"
                      : selectedIngredientId
                      ? "border-emerald-500/80 dark:border-emerald-600 text-zinc-900 dark:text-zinc-100"
                      : "border-zinc-200 dark:border-zinc-700"
                  }`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedIngredientId("");
                      setIsSearchOpen(true);
                    }}
                    className="absolute right-2 top-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                    title="Hapus pencarian"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown Popover */}
              {isSearchOpen && (
                <div className="absolute z-30 left-0 right-0 top-full mt-1.5 max-h-56 overflow-y-auto rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl text-xs divide-y divide-zinc-100 dark:divide-zinc-800 animate-smooth-reveal">
                  {filteredIngredients.length === 0 ? (
                    <div className="p-3 text-center text-zinc-400 text-[11px]">
                      Bahan &ldquo;{searchQuery}&rdquo; tidak ditemukan.
                      {onOpenIngredientsModal && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsSearchOpen(false);
                            onOpenIngredientsModal();
                          }}
                          className="block mx-auto mt-1 text-emerald-600 dark:text-emerald-400 font-medium underline cursor-pointer"
                        >
                          + Daftarkan di Master Bahan
                        </button>
                      )}
                    </div>
                  ) : (
                    filteredIngredients.map((ing) => {
                      const inRecipe = existingIngredientIds.has(ing.id);
                      const isSelected = ing.id === selectedIngredientId;

                      return (
                        <button
                          key={ing.id}
                          type="button"
                          onClick={() => handleSelectIngredient(ing)}
                          className={`w-full p-2.5 text-left flex items-center justify-between transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-zinc-100 dark:bg-zinc-800"
                              : inRecipe
                              ? "bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                              : "hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <div className="flex items-center space-x-1.5">
                              <span className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                                {ing.name}
                              </span>
                              {inRecipe && (
                                <span className="text-[9px] px-1 py-0.2 rounded font-medium bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900 shrink-0">
                                  Sudah di Resep
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center space-x-1.5 mt-0.5">
                              <span>{ing.category}</span>
                              <span>•</span>
                              <span>Yield {ing.yieldPercent}%</span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-mono text-zinc-800 dark:text-zinc-200 font-medium text-xs block tabular-nums">
                              {formatIDR(ing.purchasePrice)}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-mono">
                              /{ing.purchaseQty} {ing.purchaseUnit}
                            </span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Takaran Input (Side-by-side with Satuan on Mobile) */}
            <div className="col-span-6 sm:col-span-3">
              <label className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 block mb-1">
                Takaran Porsi
              </label>
              <Input
                type="number"
                inputMode="decimal"
                placeholder="100"
                value={usageQty}
                onChange={(e) => setUsageQty(e.target.value)}
                className="h-8 text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 font-mono text-right tabular-nums"
                min="0.01"
                step="any"
              />
            </div>

            {/* Satuan Select (Side-by-side with Takaran on Mobile) */}
            <div className="col-span-6 sm:col-span-2">
              <label className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 block mb-1">
                Satuan
              </label>
              <Select value={usageUnit} onValueChange={setUsageUnit}>
                <SelectTrigger className="h-8 text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
                  {Object.entries(SUPPORTED_UNITS).map(([code, def]) => (
                    <SelectItem key={code} value={code} className="text-xs">
                      {def.code} ({def.label})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tambah Button */}
            <div className="col-span-12 sm:col-span-2">
              <Button
                type="button"
                size="sm"
                onClick={handleAddIngredient}
                disabled={!selectedIngredientId || isDuplicateInRecipe}
                className={`w-full h-8 text-xs transition-colors ${
                  isDuplicateInRecipe
                    ? "opacity-50 cursor-not-allowed bg-zinc-300 dark:bg-zinc-800 text-zinc-500"
                    : ""
                }`}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Tambah
              </Button>
            </div>

            {/* DUPLICATE WARNING IN RECIPE with Butter-Smooth Grid Accordion */}
            <div
              className={`col-span-12 grid transition-all duration-300 ease-out ${
                isDuplicateInRecipe && selectedIngredient
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0 pointer-events-none"
              }`}
            >
              <div className="overflow-hidden">
                {isDuplicateInRecipe && selectedIngredient && (
                  <div className="flex items-center space-x-2 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 animate-smooth-reveal">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                    <span>
                      Bahan <strong>&ldquo;{selectedIngredient.name}&rdquo;</strong> sudah ada di dalam resep ini.
                      Data ganda tidak diperbolehkan. Silakan sesuaikan takaran porsi langsung pada baris tabel di bawah.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* AUTOFILL HELPER BANNER with Butter-Smooth Grid Accordion */}
            <div
              className={`col-span-12 grid transition-all duration-300 ease-out ${
                selectedIngredient && !isDuplicateInRecipe
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0 pointer-events-none"
              }`}
            >
              <div className="overflow-hidden">
                {selectedIngredient && !isDuplicateInRecipe && (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-100/70 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 animate-smooth-reveal">
                    <div className="flex items-center space-x-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>
                        Autofill aktif: <strong>{selectedIngredient.name}</strong> ({formatIDR(selectedIngredient.purchasePrice)}/{selectedIngredient.purchaseQty} {selectedIngredient.purchaseUnit}, Yield {selectedIngredient.yieldPercent}%)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">
                      Satuan porsi disesuaikan ke {usageUnit}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Scroll Indicator Helper */}
        <div className="sm:hidden flex items-center justify-between text-[11px] text-zinc-400 px-0.5">
          <span>Rincian Komponen Resep</span>
          <span className="flex items-center text-[10px] text-zinc-500 font-mono">
            Geser tabel <ArrowRight className="h-2.5 w-2.5 ml-0.5" />
          </span>
        </div>

        {/* Minimalist, Professional Recipe Table */}
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 shadow-xs touch-pan-x -mx-1 sm:mx-0">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-zinc-50 dark:bg-zinc-900/80 text-zinc-500 dark:text-zinc-400 uppercase text-[11px] font-semibold tracking-wider border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="py-2.5 sm:py-3 pl-3 sm:pl-4 pr-3 min-w-40 sm:min-w-44">Bahan Baku</th>
                <th className="py-2.5 sm:py-3 px-2.5 sm:px-3.5 min-w-28 sm:min-w-30">Harga Beli</th>
                <th className="py-2.5 sm:py-3 px-2 sm:px-3 text-center min-w-20 sm:min-w-22">Yield</th>
                <th className="py-2.5 sm:py-3 px-2.5 sm:px-3.5 text-center min-w-28 sm:min-w-32">Takaran / Porsi</th>
                <th className="py-2.5 sm:py-3 px-2.5 sm:px-3.5 text-right min-w-24 sm:min-w-26">Subtotal HPP</th>
                <th className="py-2.5 sm:py-3 px-2.5 sm:px-3.5 text-right min-w-20 sm:min-w-24">Porsi %</th>
                <th className="py-2.5 sm:py-3 pr-3 sm:pr-4 pl-1 sm:pl-2 text-center w-10 sm:w-12">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-sans">
              {menu.recipeItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 sm:py-12 text-center text-zinc-500 px-4">
                    <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Belum ada bahan baku di resep ini.</p>
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">
                      Gunakan form di atas untuk menambahkan bahan dan takaran per porsi.
                    </p>
                  </td>
                </tr>
              ) : (
                menu.recipeItems.map((item) => {
                  const ing = ingredientMap.get(item.ingredientId);
                  if (!ing) return null;

                  const { cost, error } = calculateItemCost(
                    ing,
                    item.usageQty,
                    item.usageUnit
                  );
                  const costShare =
                    costing.rawFoodCost > 0
                      ? (cost / costing.rawFoodCost) * 100
                      : 0;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      {/* 1. Component Name */}
                      <td className="py-2.5 sm:py-3 pl-3 sm:pl-4 pr-3 align-middle">
                        <div className="font-medium text-xs text-zinc-900 dark:text-zinc-100 leading-snug">
                          {ing.name}
                        </div>
                        <div className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-none mt-0.5">
                          {ing.category}
                        </div>
                      </td>

                      {/* 2. Purchase Price */}
                      <td className="py-2.5 sm:py-3 px-2.5 sm:px-3.5 align-middle whitespace-nowrap">
                        <div className="font-mono text-xs text-zinc-800 dark:text-zinc-200 tabular-nums">
                          {formatIDR(ing.purchasePrice)}
                        </div>
                        <div className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-none mt-0.5 font-mono">
                          per {ing.purchaseQty} {ing.purchaseUnit}
                        </div>
                      </td>

                      {/* 3. Yield / Shrinkage */}
                      <td className="py-2.5 sm:py-3 px-2 sm:px-3 align-middle text-center whitespace-nowrap">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-mono tabular-nums bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                          {ing.yieldPercent}%
                        </span>
                        {ing.yieldPercent < 100 && (
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono block mt-0.5">
                            (-{100 - ing.yieldPercent}%)
                          </span>
                        )}
                      </td>

                      {/* 4. Recipe Usage Input */}
                      <td className="py-2.5 sm:py-3 px-2.5 sm:px-3.5 align-middle text-center whitespace-nowrap">
                        <div className="inline-flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-1.5 sm:px-2 py-0.5 shadow-2xs focus-within:ring-1 focus-within:ring-zinc-900 dark:focus-within:ring-zinc-400">
                          <input
                            type="number"
                            inputMode="decimal"
                            value={item.usageQty}
                            onChange={(e) =>
                              handleUpdateItemQty(
                                item.id,
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-14 sm:w-16 text-right text-xs font-mono tabular-nums bg-transparent text-zinc-900 dark:text-zinc-100 outline-none pr-1"
                            min="0.01"
                            step="any"
                          />
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono select-none">
                            {item.usageUnit}
                          </span>
                        </div>
                      </td>

                      {/* 5. Calculated Cost */}
                      <td className="py-2.5 sm:py-3 px-2.5 sm:px-3.5 text-right align-middle whitespace-nowrap font-mono font-medium text-xs text-zinc-900 dark:text-zinc-100 tabular-nums">
                        {error ? (
                          <span className="text-rose-600 dark:text-rose-400 text-[10px]">{error}</span>
                        ) : (
                          formatIDR(cost)
                        )}
                      </td>

                      {/* 6. Contribution % */}
                      <td className="py-2.5 sm:py-3 px-2.5 sm:px-3.5 text-right align-middle whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5 sm:space-x-2">
                          <span className="font-mono text-xs text-zinc-600 dark:text-zinc-400 tabular-nums">
                            {costShare.toFixed(1)}%
                          </span>
                          <div className="w-8 sm:w-10 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden shrink-0 hidden sm:block">
                            <div
                              className="h-full bg-zinc-800 dark:bg-zinc-200 rounded-full"
                              style={{ width: `${Math.min(100, costShare)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* 7. Action Button */}
                      <td className="py-2.5 sm:py-3 pr-3 sm:pr-4 pl-1 sm:pl-2 text-center align-middle">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="h-6 w-6 rounded flex items-center justify-center text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors mx-auto cursor-pointer"
                          title="Hapus bahan dari resep"
                          aria-label="Hapus bahan"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {menu.recipeItems.length > 0 && (
              <tfoot className="bg-zinc-50/90 dark:bg-zinc-900/90 border-t border-zinc-200 dark:border-zinc-800">
                <tr>
                  <td colSpan={4} className="py-2.5 sm:py-3 pl-3 sm:pl-4 pr-3 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Total Biaya Bahan Baku (Raw Food Cost)
                  </td>
                  <td className="py-2.5 sm:py-3 px-2.5 sm:px-3.5 text-right font-mono font-bold text-xs text-zinc-950 dark:text-zinc-50 tabular-nums">
                    {formatIDR(costing.rawFoodCost)}
                  </td>
                  <td className="py-2.5 sm:py-3 px-2.5 sm:px-3.5 text-right font-mono text-xs text-zinc-500 tabular-nums">
                    100.0%
                  </td>
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Costing Waterfall Cards (Offline vs Online) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 pt-1">
          {/* Offline / Dine-in Cost Allocation */}
          <div className="bg-zinc-50/80 dark:bg-zinc-950/60 border border-zinc-200/90 dark:border-zinc-800/90 rounded-xl p-3.5 sm:p-4.5 flex flex-col justify-between space-y-3.5">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/70 pb-2.5 mb-3">
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Alokasi HPP Dine-In (Offline)
                </span>
                <Badge variant="secondary" className="text-[10px]">
                  Makan di Tempat
                </Badge>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Total Bahan Baku:</span>
                  <span className="font-mono text-zinc-900 dark:text-zinc-100 font-medium tabular-nums">
                    {formatIDR(costing.rawFoodCost)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                  <span className="flex items-center space-x-1.5">
                    <Flame className="h-3.5 w-3.5 text-amber-500" />
                    <span>Buffer Gas, Listrik & Bumbu:</span>
                  </span>
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      inputMode="decimal"
                      value={menu.overheadPercent}
                      onChange={(e) =>
                        onUpdateMenuParameters({
                          overheadPercent: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-12 h-6 text-center text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded text-zinc-900 dark:text-zinc-200 font-mono tabular-nums"
                      min="0"
                      max="50"
                    />
                    <span className="text-zinc-400 text-xs">% =</span>
                    <span className="font-mono text-zinc-900 dark:text-zinc-100 font-medium ml-1 tabular-nums">
                      {formatIDR(costing.overheadBufferCost)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Kemasan Dine-In / Piring:</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-zinc-400 text-xs">Rp</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={menu.packagingOfflineCost}
                      onChange={(e) =>
                        onUpdateMenuParameters({
                          packagingOfflineCost: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-20 h-6 text-right text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded text-zinc-900 dark:text-zinc-200 font-mono tabular-nums px-1.5"
                      min="0"
                      step="100"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3 flex justify-between items-center text-xs font-semibold">
              <span className="text-zinc-700 dark:text-zinc-300">TOTAL HPP DINE-IN:</span>
              <span className="font-mono text-zinc-950 dark:text-zinc-50 text-base font-bold tabular-nums">
                {formatIDR(costing.cogsDineIn)}
              </span>
            </div>
          </div>

          {/* Online / Delivery Cost Allocation */}
          <div className="bg-zinc-50/80 dark:bg-zinc-950/60 border border-zinc-200/90 dark:border-zinc-800/90 rounded-xl p-3.5 sm:p-4.5 flex flex-col justify-between space-y-3.5">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/70 pb-2.5 mb-3">
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center space-x-1.5">
                  <Package className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Alokasi HPP Online Delivery</span>
                </span>
                <Badge variant="outline" className="text-[10px]">
                  Ojol Delivery
                </Badge>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Bahan + Buffer Gas:</span>
                  <span className="font-mono text-zinc-900 dark:text-zinc-100 font-medium tabular-nums">
                    {formatIDR(costing.rawFoodCost + costing.overheadBufferCost)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                  <span className="flex items-center space-x-1.5">
                    <Package className="h-3.5 w-3.5 text-zinc-500" />
                    <span>Kemasan Khusus Ojol:</span>
                  </span>
                  <div className="flex items-center space-x-1">
                    <span className="text-zinc-400 text-xs">Rp</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={menu.packagingOnlineCost}
                      onChange={(e) =>
                        onUpdateMenuParameters({
                          packagingOnlineCost: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-20 h-6 text-right text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded text-zinc-900 dark:text-zinc-200 font-mono tabular-nums px-1.5"
                      min="0"
                      step="100"
                    />
                  </div>
                </div>

                <div className="flex justify-between text-zinc-500 text-xs">
                  <span>Selisih Biaya Kemasan:</span>
                  <span className="font-mono text-zinc-700 dark:text-zinc-300 font-medium tabular-nums">
                    +{formatIDR(Math.max(0, menu.packagingOnlineCost - menu.packagingOfflineCost))}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3 flex justify-between items-center text-xs font-semibold">
              <span className="text-zinc-700 dark:text-zinc-300">TOTAL HPP ONLINE:</span>
              <span className="font-mono text-zinc-950 dark:text-zinc-50 text-base font-bold tabular-nums">
                {formatIDR(costing.cogsOnline)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
