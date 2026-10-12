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
} from "lucide-react";

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
    <Card className="border-slate-800 bg-slate-900/70 shadow-xl overflow-hidden">
      {/* Header with Platform Tabs */}
      <CardHeader className="pb-3 border-b border-slate-800 bg-slate-950/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Smartphone className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-white flex items-center space-x-2">
                <span>Reverse Pricing GoFood & GrabFood</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Anti-Rugi Engine
                </span>
              </CardTitle>
              <p className="text-[11px] text-slate-400">
                Hitung harga tayang aplikasi agar laba bersih tetap terjaga setelah potongan komisi & promo
              </p>
            </div>
          </div>

          {/* Quick Status Tag */}
          <div>
            {pricingResult.statusLabel === "OPTIMAL" ? (
              <Badge variant="success" className="text-xs py-1 px-2.5">
                <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                Laba Aman & Optimal
              </Badge>
            ) : pricingResult.statusLabel === "TIGHT" ? (
              <Badge variant="warning" className="text-xs py-1 px-2.5">
                <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                Margin Ketat ({pricingResult.netProfitMargin.toFixed(1)}%)
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-xs py-1 px-2.5">
                <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                Berisiko Rugi!
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
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border cursor-pointer ${
                  isSelected
                    ? "bg-slate-800 text-white border-slate-700 shadow-sm"
                    : "bg-slate-950/50 text-slate-400 border-slate-900 hover:border-slate-800 hover:text-slate-300"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: platform.badgeColor }}
                />
                <span>{platform.name}</span>
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-4">
        {/* Platform Setting & Promo Configuration Row */}
        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
            <span className="font-semibold text-slate-200">
              Parameter Skema: {activePlatform.programName}
            </span>
            <span className="text-[11px] text-slate-400">
              Dapat disesuaikan sesuai syarat kontrak resto Anda
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">
                Komisi Platform (%)
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
                  className="h-8 text-xs bg-slate-900 border-slate-700 font-mono pr-6"
                  min="0"
                  max="50"
                  step="0.5"
                />
                <span className="absolute right-2 top-2 text-[11px] text-slate-500 font-mono">
                  %
                </span>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">
                Beban Promo Merchant (%)
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
                  className="h-8 text-xs bg-slate-900 border-slate-700 font-mono pr-6"
                  min="0"
                  max="70"
                  step="1"
                />
                <span className="absolute right-2 top-2 text-[11px] text-slate-500 font-mono">
                  %
                </span>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">
                Subsidi Diskon Platform (%)
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
                  className="h-8 text-xs bg-slate-900 border-slate-700 font-mono pr-6"
                  min="0"
                  max="50"
                  step="1"
                />
                <span className="absolute right-2 top-2 text-[11px] text-slate-500 font-mono">
                  %
                </span>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">
                Biaya Transaksi / Sistem (Rp)
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
                  className="h-8 text-xs bg-slate-900 border-slate-700 font-mono"
                  min="0"
                  step="500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* PRIMARY HIGHLIGHT: The Calculated Safe Listing Price */}
        <div className="bg-linear-to-br from-slate-900 to-slate-950 p-5 rounded-xl border border-sky-500/40 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                  Rekomendasi Harga Tayang di Aplikasi
                </span>
                <span className="text-[10px] bg-sky-500/10 text-sky-300 border border-sky-500/20 px-1.5 py-0.2 rounded">
                  {activePlatform.name}
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white mt-1 tracking-tight">
                {formatIDR(pricingResult.recommendedListingPrice)}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Masukkan harga ini di dashboard GoBiz / GrabMerchant agar target profit Anda tercapai.
              </p>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 text-xs space-y-1.5 min-w-55">
              <div className="flex justify-between text-slate-400">
                <span>Target Diterima (Offline + Pkg):</span>
                <span className="font-mono text-slate-200">
                  {formatIDR(pricingResult.targetNetPayout)}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Potongan (%):</span>
                <span className="font-mono text-rose-400">
                  -{(activePlatform.commissionPercent + activePlatform.promoMerchantSharePercent)}%
                </span>
              </div>
              <div className="border-t border-slate-800 pt-1.5 flex justify-between font-semibold">
                <span className="text-emerald-400">Uang Masuk Rekening:</span>
                <span className="font-mono text-emerald-400">
                  {formatIDR(pricingResult.netPayoutToMerchant)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FINANCIAL WATERFALL BREAKDOWN (Transparency Table) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200">
              Waterfall Arus Kas & Rincian Potongan
            </span>
            <span className="text-[11px] text-slate-500">
              Simulasi per 1 porsi menu terjual
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-xs text-left">
              <tbody className="divide-y divide-slate-800/70 font-sans">
                {/* 1. Gross Listing Price */}
                <tr className="bg-slate-900/40">
                  <td className="py-2.5 px-4 font-semibold text-white">
                    1. Harga Tayang / Harga Coret Aplikasi
                  </td>
                  <td className="py-2.5 px-4 text-slate-400 text-[11px]">
                    Harga menu sebelum diskon pelanggan
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-white">
                    {formatIDR(pricingResult.recommendedListingPrice)}
                  </td>
                </tr>

                {/* 2. Customer Promo */}
                {pricingResult.totalDiscountPercent > 0 && (
                  <tr>
                    <td className="py-2.5 px-4 text-slate-300">
                      Diskon Dilihat Konsumen ({pricingResult.totalDiscountPercent}%)
                    </td>
                    <td className="py-2.5 px-4 text-slate-400 text-[11px]">
                      Konsumen bayar:{" "}
                      <span className="text-slate-200 font-mono font-medium">
                        {formatIDR(pricingResult.customerPays)}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-400">
                      -{formatIDR(pricingResult.recommendedListingPrice - pricingResult.customerPays)}
                    </td>
                  </tr>
                )}

                {/* 3. Merchant Promo Share */}
                {activePlatform.promoMerchantSharePercent > 0 && (
                  <tr>
                    <td className="py-2.5 px-4 text-slate-300 flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      <span>Beban Diskon Ditanggung Merchant ({activePlatform.promoMerchantSharePercent}%)</span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-400 text-[11px]">
                      Potongan langsung dari pendapatan restoran
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-rose-400 font-medium">
                      -{formatIDR(pricingResult.merchantPromoDeduction)}
                    </td>
                  </tr>
                )}

                {/* 4. Platform Commission */}
                <tr>
                  <td className="py-2.5 px-4 text-slate-300 flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Komisi {activePlatform.name} ({activePlatform.commissionPercent}%)</span>
                  </td>
                  <td className="py-2.5 px-4 text-slate-400 text-[11px]">
                    Bagi hasil platform aplikasi
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono text-amber-400 font-medium">
                    -{formatIDR(pricingResult.platformCommissionFee)}
                  </td>
                </tr>

                {/* 5. System fee */}
                {activePlatform.fixedFee > 0 && (
                  <tr>
                    <td className="py-2.5 px-4 text-slate-300">
                      Biaya Pemeliharaan Layanan Platform
                    </td>
                    <td className="py-2.5 px-4 text-slate-400 text-[11px]">
                      Biaya transaksi flat per pesanan
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-400">
                      -{formatIDR(pricingResult.fixedFee)}
                    </td>
                  </tr>
                )}

                {/* 6. Net Payout */}
                <tr className="bg-emerald-500/10 border-t border-emerald-500/20">
                  <td className="py-3 px-4 font-bold text-emerald-400">
                    2. UANG BERSIH DITERIMA RESTO (NET PAYOUT)
                  </td>
                  <td className="py-3 px-4 text-emerald-300 text-[11px]">
                    Dana bersih yang ditransfer ojol ke rekening bank Anda
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400 text-sm">
                    {formatIDR(pricingResult.netPayoutToMerchant)}
                  </td>
                </tr>

                {/* 7. COGS Online Deduction */}
                <tr>
                  <td className="py-2.5 px-4 text-slate-300">
                    HPP Menu Online (Bahan Baku + Kemasan Ojol)
                  </td>
                  <td className="py-2.5 px-4 text-slate-400 text-[11px]">
                    Bahan: {formatIDR(costing.rawFoodCost + costing.overheadBufferCost)} | Kemasan: {formatIDR(costing.cogsOnline - costing.rawFoodCost - costing.overheadBufferCost)}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono text-slate-400">
                    -{formatIDR(pricingResult.cogsOnline)}
                  </td>
                </tr>

                {/* 8. NET PROFIT */}
                <tr className="bg-slate-900 border-t border-slate-700">
                  <td className="py-3 px-4 font-bold text-white text-sm">
                    3. LABA BERSIH RIIL (NET PROFIT)
                  </td>
                  <td className="py-3 px-4 text-slate-300 text-[11px]">
                    Net Margin:{" "}
                    <span className="font-mono font-bold text-sky-400">
                      {pricingResult.netProfitMargin.toFixed(1)}%
                    </span>{" "}
                    (vs Offline: {costing.dineInGrossMargin.toFixed(1)}%)
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-extrabold text-sky-400 text-base">
                    +{formatIDR(pricingResult.netProfit)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Why this formula works (Educational & Trust Banner) */}
        <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/90 text-xs text-slate-400 space-y-1.5">
          <div className="flex items-center space-x-1.5 text-slate-200 font-semibold text-[11px]">
            <Info className="h-3.5 w-3.5 text-sky-400" />
            <span>Kenapa Restoran Sering Rugi di Ojol Kalau Pakai Markup Biasa?</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Jika harga offline Rp 30.000 dan dinaikkan 20% menjadi Rp 36.000, saat dipotong komisi 20% oleh Gojek/Grab, resto hanya menerima <b>Rp 28.800</b> (rugi Rp 1.200 di bawah harga offline!). Rumus kami menggunakan <b>Reverse Net Pricing</b>:
          </p>
          <div className="font-mono bg-slate-900 p-2 rounded text-[11px] text-sky-300 text-center">
            Harga Tayang = (Target Payout + Biaya Tetap) / (1 - (Komisi% + Beban Promo%))
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
