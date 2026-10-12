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
    <Card className="border-slate-800 bg-slate-900/60 shadow-lg">
      <CardHeader className="pb-3 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Store className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-white">
                Harga Jual Offline (Dine-In / Kasir)
              </CardTitle>
              <p className="text-[11px] text-slate-400">
                Target margin standar restoran & warung makan
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
            className="text-[10px]"
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
            <span className="text-slate-300 font-medium">
              Target Gross Margin Offline:
            </span>
            <div className="flex items-center space-x-1 font-mono">
              <span className="text-sky-400 font-bold text-sm">
                {menu.targetMarginDineIn}%
              </span>
              <span className="text-slate-500 text-[11px]">
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
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>30% (Warung Rendah)</span>
            <span>60-65% (Standar Resto)</span>
            <span>80%+ (Beverage/Kopi)</span>
          </div>
        </div>

        {/* Price Output Comparison Box */}
        <div className="grid grid-cols-2 gap-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
          <div>
            <span className="text-[11px] text-slate-400 block mb-0.5">
              Rekomendasi Harga Jual:
            </span>
            <div className="text-lg font-bold font-mono text-white tracking-tight">
              {formatIDR(costing.suggestedDineInPrice)}
            </div>
            <span className="text-[10px] text-slate-500">
              Dibulatkan kelipatan Rp 500
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block mb-0.5">
              Harga Pasang Manual (Opsional):
            </span>
            <div className="flex items-center space-x-1">
              <span className="text-xs text-slate-500">Rp</span>
              <Input
                type="number"
                placeholder={costing.suggestedDineInPrice.toString()}
                value={menu.manualOfflinePrice || ""}
                onChange={(e) => {
                  const val = e.target.value ? parseFloat(e.target.value) : undefined;
                  onUpdateMenuParameters({ manualOfflinePrice: val });
                }}
                className="h-8 text-xs bg-slate-900 border-slate-700 font-mono"
                step="500"
              />
            </div>
            {menu.manualOfflinePrice && (
              <button
                type="button"
                onClick={() => onUpdateMenuParameters({ manualOfflinePrice: undefined })}
                className="text-[10px] text-sky-400 hover:underline mt-1"
              >
                Gunakan rekomendasi sistem
              </button>
            )}
          </div>
        </div>

        {/* Realization Metrics Strip */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800/80 text-center">
          <div className="p-2 rounded-lg bg-slate-950/50">
            <span className="text-[10px] text-slate-400 block">Harga Terpilih</span>
            <span className="font-mono text-xs font-semibold text-slate-200">
              {formatIDR(costing.finalDineInPrice)}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/50">
            <span className="text-[10px] text-slate-400 block">Laba Kotor (Rp)</span>
            <span className="font-mono text-xs font-semibold text-emerald-400">
              +{formatIDR(costing.dineInGrossProfit)}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/50">
            <span className="text-[10px] text-slate-400 block">Gross Margin Riil</span>
            <span className="font-mono text-xs font-semibold text-sky-400">
              {costing.dineInGrossMargin.toFixed(1)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
