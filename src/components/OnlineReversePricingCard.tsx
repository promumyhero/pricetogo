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
import { Smartphone, Info, ShieldCheck, AlertTriangle } from "lucide-react";

interface OnlineReversePricingCardProps {
  costing: MenuCostingBreakdown;
}

export function OnlineReversePricingCard({
  costing,
}: OnlineReversePricingCardProps) {
  const [selectedPlatformId, setSelectedPlatformId] = useState<string>("gofood_maksimal_pro");
  const [customConfigs, setCustomConfigs] = useState<Record<string, PlatformConfig>>(() => {
    const initial: Record<string, PlatformConfig> = {};
    DEFAULT_PLATFORMS.forEach((p) => {
      initial[p.id] = { ...p };
    });
    return initial;
  });

  const activePlatform = customConfigs[selectedPlatformId] || DEFAULT_PLATFORMS[0];
  const pricingResult: OnlinePricingResult = calculateOnlinePricing(
    costing,
    activePlatform
  );

  const handleUpdateActivePlatform = (partial: Partial<PlatformConfig>) => {
    setCustomConfigs((prev) => ({
      ...prev,
      [selectedPlatformId]: {
        ...prev[selectedPlatformId],
        ...partial,
      },
    }));
  };

  return (
    <Card className="border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-none overflow-hidden">
      {/* Header with Platform Selector */}
      <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
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
              <Badge variant="success">
                <ShieldCheck className="h-3 w-3 mr-1" />
                Laba Aman
              </Badge>
            ) : pricingResult.statusLabel === "TIGHT" ? (
              <Badge variant="warning">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Margin Ketat ({pricingResult.netProfitMargin.toFixed(1)}%)
              </Badge>
            ) : (
              <Badge variant="destructive">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Risiko Tekor!
              </Badge>
            )}
          </div>
        </div>

        {/* Platform Selector Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pt-2 scrollbar-none">
          {DEFAULT_PLATFORMS.map((platform) => {
            const isSelected = platform.id === selectedPlatformId;
            return (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatformId(platform.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border cursor-pointer ${
                  isSelected
                    ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 shadow-2xs"
                    : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: platform.badgeColor }}
                />
                <span>{platform.name}</span>
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* Platform Parameters Configuration */}
        <div className="bg-zinc-50 dark:bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
            <span className="font-medium text-zinc-800 dark:text-zinc-200 text-[11px]">
              Skema: {activePlatform.programName}
            </span>
            <span className="text-[10px] text-zinc-400">
              Sesuaikan dengan kontrak merchant Anda
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <label className="text-[10px] text-zinc-500 dark:text-zinc-400 block mb-1">
                Komisi Ojol (%)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  value={activePlatform.commissionPercent}
                  onChange={(e) =>
                    handleUpdateActivePlatform({
                      commissionPercent: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="h-8 text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 font-mono pr-6"
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
              <label className="text-[10px] text-zinc-500 dark:text-zinc-400 block mb-1">
                Diskon Resto (%)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  value={activePlatform.promoMerchantSharePercent}
                  onChange={(e) =>
                    handleUpdateActivePlatform({
                      promoMerchantSharePercent: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="h-8 text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 font-mono pr-6"
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
              <label className="text-[10px] text-zinc-500 dark:text-zinc-400 block mb-1">
                Diskon Ojol (%)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  value={activePlatform.promoPlatformSharePercent}
                  onChange={(e) =>
                    handleUpdateActivePlatform({
                      promoPlatformSharePercent: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="h-8 text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 font-mono pr-6"
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
              <label className="text-[10px] text-zinc-500 dark:text-zinc-400 block mb-1">
                Biaya Transaksi (Rp)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  value={activePlatform.fixedFee}
                  onChange={(e) =>
                    handleUpdateActivePlatform({
                      fixedFee: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="h-8 text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 font-mono"
                  min="0"
                  step="500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* PRIMARY HERO: Clean Minimal Price Display with Light/Dark Harmonization */}
        <div className="bg-zinc-50 dark:bg-zinc-950 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-semibold tracking-wide uppercase text-zinc-500 dark:text-zinc-400">
                Rekomendasi Harga Tayang di Aplikasi
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                {activePlatform.name}
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-zinc-950 dark:text-zinc-50 mt-1">
              {formatIDR(pricingResult.recommendedListingPrice)}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Pasang harga ini di dashboard resto agar margin target tidak terpotong.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900/90 p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs space-y-1.5 min-w-55 shrink-0 shadow-2xs">
            <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
              <span>Target Offline + Kemasan:</span>
              <span className="font-mono text-zinc-800 dark:text-zinc-200 font-medium">
                {formatIDR(pricingResult.targetNetPayout)}
              </span>
            </div>
            <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
              <span>Total Potongan (%):</span>
              <span className="font-mono text-rose-600 dark:text-rose-400 font-medium">
                -{(activePlatform.commissionPercent + activePlatform.promoMerchantSharePercent)}%
              </span>
            </div>
            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-1.5 flex justify-between font-semibold">
              <span className="text-emerald-700 dark:text-emerald-400">Masuk Rekening:</span>
              <span className="font-mono text-emerald-700 dark:text-emerald-400">
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
              Per 1 porsi menu terjual
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 shadow-xs">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-zinc-50 dark:bg-zinc-900/80 text-zinc-500 dark:text-zinc-400 uppercase text-[11px] font-semibold tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="py-2.5 px-3.5">Komponen Arus Kas</th>
                  <th className="py-2.5 px-3.5 hidden sm:table-cell">Keterangan</th>
                  <th className="py-2.5 px-3.5 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-sans">
                {/* 1. Gross Listing Price */}
                <tr className="bg-zinc-50/60 dark:bg-zinc-900/40">
                  <td className="py-2.5 px-3.5 font-medium text-zinc-900 dark:text-zinc-100">
                    Harga Tayang Aplikasi
                  </td>
                  <td className="py-2.5 px-3.5 text-zinc-500 text-[11px] hidden sm:table-cell">
                    Harga katalog sebelum promo diskon
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap tabular-nums">
                    {formatIDR(pricingResult.recommendedListingPrice)}
                  </td>
                </tr>

                {/* 2. Customer Promo */}
                {pricingResult.totalDiscountPercent > 0 && (
                  <tr>
                    <td className="py-2.5 px-3.5 text-zinc-700 dark:text-zinc-300">
                      Diskon Konsumen ({pricingResult.totalDiscountPercent}%)
                    </td>
                    <td className="py-2.5 px-3.5 text-zinc-500 text-[11px] hidden sm:table-cell">
                      Pelanggan bayar: <span className="font-mono font-medium text-zinc-800 dark:text-zinc-200 tabular-nums">{formatIDR(pricingResult.customerPays)}</span>
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono text-zinc-500 whitespace-nowrap tabular-nums">
                      -{formatIDR(pricingResult.recommendedListingPrice - pricingResult.customerPays)}
                    </td>
                  </tr>
                )}

                {/* 3. Merchant Promo Share */}
                {activePlatform.promoMerchantSharePercent > 0 && (
                  <tr>
                    <td className="py-2.5 px-3.5 text-zinc-700 dark:text-zinc-300 flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span>Beban Subsidi Restoran ({activePlatform.promoMerchantSharePercent}%)</span>
                    </td>
                    <td className="py-2.5 px-3.5 text-zinc-500 text-[11px] hidden sm:table-cell">
                      Porsi diskon dibebankan ke merchant
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono text-rose-600 dark:text-rose-400 font-medium whitespace-nowrap tabular-nums">
                      -{formatIDR(pricingResult.merchantPromoDeduction)}
                    </td>
                  </tr>
                )}

                {/* 4. Platform Commission */}
                <tr>
                  <td className="py-2.5 px-3.5 text-zinc-700 dark:text-zinc-300 flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>Komisi {activePlatform.name} ({activePlatform.commissionPercent}%)</span>
                  </td>
                  <td className="py-2.5 px-3.5 text-zinc-500 text-[11px] hidden sm:table-cell">
                    Bagi hasil platform aplikasi
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono text-amber-600 dark:text-amber-400 font-medium whitespace-nowrap tabular-nums">
                    -{formatIDR(pricingResult.platformCommissionFee)}
                  </td>
                </tr>

                {/* 5. System fee */}
                {activePlatform.fixedFee > 0 && (
                  <tr>
                    <td className="py-2.5 px-3.5 text-zinc-700 dark:text-zinc-300">
                      Biaya Layanan Sistem
                    </td>
                    <td className="py-2.5 px-3.5 text-zinc-500 text-[11px] hidden sm:table-cell">
                      Biaya transaksi pesanan selesai
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono text-zinc-500 whitespace-nowrap tabular-nums">
                      -{formatIDR(pricingResult.fixedFee)}
                    </td>
                  </tr>
                )}

                {/* 6. Net Payout */}
                <tr className="bg-emerald-50/80 dark:bg-emerald-950/30 border-t border-b border-emerald-200/80 dark:border-emerald-800/50">
                  <td className="py-3 px-3.5 font-bold text-emerald-800 dark:text-emerald-300">
                    Uang Masuk Rekening (Net Payout)
                  </td>
                  <td className="py-3 px-3.5 text-emerald-700/90 dark:text-emerald-300/80 text-[11px] hidden sm:table-cell">
                    Ditransfer platform ke rekening bank Anda
                  </td>
                  <td className="py-3 px-3.5 text-right font-mono font-bold text-emerald-700 dark:text-emerald-300 text-sm whitespace-nowrap tabular-nums">
                    {formatIDR(pricingResult.netPayoutToMerchant)}
                  </td>
                </tr>

                {/* 7. COGS Online Deduction */}
                <tr>
                  <td className="py-2.5 px-3.5 text-zinc-700 dark:text-zinc-300">
                    HPP Menu Online (Bahan + Kemasan Ojol)
                  </td>
                  <td className="py-2.5 px-3.5 text-zinc-500 text-[11px] hidden sm:table-cell">
                    Modal riil per porsi
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono text-zinc-500 whitespace-nowrap tabular-nums">
                    -{formatIDR(pricingResult.cogsOnline)}
                  </td>
                </tr>

                {/* 8. NET PROFIT */}
                <tr className="bg-zinc-50 dark:bg-zinc-800/40 border-t border-zinc-200 dark:border-zinc-700">
                  <td className="py-3 px-3.5 font-bold text-zinc-950 dark:text-zinc-50">
                    Laba Bersih Riil (Net Profit)
                  </td>
                  <td className="py-3 px-3.5 text-zinc-600 dark:text-zinc-400 text-[11px] hidden sm:table-cell">
                    Net Margin:{" "}
                    <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                      {pricingResult.netProfitMargin.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-right font-mono font-bold text-zinc-900 dark:text-zinc-100 text-sm whitespace-nowrap tabular-nums">
                    +{formatIDR(pricingResult.netProfit)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Minimal Educational Note */}
        <div className="bg-zinc-50 dark:bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
          <div className="flex items-center space-x-1.5 text-zinc-800 dark:text-zinc-200 font-medium text-[11px]">
            <Info className="h-3.5 w-3.5 text-zinc-500" />
            <span>Formula Reverse Pricing Anti-Boncos</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Menghindari jebakan markup biasa dengan membagi target uang bersih terhadap sisa persentase komisi dan promo:
          </p>
          <div className="font-mono bg-white dark:bg-zinc-900 p-2 rounded text-[11px] text-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 text-center">
            Harga Tayang = (Target Payout + Biaya Layanan) / (1 - (Komisi% + Beban Promo%))
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
