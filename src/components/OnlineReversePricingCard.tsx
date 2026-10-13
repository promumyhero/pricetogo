import React, { useState } from "react";
import {
  MenuCostingBreakdown,
  PlatformConfig,
  DEFAULT_PLATFORMS,
  calculateOnlinePricing,
  OnlinePricingResult,
} from "@/lib/calculator";
import { formatIDR } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  Smartphone,
  Info,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Store,
  RotateCcw,
} from "lucide-react";

interface OnlineReversePricingCardProps {
  costing: MenuCostingBreakdown;
}

type ProviderKey = "gofood" | "grabfood" | "shopeefood";
type SchemeKey = "reguler" | "promo";

const PROVIDERS: {
  id: ProviderKey;
  name: string;
  badgeColor: string;
  regulerId: string;
  promoId: string;
  promoLabel: string;
}[] = [
  {
    id: "gofood",
    name: "GoFood",
    badgeColor: "#00AA13",
    regulerId: "gofood_reguler",
    promoId: "gofood_maksimal_pro",
    promoLabel: "Maksimal Pro",
  },
  {
    id: "grabfood",
    name: "GrabFood",
    badgeColor: "#00B14F",
    regulerId: "grabfood_reguler",
    promoId: "grabfood_mega_diskon",
    promoLabel: "Mega Diskon",
  },
  {
    id: "shopeefood",
    name: "ShopeeFood",
    badgeColor: "#EE4D2D",
    regulerId: "shopeefood_reguler",
    promoId: "shopeefood_super_diskon",
    promoLabel: "Super Diskon",
  },
];

