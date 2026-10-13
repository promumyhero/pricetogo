import React, { useState } from "react";
import { formatIDR } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";
import {
  Sparkles,
  Calculator,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export function PromoSimulatorSandbox() {
  // Freeform sandbox inputs
  const [targetHpp, setTargetHpp] = useState<number>(14500);
  const [onlinePackaging, setOnlinePackaging] = useState<number>(2000);
  const [targetNetCash, setTargetNetCash] = useState<number>(30000);
  const [commissionPercent, setCommissionPercent] = useState<number>(20);
  const [merchantPromoPercent, setMerchantPromoPercent] = useState<number>(15);
  const [platformPromoPercent, setPlatformPromoPercent] = useState<number>(10);
  const [fixedFee, setFixedFee] = useState<number>(1000);

  // Total HPP Online
  const totalCogsOnline = targetHpp + onlinePackaging;

  // The Reverse Formula:
  // ListingPrice = (TargetNetCash + fixedFee) / (1 - (Commission% + MerchantPromo%))
  const totalDeductionRate = (commissionPercent + merchantPromoPercent) / 100;
  const rawListingPrice =
    totalDeductionRate < 0.95
      ? (targetNetCash + fixedFee) / (1 - totalDeductionRate)
      : (targetNetCash + fixedFee) / 0.05;

  const recommendedListingPrice = Math.ceil(rawListingPrice / 1000) * 1000;

  // Waterfall
  const totalPromoPercent = merchantPromoPercent + platformPromoPercent;
  const merchantPromoCut = recommendedListingPrice * (merchantPromoPercent / 100);
  const platformCommissionCut = recommendedListingPrice * (commissionPercent / 100);
  const netPayout = recommendedListingPrice - merchantPromoCut - platformCommissionCut - fixedFee;
  const netProfit = netPayout - totalCogsOnline;
  const netProfitMargin = netPayout > 0 ? (netProfit / netPayout) * 100 : 0;

  // The Naive Markup Comparison
  const naivePrice = Math.ceil((targetNetCash * 1.2) / 1000) * 1000;
  const naiveMerchantPromoCut = naivePrice * (merchantPromoPercent / 100);
  const naiveCommissionCut = naivePrice * (commissionPercent / 100);
  const naiveNetPayout = naivePrice - naiveMerchantPromoCut - naiveCommissionCut - fixedFee;
  const naiveLoss = naiveNetPayout - targetNetCash;

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200/90 dark:border-zinc-800/80 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-none">
        <div className="flex items-center space-x-2 text-zinc-600 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>Interactive Sandbox Simulator</span>
        </div>
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Simulasi Bebas & Komparasi Anti-Boncos Ojol
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-3xl leading-relaxed">
          Uji skenario promo GoFood (Maksimal Pro) atau GrabFood (Mega Diskon). Masukkan target uang yang ingin Anda terima bersih di rekening, dan sistem akan menghitung harga tayang yang menjamin target Anda tidak tergerus.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Parameters */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-none">
            <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <CardTitle className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
                <Calculator className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                <span>Target Finansial Restoran</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              <div>
                <label className="text-xs text-zinc-700 dark:text-zinc-300 font-medium block mb-1">
                  Target Uang Bersih Masuk Rekening (Net Payout)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-zinc-400">
                    Rp
                  </span>
                  <Input
                    type="number"
                    value={targetNetCash}
                    onChange={(e) => setTargetNetCash(parseFloat(e.target.value) || 0)}
                    className="h-9 pl-9 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-700 font-mono font-bold text-zinc-950 dark:text-zinc-50 text-base"
                    step="1000"
                  />
                </div>
                <span className="text-[10px] text-zinc-400 mt-1 block">
                  Uang yang wajib ditransfer ojol ke rekening Anda per pesanan.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-500 dark:text-zinc-400 block mb-1">
                    HPP Bahan Baku (Rp)
                  </label>
                  <Input
                    type="number"
                    value={targetHpp}
                    onChange={(e) => setTargetHpp(parseFloat(e.target.value) || 0)}
                    className="h-8 text-xs bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-700 font-mono"
                    step="500"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-500 dark:text-zinc-400 block mb-1">
                    Kemasan Online (Rp)
                  </label>
                  <Input
                    type="number"
                    value={onlinePackaging}
                    onChange={(e) =>
                      setOnlinePackaging(parseFloat(e.target.value) || 0)
                    }
                    className="h-8 text-xs bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-700 font-mono"
                    step="100"
                  />
                </div>
              </div>

              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3 space-y-3">
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block">
                  Skema Platform & Potongan Promo:
                </span>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Komisi Platform:</span>
                    <span className="font-mono text-zinc-900 dark:text-zinc-100 font-semibold">
                      {commissionPercent}%
                    </span>
                  </div>
                  <Slider
                    value={[commissionPercent]}
                    min={10}
                    max={30}
                    step={1}
                    onValueChange={([val]) => setCommissionPercent(val)}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">
                      Beban Promo Merchant:
                    </span>
                    <span className="font-mono text-rose-600 dark:text-rose-400 font-semibold">
                      {merchantPromoPercent}%
                    </span>
                  </div>
                  <Slider
                    value={[merchantPromoPercent]}
                    min={0}
                    max={40}
                    step={1}
                    onValueChange={([val]) => setMerchantPromoPercent(val)}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">
                      Subsidi Diskon Platform:
                    </span>
                    <span className="font-mono text-zinc-900 dark:text-zinc-100 font-semibold">
                      {platformPromoPercent}%
                    </span>
                  </div>
                  <Slider
                    value={[platformPromoPercent]}
                    min={0}
                    max={25}
                    step={1}
                    onValueChange={([val]) => setPlatformPromoPercent(val)}
                  />
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-zinc-500">Biaya Layanan Flat:</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-zinc-400 text-[11px]">Rp</span>
                    <Input
                      type="number"
                      value={fixedFee}
                      onChange={(e) => setFixedFee(parseFloat(e.target.value) || 0)}
                      className="w-20 h-7 text-xs bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-700 font-mono text-right"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Comparison & Results */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-none">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Hasil Kalkulasi Reverse Pricing
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-zinc-950 dark:text-zinc-50 mt-1">
                    {formatIDR(recommendedListingPrice)}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Pasang harga ini di aplikasi agar Anda tetap menerima {formatIDR(targetNetCash)}.
                  </p>
                </div>

                <div className="text-right">
                  <Badge variant="success">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Target Terjamin
                  </Badge>
                  <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-2">
                    Laba Bersih: +{formatIDR(netProfit)}
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    Net Margin: {netProfitMargin.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Side-by-side comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* 1. Smart Reverse Pricing */}
                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-emerald-200 dark:border-emerald-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Formula Reverse (Aman)</span>
                    </span>
                  </div>
                  <div className="text-xs space-y-1 font-mono">
                    <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                      <span>Harga Tayang:</span>
                      <span className="text-zinc-900 dark:text-zinc-100 font-bold">{formatIDR(recommendedListingPrice)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                      <span>Diskon Pelanggan:</span>
                      <span>-{totalPromoPercent}%</span>
                    </div>
                    <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                      <span>Beban Promo Resto:</span>
                      <span className="text-rose-600 dark:text-rose-400">-{formatIDR(merchantPromoCut)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                      <span>Komisi Ojol (20%):</span>
                      <span className="text-amber-600 dark:text-amber-400">-{formatIDR(platformCommissionCut)}</span>
                    </div>
                    <div className="border-t border-zinc-200 dark:border-zinc-800 pt-1 flex justify-between font-bold text-emerald-700 dark:text-emerald-400">
                      <span>Uang Masuk Rekening:</span>
                      <span>{formatIDR(netPayout)}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Naive Markup Trap */}
                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-rose-200 dark:border-rose-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center space-x-1">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>Markup Biasa (+20%)</span>
                    </span>
                  </div>
                  <div className="text-xs space-y-1 font-mono">
                    <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                      <span>Harga Tayang:</span>
                      <span>{formatIDR(naivePrice)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                      <span>Beban Promo Resto:</span>
                      <span className="text-rose-600 dark:text-rose-400">-{formatIDR(naiveMerchantPromoCut)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                      <span>Komisi Ojol (20%):</span>
                      <span className="text-amber-600 dark:text-amber-400">-{formatIDR(naiveCommissionCut)}</span>
                    </div>
                    <div className="border-t border-zinc-200 dark:border-zinc-800 pt-1 flex justify-between font-bold text-rose-700 dark:text-rose-400">
                      <span>Uang Masuk Rekening:</span>
                      <span>{formatIDR(naiveNetPayout)}</span>
                    </div>
                    <div className="text-[10px] text-rose-600 dark:text-rose-400 font-sans pt-0.5">
                      {naiveLoss < 0 ? (
                        <span>Tekor {formatIDR(Math.abs(naiveLoss))} di bawah target!</span>
                      ) : (
                        <span>Margin sangat tipis.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
