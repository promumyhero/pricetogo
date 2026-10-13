import React, { useState } from "react";
import {
  IngredientInput,
  MenuItemInput,
  RecipeItemInput,
  SUPPORTED_UNITS,
  calculateItemCost,
  MenuCostingBreakdown,
} from "@/lib/calculator";
import { formatIDR } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Plus, Trash2, Package, Flame } from "lucide-react";

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
  // New item draft state
  const [selectedIngredientId, setSelectedIngredientId] = useState<string>("");
  const [usageQty, setUsageQty] = useState<string>("100");
  const [usageUnit, setUsageUnit] = useState<string>("GRAM");

  const ingredientMap = new Map<string, IngredientInput>(
    ingredients.map((i) => [i.id, i])
  );

  const handleAddIngredient = () => {
    if (!selectedIngredientId) return;
    const ing = ingredientMap.get(selectedIngredientId);
    if (!ing) return;

    const newItem: RecipeItemInput = {
      id: "ri-" + Date.now(),
      ingredientId: selectedIngredientId,
      usageQty: parseFloat(usageQty) || 1,
      usageUnit: usageUnit || ing.purchaseUnit,
    };

    onUpdateRecipeItems([...menu.recipeItems, newItem]);
    setSelectedIngredientId("");
    setUsageQty("100");
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
      <CardHeader className="flex flex-row items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800/70">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Komposisi Resep & Bahan Baku (BOM)
            </CardTitle>
            <Badge variant="outline" className="font-mono text-[10px] px-1.5 py-0 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
              {menu.recipeItems.length} Bahan
            </Badge>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Kalkulasi akurat biaya bahan per porsi dengan konversi metrik dan faktor susut
          </p>
        </div>
        {onOpenIngredientsModal && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenIngredientsModal}
            className="h-8 text-xs text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Master Bahan
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        {/* Quick Add Form Bar */}
        <div className="bg-zinc-50/90 dark:bg-zinc-950/70 p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80">
          <div className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2.5">
            Tambah Komponen Bahan
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
            <div className="sm:col-span-5">
              <label className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 block mb-1">
                Pilih Bahan Baku
              </label>
              <Select
                value={selectedIngredientId}
                onValueChange={(val) => {
                  setSelectedIngredientId(val);
                  const ing = ingredientMap.get(val);
                  if (ing) {
                    if (ing.purchaseUnit === "KG") setUsageUnit("GRAM");
                    else if (ing.purchaseUnit === "LITER") setUsageUnit("ML");
                    else setUsageUnit(ing.purchaseUnit);
                  }
                }}
              >
                <SelectTrigger className="h-8 text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
                  <SelectValue placeholder="Pilih dari master bahan..." />
                </SelectTrigger>
                <SelectContent className="max-h-60 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
                  {ingredients.map((ing) => (
                    <SelectItem key={ing.id} value={ing.id} className="text-xs">
                      {ing.name} ({formatIDR(ing.purchasePrice)} / {ing.purchaseQty} {ing.purchaseUnit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-3">
              <label className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 block mb-1">
                Takaran Porsi
              </label>
              <Input
                type="number"
                placeholder="100"
                value={usageQty}
                onChange={(e) => setUsageQty(e.target.value)}
                className="h-8 text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 font-mono text-right tabular-nums"
                min="0.01"
                step="any"
              />
            </div>

            <div className="sm:col-span-2">
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

            <div className="sm:col-span-2">
              <Button
                type="button"
                size="sm"
                onClick={handleAddIngredient}
                disabled={!selectedIngredientId}
                className="w-full h-8 text-xs"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Tambah
              </Button>
            </div>
          </div>
        </div>

        {/* Minimalist, Professional Recipe Table */}
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-zinc-50 dark:bg-zinc-900/80 text-zinc-500 dark:text-zinc-400 uppercase text-[11px] font-semibold tracking-wider border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="py-3 pl-4 pr-3 min-w-44">Bahan Baku</th>
                <th className="py-3 px-3.5 min-w-30">Harga Beli</th>
                <th className="py-3 px-3 text-center min-w-22">Yield</th>
                <th className="py-3 px-3.5 text-center min-w-32">Takaran / Porsi</th>
                <th className="py-3 px-3.5 text-right min-w-26">Subtotal HPP</th>
                <th className="py-3 px-3.5 text-right min-w-24">Porsi %</th>
                <th className="py-3 pr-4 pl-2 text-center w-12">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-sans">
              {menu.recipeItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
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
                      <td className="py-3 pl-4 pr-3 align-middle">
                        <div className="font-medium text-xs text-zinc-900 dark:text-zinc-100 leading-snug">
                          {ing.name}
                        </div>
                        <div className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-none mt-0.5">
                          {ing.category}
                        </div>
                      </td>

                      {/* 2. Purchase Price */}
                      <td className="py-3 px-3.5 align-middle whitespace-nowrap">
                        <div className="font-mono text-xs text-zinc-800 dark:text-zinc-200 tabular-nums">
                          {formatIDR(ing.purchasePrice)}
                        </div>
                        <div className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-none mt-0.5 font-mono">
                          per {ing.purchaseQty} {ing.purchaseUnit}
                        </div>
                      </td>

                      {/* 3. Yield / Shrinkage */}
                      <td className="py-3 px-3 align-middle text-center whitespace-nowrap">
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
                      <td className="py-3 px-3.5 align-middle text-center whitespace-nowrap">
                        <div className="inline-flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-0.5 shadow-2xs focus-within:ring-1 focus-within:ring-zinc-900 dark:focus-within:ring-zinc-400">
                          <input
                            type="number"
                            value={item.usageQty}
                            onChange={(e) =>
                              handleUpdateItemQty(
                                item.id,
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-16 text-right text-xs font-mono tabular-nums bg-transparent text-zinc-900 dark:text-zinc-100 outline-none pr-1.5"
                            min="0.01"
                            step="any"
                          />
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono select-none">
                            {item.usageUnit}
                          </span>
                        </div>
                      </td>

                      {/* 5. Calculated Cost */}
                      <td className="py-3 px-3.5 text-right align-middle whitespace-nowrap font-mono font-medium text-xs text-zinc-900 dark:text-zinc-100 tabular-nums">
                        {error ? (
                          <span className="text-rose-600 dark:text-rose-400 text-[10px]">{error}</span>
                        ) : (
                          formatIDR(cost)
                        )}
                      </td>

                      {/* 6. Contribution % */}
                      <td className="py-3 px-3.5 text-right align-middle whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-2">
                          <span className="font-mono text-xs text-zinc-600 dark:text-zinc-400 tabular-nums">
                            {costShare.toFixed(1)}%
                          </span>
                          <div className="w-10 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden shrink-0">
                            <div
                              className="h-full bg-zinc-800 dark:bg-zinc-200 rounded-full"
                              style={{ width: `${Math.min(100, costShare)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* 7. Action Button */}
                      <td className="py-3 pr-4 pl-2 text-center align-middle">
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
                  <td colSpan={4} className="py-3 pl-4 pr-3 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Total Biaya Bahan Baku (Raw Food Cost)
                  </td>
                  <td className="py-3 px-3.5 text-right font-mono font-bold text-xs text-zinc-950 dark:text-zinc-50 tabular-nums">
                    {formatIDR(costing.rawFoodCost)}
                  </td>
                  <td className="py-3 px-3.5 text-right font-mono text-xs text-zinc-500 tabular-nums">
                    100.0%
                  </td>
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Costing Waterfall Cards (Offline vs Online) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Offline / Dine-in Cost Allocation */}
          <div className="bg-zinc-50/80 dark:bg-zinc-950/60 border border-zinc-200/90 dark:border-zinc-800/90 rounded-xl p-4.5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/70 pb-2.5 mb-3">
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Alokasi HPP Dine-In (Offline)
                </span>
                <Badge variant="secondary" className="text-[10px]">
                  Makan di Tempat / Takeaway
                </Badge>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Total Bahan Baku (Raw Food):</span>
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
                  <span>Kemasan Makan di Tempat / Alas:</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-zinc-400 text-xs">Rp</span>
                    <input
                      type="number"
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
          <div className="bg-zinc-50/80 dark:bg-zinc-950/60 border border-zinc-200/90 dark:border-zinc-800/90 rounded-xl p-4.5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/70 pb-2.5 mb-3">
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center space-x-1.5">
                  <Package className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Alokasi HPP Online Delivery</span>
                </span>
                <Badge variant="outline" className="text-[10px]">
                  GoFood / GrabFood
                </Badge>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Bahan + Gas & Overhead:</span>
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