export function OnlineReversePricingCard({
  costing,
}: OnlineReversePricingCardProps) {
  // Provider: gofood | grabfood | shopeefood
  const [activeProvider, setActiveProvider] = useState<ProviderKey>("gofood");
  // Scheme: reguler | promo
  const [activeScheme, setActiveScheme] = useState<SchemeKey>("promo");

  // Config dictionary for customization
  const [customConfigs, setCustomConfigs] = useState<Record<string, PlatformConfig>>(() => {
    const initial: Record<string, PlatformConfig> = {};
    DEFAULT_PLATFORMS.forEach((p) => {
      initial[p.id] = { ...p };
    });
    return initial;
  });

  const currentProviderInfo = PROVIDERS.find((p) => p.id === activeProvider) || PROVIDERS[0];
  const activePlatformId =
    activeScheme === "promo" ? currentProviderInfo.promoId : currentProviderInfo.regulerId;

  const activePlatform =
    customConfigs[activePlatformId] ||
    DEFAULT_PLATFORMS.find((p) => p.id === activePlatformId) ||
    DEFAULT_PLATFORMS[0];

  const defaultPlatformTemplate =
    DEFAULT_PLATFORMS.find((p) => p.id === activePlatformId) || DEFAULT_PLATFORMS[0];

  const isCustomized =
    activePlatform.commissionPercent !== defaultPlatformTemplate.commissionPercent ||
    activePlatform.promoMerchantSharePercent !== defaultPlatformTemplate.promoMerchantSharePercent ||
    activePlatform.promoPlatformSharePercent !== defaultPlatformTemplate.promoPlatformSharePercent ||
    activePlatform.fixedFee !== defaultPlatformTemplate.fixedFee;

  const pricingResult: OnlinePricingResult = calculateOnlinePricing(
    costing,
    activePlatform
  );

  const handleUpdateActivePlatform = (partial: Partial<PlatformConfig>) => {
    setCustomConfigs((prev) => ({
      ...prev,
      [activePlatformId]: {
        ...prev[activePlatformId],
        ...partial,
      },
    }));
  };

  const handleResetToDefault = () => {
    setCustomConfigs((prev) => ({
      ...prev,
      [activePlatformId]: { ...defaultPlatformTemplate },
    }));
  };

  return (
    <Card className="border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-xs overflow-hidden">
      {/* Header Section */}
      <CardHeader className="p-3.5 sm:p-5 pb-3 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shrink-0">
              <Smartphone className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
                <span>Reverse Pricing Delivery</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
                  Anti-Boncos
                </span>
              </CardTitle>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Hitung harga tayang aplikasi setelah potongan komisi & promo
              </p>
            </div>
          </div>

          <div>
            {pricingResult.statusLabel === "OPTIMAL" ? (
              <Badge variant="success" className="text-[10px]">
                <ShieldCheck className="h-3 w-3 mr-1" />
                Laba Aman
              </Badge>
            ) : pricingResult.statusLabel === "TIGHT" ? (
              <Badge variant="warning" className="text-[10px]">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Margin Ketat ({pricingResult.netProfitMargin.toFixed(1)}%)
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-[10px]">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Risiko Tekor!
              </Badge>
            )}
          </div>
        </div>

        {/* TIER 1: Responsive Platform Provider Tabs (GoFood, GrabFood, ShopeeFood) */}
        <div className="pt-2">
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800">
            {PROVIDERS.map((provider) => {
              const isActive = provider.id === activeProvider;
              return (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => setActiveProvider(provider.id)}
                  className={`flex items-center justify-center space-x-1.5 sm:space-x-2 py-1.5 sm:py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs border border-zinc-200/80 dark:border-zinc-700"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`}
                  aria-pressed={isActive}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                    style={{ backgroundColor: provider.badgeColor }}
                  />
                  <span className="truncate">{provider.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TIER 2: Intuitive Scheme Selector (Reguler vs Promo Campaign) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1.5">
          {/* Option A: Reguler (Non-Promo) */}
          <button
            type="button"
            onClick={() => setActiveScheme("reguler")}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              activeScheme === "reguler"
                ? "bg-white dark:bg-zinc-800/90 border-zinc-900 dark:border-zinc-100 ring-1 ring-zinc-900/10 dark:ring-zinc-100/20 shadow-xs"
                : "bg-zinc-50/70 dark:bg-zinc-950/40 border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center space-x-1.5">
                <Store className="h-3.5 w-3.5 text-zinc-500" />
                <span>Harga Reguler</span>
              </span>
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
                Komisi 20%
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">
              Penjualan katalog biasa tanpa subsidi diskon promo restoran
            </p>
          </button>

          {/* Option B: Promo Program (Maksimal Pro / Mega Diskon) */}
          <button
            type="button"
            onClick={() => setActiveScheme("promo")}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              activeScheme === "promo"
                ? "bg-white dark:bg-zinc-800/90 border-zinc-900 dark:border-zinc-100 ring-1 ring-zinc-900/10 dark:ring-zinc-100/20 shadow-xs"
                : "bg-zinc-50/70 dark:bg-zinc-950/40 border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center space-x-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>Program {currentProviderInfo.promoLabel}</span>
              </span>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/60">
                Diskon {activePlatform.promoMerchantSharePercent + activePlatform.promoPlatformSharePercent}%
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">
              Subsidi patungan: {activePlatform.promoMerchantSharePercent}% resto + {activePlatform.promoPlatformSharePercent}% platform
            </p>
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-3.5 sm:p-5 space-y-4 pt-3.5 sm:pt-4">
        {/* Platform Parameters Configuration */}
        <div className="bg-zinc-50 dark:bg-zinc-950/60 p-3 sm:p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-[11px]">
                Parameter Skema: {activePlatform.programName}
              </span>
              {isCustomized && (
                <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400">
                  Kustom
                </Badge>
              )}
            </div>

            {isCustomized && (
              <button
                type="button"
                onClick={handleResetToDefault}
                className="flex items-center space-x-1 text-[10px] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer self-start sm:self-auto"
              >
                <RotateCcw className="h-2.5 w-2.5" />
                <span>Reset ke Template</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <label className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 block mb-1">
                Komisi Ojol (%)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  inputMode="decimal"
                  value={activePlatform.commissionPercent}
                  onChange={(e) =>
                    handleUpdateActivePlatform({
                      commissionPercent: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="h-8 text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 font-mono tabular-nums pr-6"
                  min="0"
                  max="50"
                  step="0.5"
                />
                <span className="absolute right-2 top-2 text-[10px] text-zinc-400 font-mono">
                  %
                </span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 block mb-1">
                Diskon Resto (%)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  inputMode="decimal"
                  value={activePlatform.promoMerchantSharePercent}
                  onChange={(e) =>
                    handleUpdateActivePlatform({
                      promoMerchantSharePercent: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="h-8 text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 font-mono tabular-nums pr-6"
                  min="0"
                  max="70"
                  step="1"
                />
                <span className="absolute right-2 top-2 text-[10px] text-zinc-400 font-mono">
                  %
                </span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 block mb-1">
                Diskon Ojol (%)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  inputMode="decimal"
                  value={activePlatform.promoPlatformSharePercent}
                  onChange={(e) =>
                    handleUpdateActivePlatform({
                      promoPlatformSharePercent: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="h-8 text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 font-mono tabular-nums pr-6"
                  min="0"
                  max="50"
                  step="1"
                />
                <span className="absolute right-2 top-2 text-[10px] text-zinc-400 font-mono">
                  %
                </span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 block mb-1">
                Biaya Transaksi (Rp)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  inputMode="decimal"
                  value={activePlatform.fixedFee}
                  onChange={(e) =>
                    handleUpdateActivePlatform({
                      fixedFee: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="h-8 text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 font-mono tabular-nums"
                  min="0"
                  step="500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* PRIMARY HERO: Clean Minimal Price Display */}
        <div className="bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3.5 sm:gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-wide uppercase text-zinc-500 dark:text-zinc-400">
                Rekomendasi Harga Tayang Aplikasi
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                {currentProviderInfo.name} • {activeScheme === "promo" ? currentProviderInfo.promoLabel : "Reguler"}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono tracking-tight text-zinc-950 dark:text-zinc-50 mt-1 tabular-nums">
              {formatIDR(pricingResult.recommendedListingPrice)}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
              Pasang harga ini di dashboard resto agar margin target tidak terpotong.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900/90 p-3 sm:p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs space-y-1.5 w-full md:w-auto md:min-w-55 shrink-0 shadow-2xs">
            <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
              <span>Target Offline + Kemasan:</span>
              <span className="font-mono text-zinc-800 dark:text-zinc-200 font-medium tabular-nums">
                {formatIDR(pricingResult.targetNetPayout)}
              </span>
            </div>
            <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
              <span>Total Potongan (%):</span>
              <span className="font-mono text-rose-600 dark:text-rose-400 font-medium tabular-nums">
                -{(activePlatform.commissionPercent + activePlatform.promoMerchantSharePercent)}%
              </span>
            </div>
            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-1.5 flex justify-between font-semibold">
              <span className="text-emerald-700 dark:text-emerald-400">Masuk Rekening:</span>
              <span className="font-mono text-emerald-700 dark:text-emerald-400 tabular-nums">
                {formatIDR(pricingResult.netPayoutToMerchant)}
              </span>
            </div>
          </div>
        </div>

        {/* FINANCIAL WATERFALL BREAKDOWN WITH EXPLICIT TABLE HEADERS */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              Rincian Arus Kas & Bagi Hasil
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">
              Per 1 porsi menu
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 shadow-xs touch-pan-x -mx-1 sm:mx-0">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-zinc-50 dark:bg-zinc-900/80 text-zinc-500 dark:text-zinc-400 uppercase text-[10px] sm:text-[11px] font-semibold tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="py-2.5 px-3 sm:px-3.5">Komponen Arus Kas</th>
                  <th className="py-2.5 px-3 sm:px-3.5 hidden sm:table-cell">Keterangan</th>
                  <th className="py-2.5 px-3 sm:px-3.5 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-sans">
                {/* 1. Gross Listing Price */}
                <tr className="bg-zinc-50/60 dark:bg-zinc-900/40">
                  <td className="py-2.5 px-3 sm:px-3.5 font-medium text-zinc-900 dark:text-zinc-100">
                    Harga Tayang Aplikasi
                  </td>
                  <td className="py-2.5 px-3 sm:px-3.5 text-zinc-500 text-[11px] hidden sm:table-cell">
                    Harga katalog sebelum promo diskon
                  </td>
                  <td className="py-2.5 px-3 sm:px-3.5 text-right font-mono font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap tabular-nums">
                    {formatIDR(pricingResult.recommendedListingPrice)}
                  </td>
                </tr>

                {/* 2. Customer Promo */}
                {pricingResult.totalDiscountPercent > 0 && (
                  <tr>
                    <td className="py-2.5 px-3 sm:px-3.5 text-zinc-700 dark:text-zinc-300">
                      Diskon Konsumen ({pricingResult.totalDiscountPercent}%)
                    </td>
                    <td className="py-2.5 px-3 sm:px-3.5 text-zinc-500 text-[11px] hidden sm:table-cell">
                      Pelanggan bayar: <span className="font-mono font-medium text-zinc-800 dark:text-zinc-200 tabular-nums">{formatIDR(pricingResult.customerPays)}</span>
                    </td>
                    <td className="py-2.5 px-3 sm:px-3.5 text-right font-mono text-zinc-500 whitespace-nowrap tabular-nums">
                      -{formatIDR(pricingResult.recommendedListingPrice - pricingResult.customerPays)}
                    </td>
                  </tr>
                )}

                {/* 3. Merchant Promo Share */}
                {activePlatform.promoMerchantSharePercent > 0 && (
                  <tr>
                    <td className="py-2.5 px-3 sm:px-3.5 text-zinc-700 dark:text-zinc-300 flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span>Beban Subsidi Resto ({activePlatform.promoMerchantSharePercent}%)</span>
                    </td>
                    <td className="py-2.5 px-3 sm:px-3.5 text-zinc-500 text-[11px] hidden sm:table-cell">
                      Porsi diskon dibebankan ke merchant
                    </td>
                    <td className="py-2.5 px-3 sm:px-3.5 text-right font-mono text-rose-600 dark:text-rose-400 font-medium whitespace-nowrap tabular-nums">
                      -{formatIDR(pricingResult.merchantPromoDeduction)}
                    </td>
                  </tr>
                )}

                {/* 4. Platform Commission */}
                <tr>
                  <td className="py-2.5 px-3 sm:px-3.5 text-zinc-700 dark:text-zinc-300 flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>Komisi {currentProviderInfo.name} ({activePlatform.commissionPercent}%)</span>
                  </td>
                  <td className="py-2.5 px-3 sm:px-3.5 text-zinc-500 text-[11px] hidden sm:table-cell">
                    Bagi hasil platform aplikasi
                  </td>
                  <td className="py-2.5 px-3 sm:px-3.5 text-right font-mono text-amber-600 dark:text-amber-400 font-medium whitespace-nowrap tabular-nums">
                    -{formatIDR(pricingResult.platformCommissionFee)}
                  </td>
                </tr>

                {/* 5. System fee */}
                {activePlatform.fixedFee > 0 && (
                  <tr>
                    <td className="py-2.5 px-3 sm:px-3.5 text-zinc-700 dark:text-zinc-300">
                      Biaya Layanan Sistem
                    </td>
                    <td className="py-2.5 px-3 sm:px-3.5 text-zinc-500 text-[11px] hidden sm:table-cell">
                      Biaya transaksi pesanan selesai
                    </td>
                    <td className="py-2.5 px-3 sm:px-3.5 text-right font-mono text-zinc-500 whitespace-nowrap tabular-nums">
                      -{formatIDR(pricingResult.fixedFee)}
                    </td>
                  </tr>
                )}

                {/* 6. Net Payout */}
                <tr className="bg-emerald-50/80 dark:bg-emerald-950/30 border-t border-b border-emerald-200/80 dark:border-emerald-800/50">
                  <td className="py-2.5 sm:py-3 px-3 sm:px-3.5 font-bold text-emerald-800 dark:text-emerald-300">
                    Uang Masuk Rekening (Net Payout)
                  </td>
                  <td className="py-2.5 sm:py-3 px-3 sm:px-3.5 text-emerald-700/90 dark:text-emerald-300/80 text-[11px] hidden sm:table-cell">
                    Ditransfer platform ke rekening bank Anda
                  </td>
                  <td className="py-2.5 sm:py-3 px-3 sm:px-3.5 text-right font-mono font-bold text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm whitespace-nowrap tabular-nums">
                    {formatIDR(pricingResult.netPayoutToMerchant)}
                  </td>
                </tr>

                {/* 7. COGS Online Deduction */}
                <tr>
                  <td className="py-2.5 px-3 sm:px-3.5 text-zinc-700 dark:text-zinc-300">
                    HPP Menu Online (Bahan + Kemasan)
                  </td>
                  <td className="py-2.5 px-3 sm:px-3.5 text-zinc-500 text-[11px] hidden sm:table-cell">
                    Modal riil per porsi
                  </td>
                  <td className="py-2.5 px-3 sm:px-3.5 text-right font-mono text-zinc-500 whitespace-nowrap tabular-nums">
                    -{formatIDR(pricingResult.cogsOnline)}
                  </td>
                </tr>

                {/* 8. NET PROFIT */}
                <tr className="bg-zinc-50 dark:bg-zinc-800/40 border-t border-zinc-200 dark:border-zinc-700">
                  <td className="py-2.5 sm:py-3 px-3 sm:px-3.5 font-bold text-zinc-950 dark:text-zinc-50">
                    Laba Bersih Riil (Net Profit)
                  </td>
                  <td className="py-2.5 sm:py-3 px-3 sm:px-3.5 text-zinc-600 dark:text-zinc-400 text-[11px] hidden sm:table-cell">
                    Net Margin:{" "}
                    <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                      {pricingResult.netProfitMargin.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-2.5 sm:py-3 px-3 sm:px-3.5 text-right font-mono font-bold text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm whitespace-nowrap tabular-nums">
                    +{formatIDR(pricingResult.netProfit)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Minimal Educational Note */}
        <div className="bg-zinc-50 dark:bg-zinc-950/40 p-3 sm:p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
          <div className="flex items-center space-x-1.5 text-zinc-800 dark:text-zinc-200 font-medium text-[11px]">
            <Info className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
            <span>Formula Reverse Pricing Anti-Boncos</span>
          </div>
          <p className="text-[10px] sm:text-[11px] leading-relaxed">
            Membagi target uang bersih terhadap sisa persentase komisi dan promo agar margin tidak tergerus:
          </p>
          <div className="font-mono bg-white dark:bg-zinc-900 p-2 rounded text-[10px] sm:text-[11px] text-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 text-center wrap-break-word">
            Harga = (Target Payout + Biaya) / (1 - (Komisi% + Promo%))
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
