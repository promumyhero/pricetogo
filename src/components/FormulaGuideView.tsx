import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { BookOpen } from "lucide-react";

export function FormulaGuideView() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200/90 dark:border-zinc-800/80 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-none">
        <div className="flex items-center space-x-2 text-zinc-600 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <BookOpen className="h-4 w-4" />
          <span>Standar Industri F&B & Ojek Online</span>
        </div>
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Panduan Lengkap Food Costing & Strategi Pricing Ojol
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
          Pelajari bagaimana restoran profesional menghitung HPP, mengelola penyusutan bahan baku, serta mencegah kerugian saat mengikuti program promo diskon di GoFood & GrabFood.
        </p>
      </div>

      {/* 1. Anatomi HPP F&B */}
      <Card className="border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-none">
        <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <CardTitle className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <span className="w-5 h-5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs flex items-center justify-center font-bold">1</span>
            <span>Anatomi HPP (Harga Pokok Penjualan) Menu Restoran</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-4 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
          <p>
            Banyak pengusaha F&B pemula hanya menghitung bahan utama (misal: ayam dan beras), namun melupakan biaya bumbu dasar, minyak goreng, gas elpiji, dan kemasan. HPP ideal per porsi terdiri dari:
          </p>
          <div className="bg-zinc-50 dark:bg-zinc-950 p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 font-mono text-zinc-900 dark:text-zinc-200 space-y-1 text-[11px]">
            <div>Total HPP Offline = Bahan Baku + Buffer Overhead (5-8%) + Kemasan Dine-In</div>
            <div>Total HPP Online = Bahan Baku + Buffer Overhead (5-8%) + Kemasan Delivery (Bowl + Tutup + Seal + Sendok + Kantong)</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-zinc-50/70 dark:bg-zinc-950/60 p-3.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800/80">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 block mb-1">Penyusutan / Yield Factor (%)</span>
              <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                Saat Anda membeli 1 kg kentang atau cabai rawit, setelah dikupas atau dibuang tangkainya, berat bersih yang bisa dimasak biasanya hanya 850 gram (yield = 85%). Jika tidak memperhitungkan yield, HPP Anda akan di bawah kenyataan (undercosting).
              </p>
            </div>
            <div className="bg-zinc-50/70 dark:bg-zinc-950/60 p-3.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800/80">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 block mb-1">Buffer Overhead Gas & Minyak (5-10%)</span>
              <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                Menimbang setiap tetes minyak goreng atau gas per porsi sangat sulit. Standar industri resto menggunakan alokasi buffer persentase (5% s/d 10% dari total bahan baku) untuk menutup garam, bumbu penyedap, dan gas tabung.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Potongan GoFood & GrabFood */}
      <Card className="border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-none">
        <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <CardTitle className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <span className="w-5 h-5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs flex items-center justify-center font-bold">2</span>
            <span>Struktur Potongan & Program Promo Ojol di Indonesia</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-4 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-zinc-50/70 dark:bg-zinc-950/60 p-3.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00AA13]" />
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">GoFood (GoBiz)</span>
              </div>
              <ul className="text-[11px] text-zinc-500 dark:text-zinc-400 space-y-1 list-disc list-inside">
                <li><b>Komisi Reguler</b>: 20% dari nilai transaksi menu.</li>
                <li><b>Biaya Pemeliharaan</b>: Sekitar Rp 1.000 per transaksi pesanan selesai.</li>
                <li><b>GoFood Maksimal Pro</b>: Program visibilitas tinggi di mana resto memberikan diskon menu (contoh diskon 25%), dengan subsidi patungan (merchant menanggung 15%, Gojek mensubsidi 10%).</li>
              </ul>
            </div>

            <div className="bg-zinc-50/70 dark:bg-zinc-950/60 p-3.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00B14F]" />
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">GrabFood (GrabMerchant)</span>
              </div>
              <ul className="text-[11px] text-zinc-500 dark:text-zinc-400 space-y-1 list-disc list-inside">
                <li><b>Komisi Standar</b>: 20% (atau skema net PPN tergantung tier kontrak).</li>
                <li><b>Grab Mega Diskon / Kilat</b>: Diskon besar (25% s/d 35%) di mana resto menanggung subsidi utama, ditukar dengan eksposur di carousel utama aplikasi Grab.</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Mathematical Derivation of Reverse Pricing */}
      <Card className="border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-none">
        <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <CardTitle className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <span className="w-5 h-5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs flex items-center justify-center font-bold">3</span>
            <span>Matematika Reverse Pricing: Mengapa Wajib Digunakan?</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-4 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
          <p>
            Kesalahan paling mematikan bagi resto di ojol adalah formula <b>&quot;Markup Biasa&quot;</b>:
          </p>
          <div className="bg-rose-50 dark:bg-rose-950/30 p-3 rounded-lg border border-rose-200/80 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 text-[11px]">
            ❌ <b>Salah Kaprah</b>: Ingin untung dari harga offline Rp 30.000, dinaikkan 20% menjadi Rp 36.000. Saat orderan masuk Rp 36.000, Gojek memotong 20% (-Rp 7.200), resto hanya terima <b>Rp 28.800</b>. Jika resto juga ikut promo diskon 20%, resto rugi parah dan nombok!
          </div>

          <p>
            Rumus yang benar adalah <b>Target Net Realization</b>:
          </p>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3.5 rounded-lg border border-emerald-200/80 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 font-mono text-[11px] space-y-1">
            <div>Target Payout = Harga Offline + Selisih Kemasan Online</div>
            <div>Harga Tayang Aplikasi = (Target Payout + Biaya Layanan) / (1 - (Komisi% + Beban Promo Merchant%))</div>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">
            Dengan membagi target terhadap sisa persentase bersih, berapapun diskon promo dan komisi yang dipotong oleh aplikasi, uang bersih yang ditransfer ke rekening bank Anda selalu menutup HPP dan target laba Anda secara presisi!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
