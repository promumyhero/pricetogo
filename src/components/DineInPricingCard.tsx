import React from "react";
import { MenuItemInput, MenuCostingBreakdown } from "@/lib/calculator";
import { formatIDR } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";
import { Store } from "lucide-react";

interface DineInPricingCardProps {
  menu: MenuItemInput;
  costing: MenuCostingBreakdown;
  onUpdateMenuParameters: (params: Partial<MenuItemInput>) => void;
}

export function DineInPricingCard({
  menu,
  costing,
  onUpdateMenuParameters,
}: DineInPricingCardProps) {
  const isHealthyFoodCost = costing.dineInFoodCostPercent <= 35;
  const isModerateFoodCost =
    costing.dineInFoodCostPercent > 35 && costing.dineInFoodCostPercent <= 42;

  return (
    <Card className="border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-none">
      <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              <Store className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Harga Jual Offline (Dine-In)
              </CardTitle>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Target margin standar warung & restoran
              </p>
            </div>
          </div>

          <Badge
            variant={
              isHealthyFoodCost
                ? "success"
                : isModerateFoodCost
                ? "warning"
                : "destructive"
            }
          >
            {isHealthyFoodCost
              ? "Food Cost Sehat (≤35%)"
              : isModerateFoodCost
              ? "Food Cost Sedang (36-42%)"
              : "Food Cost Tinggi (>42%)"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* Target Margin Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-700 dark:text-zinc-300 font-medium">
              Target Gross Margin:
            </span>
            <div className="flex items-center space-x-1.5 font-mono">
              <span className="text-zinc-950 dark:text-zinc-50 font-bold text-sm">
                {menu.targetMarginDineIn}%
              </span>
              <span className="text-zinc-400 dark:text-zinc-500 text-[11px]">
                (Food Cost: {(100 - menu.targetMarginDineIn).toFixed(0)}%)
              </span>
            </div>
          </div>

          <Slider
            value={[menu.targetMarginDineIn]}
            min={30}
            max={85}
            step={1}
            onValueChange={([val]) =>
              onUpdateMenuParameters({ targetMarginDineIn: val })
            }
          />
          <div className="flex justify-between text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
            <span>30% (Warung)</span>
            <span>60-65% (Resto)</span>
            <span>80%+ (Minuman)</span>
          </div>
        </div>

        {/* Price Output Comparison Box */}
        <div className="grid grid-cols-2 gap-3 bg-zinc-50 dark:bg-zinc-950/70 p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
          <div>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block mb-0.5">
              Rekomendasi Harga:
            </span>
            <div className="text-xl font-bold font-mono text-zinc-950 dark:text-zinc-50 tracking-tight">
              {formatIDR(costing.suggestedDineInPrice)}
            </div>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block mt-0.5">
              Kelipatan Rp 500
            </span>
          </div>

          <div>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block mb-0.5">
              Harga Pasang Manual:
            </span>
            <div className="flex items-center space-x-1">
              <span className="text-xs text-zinc-400">Rp</span>
              <Input
                type="number"
                placeholder={costing.suggestedDineInPrice.toString()}
                value={menu.manualOfflinePrice || ""}
                onChange={(e) => {
                  const val = e.target.value ? parseFloat(e.target.value) : undefined;
                  onUpdateMenuParameters({ manualOfflinePrice: val });
                }}
                className="h-8 text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 font-mono"
                step="500"
              />
            </div>
            {menu.manualOfflinePrice && (
              <button
                type="button"
                onClick={() => onUpdateMenuParameters({ manualOfflinePrice: undefined })}
                className="text-[10px] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 underline mt-1 cursor-pointer"
              >
                Pakai rekomendasi
              </button>
            )}
          </div>
        </div>

        {/* Realization Metrics Strip */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800 text-center">
          <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950/50">
            <span className="text-[10px] text-zinc-400 block">Harga Pasang</span>
            <span className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-200">
              {formatIDR(costing.finalDineInPrice)}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950/50">
            <span className="text-[10px] text-zinc-400 block">Laba Kotor</span>
            <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              +{formatIDR(costing.dineInGrossProfit)}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950/50">
            <span className="text-[10px] text-zinc-400 block">Gross Margin</span>
            <span className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              {costing.dineInGrossMargin.toFixed(1)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
