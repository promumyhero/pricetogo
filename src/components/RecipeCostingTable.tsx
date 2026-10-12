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
    <Card className="border-slate-800 bg-slate-900/50">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-sm font-semibold text-white flex items-center space-x-2">
            <span>Bill of Materials (Komposisi Resep)</span>
            <Badge variant="outline" className="text-[10px] font-normal border-slate-700 text-slate-300">
              {menu.recipeItems.length} Komponen
            </Badge>
          </CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">
            Perhitungan biaya bahan baku per porsi dengan konversi metrik & susut (yield)
          </p>
        </div>
        {onOpenIngredientsModal && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenIngredientsModal}
            className="h-8 text-xs border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300"
          >
            Kelola Bahan Baku
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {/* Quick Add Row */}
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 space-y-2">
          <div className="text-[11px] font-medium text-slate-400">
            Tambah Bahan ke Resep Ini
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
            <div className="sm:col-span-5">
              <Select
                value={selectedIngredientId}
                onValueChange={(val) => {
                  setSelectedIngredientId(val);
                  const ing = ingredientMap.get(val);
                  if (ing) {
                    // Default sensible usage unit matching purchase category
                    if (ing.purchaseUnit === "KG") setUsageUnit("GRAM");
                    else if (ing.purchaseUnit === "LITER") setUsageUnit("ML");
                    else setUsageUnit(ing.purchaseUnit);
                  }
                }}
              >
                <SelectTrigger className="h-8 text-xs bg-slate-900 border-slate-700">
                  <SelectValue placeholder="Pilih bahan baku dari master data..." />
                </SelectTrigger>
                <SelectContent className="max-h-60 bg-slate-900 border-slate-700">
                  {ingredients.map((ing) => (
                    <SelectItem key={ing.id} value={ing.id} className="text-xs">
                      {ing.name} ({formatIDR(ing.purchasePrice)} / {ing.purchaseQty} {ing.purchaseUnit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-3">
              <Input
                type="number"
                placeholder="Jumlah pakai"
                value={usageQty}
                onChange={(e) => setUsageQty(e.target.value)}
                className="h-8 text-xs bg-slate-900 border-slate-700 font-mono"
                min="0.01"
                step="any"
              />
            </div>

            <div className="sm:col-span-2">
              <Select value={usageUnit} onValueChange={setUsageUnit}>
                <SelectTrigger className="h-8 text-xs bg-slate-900 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
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
                className="w-full h-8 text-xs bg-sky-500 hover:bg-sky-400 text-slate-950 font-medium"
              >
                <Plus className="h-3 w-3 mr-1" />
                Tambah
              </Button>
            </div>
          </div>
        </div>

        {/* Recipe Items Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-800/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Bahan Baku</th>
                <th className="py-2.5 px-3">Harga Beli Master</th>
                <th className="py-2.5 px-3">Yield (Susut)</th>
                <th className="py-2.5 px-3">Takaran Resep</th>
                <th className="py-2.5 px-3 text-right">Biaya per Porsi</th>
                <th className="py-2.5 px-3 text-right">Porsi Biaya</th>
                <th className="py-2.5 px-2 text-center w-10">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {menu.recipeItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    <p className="text-xs">Belum ada bahan baku di resep ini.</p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Pilih bahan dari dropdown di atas untuk mulai menghitung HPP.
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
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-2.5 px-3">
                        <div className="font-medium text-slate-200">{ing.name}</div>
                        <div className="text-[10px] text-slate-400">{ing.category}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 font-mono text-[11px]">
                        {formatIDR(ing.purchasePrice)} / {ing.purchaseQty} {ing.purchaseUnit}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                            ing.yieldPercent < 100
                              ? "bg-amber-500/15 text-amber-300"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {ing.yieldPercent}% {ing.yieldPercent < 100 ? `(susut ${100 - ing.yieldPercent}%)` : ""}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center space-x-1.5">
                          <Input
                            type="number"
                            value={item.usageQty}
                            onChange={(e) =>
                              handleUpdateItemQty(
                                item.id,
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="h-7 w-20 text-xs bg-slate-950 border-slate-700 font-mono px-2 py-0"
                            min="0.01"
                            step="any"
                          />
                          <span className="text-slate-400 text-xs font-mono">
                            {item.usageUnit}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-100">
                        {error ? (
                          <span className="text-rose-400 text-[10px]">{error}</span>
                        ) : (
                          formatIDR(cost)
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <span className="font-mono text-slate-400 text-[11px]">
                            {costShare.toFixed(1)}%
                          </span>
                          <div className="w-10 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-sky-500"
                              style={{ width: `${Math.min(100, costShare)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                          title="Hapus bahan dari resep"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Costing Waterfall Breakdown (Bahan + Overhead + Packaging) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {/* Offline / Dine-in Cost Allocation */}
          <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800/70 pb-2">
              <span className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
                <span>Alokasi HPP Dine-In (Offline)</span>
              </span>
              <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-400">
                Makan di Tempat / Takeaway Biasa
              </Badge>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Total Bahan Baku (Raw Food):</span>
                <span className="font-mono text-slate-200">
                  {formatIDR(costing.rawFoodCost)}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center space-x-1">
                  <Flame className="h-3 w-3 text-amber-400" />
                  <span>Buffer Overhead (Gas/Bumbu):</span>
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
                    className="w-12 h-6 text-center text-[11px] bg-slate-900 border border-slate-700 rounded text-slate-200 font-mono"
                    min="0"
                    max="50"
                  />
                  <span className="text-slate-400 text-[11px]">% =</span>
                  <span className="font-mono text-slate-200 ml-1">
                    {formatIDR(costing.overheadBufferCost)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span>Packaging Dine-In:</span>
                <div className="flex items-center space-x-1">
                  <span className="text-slate-500 text-[11px]">Rp</span>
                  <input
                    type="number"
                    value={menu.packagingOfflineCost}
                    onChange={(e) =>
                      onUpdateMenuParameters({
                        packagingOfflineCost: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-20 h-6 text-right text-[11px] bg-slate-900 border border-slate-700 rounded text-slate-200 font-mono px-1.5"
                    min="0"
                    step="100"
                  />
                </div>
              </div>

              <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-sm font-semibold">
                <span className="text-white">TOTAL HPP DINE-IN:</span>
                <span className="font-mono text-sky-400 text-base">
                  {formatIDR(costing.cogsDineIn)}
                </span>
              </div>
            </div>
          </div>

          {/* Online / Delivery Cost Allocation */}
          <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800/70 pb-2">
              <span className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
                <Package className="h-3.5 w-3.5 text-emerald-400" />
                <span>Alokasi HPP Online (GoFood / GrabFood)</span>
              </span>
              <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">
                Pesanan Delivery
              </Badge>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Bahan Baku + Overhead:</span>
                <span className="font-mono text-slate-200">
                  {formatIDR(costing.rawFoodCost + costing.overheadBufferCost)}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center space-x-1">
                  <Package className="h-3 w-3 text-sky-400" />
                  <span>Packaging Khusus Ojol:</span>
                </span>
                <div className="flex items-center space-x-1">
                  <span className="text-slate-500 text-[11px]">Rp</span>
                  <input
                    type="number"
                    value={menu.packagingOnlineCost}
                    onChange={(e) =>
                      onUpdateMenuParameters({
                        packagingOnlineCost: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-20 h-6 text-right text-[11px] bg-slate-900 border border-slate-700 rounded text-slate-200 font-mono px-1.5"
                    min="0"
                    step="100"
                  />
                </div>
              </div>

              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Selisih Beban Kemasan Online:</span>
                <span className="font-mono text-amber-400">
                  +{formatIDR(Math.max(0, menu.packagingOnlineCost - menu.packagingOfflineCost))}
                </span>
              </div>

              <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-sm font-semibold">
                <span className="text-white">TOTAL HPP ONLINE:</span>
                <span className="font-mono text-emerald-400 text-base">
                  {formatIDR(costing.cogsOnline)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
