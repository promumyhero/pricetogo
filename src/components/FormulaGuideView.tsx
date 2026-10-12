import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { BookOpen } from "lucide-react";

export function FormulaGuideView() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center space-x-2 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <BookOpen className="h-4 w-4" />
          <span>Standar Industri F&B & Ojek Online</span>
        </div>
        <h2 className="text-lg font-bold text-white tracking-tight">
          Panduan Lengkap Food Costing & Strategi Pricing Ojol
        </h2>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Pelajari bagaimana restoran profesional menghitung HPP, mengelola penyusutan bahan baku, serta mencegah kerugian saat mengikuti program promo diskon di GoFood & GrabFood.
        </p>
      </div>

      {/* 1. Anatomi HPP F&B */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader className="pb-3 border-b border-slate-800">
          <CardTitle className="text-sm font-semibold text-white flex items-center space-x-2">
            <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 text-xs flex items-center justify-center font-bold">1</span>
            <span>Anatomi HPP (Harga Pokok Penjualan) Menu Restoran</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-4 text-xs text-slate-300 leading-relaxed">
          <p>
            Banyak pengusaha F&B pemula hanya menghitung bahan utama (misal: ayam dan beras), namun melupakan biaya bumbu dasar, minyak goreng, gas elpiji, dan kemasan. HPP ideal per porsi terdiri dari:
          </p>
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 font-mono text-sky-300 space-y-1 text-[11px]">
            <div>Total HPP Offline = Bahan Baku + Buffer Overhead (5-8%) + Kemasan Dine-In</div>
            <div>Total HPP Online = Bahan Baku + Buffer Overhead (5-8%) + Kemasan Delivery (Bowl + Tutup + Seal + Sendok + Kantong)</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
              <span className="font-semibold text-white block mb-1">Penyusutan / Yield Factor (%)</span>
              <p className="text-slate-400 text-[11px]">
                Saat Anda membeli 1 kg kentang atau cabai rawit, setelah dikupas atau dibuang tangkainya, berat bersih yang bisa dimasak biasanya hanya 850 gram (yield = 85%). Jika tidak memperhitungkan yield, HPP Anda akan di bawah kenyataan (undercosting).
              </p>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
              <span className="font-semibold text-white block mb-1">Buffer Overhead Gas & Minyak (5-10%)</span>
              <p className="text-slate-400 text-[11px]">
                Menimbang setiap tetes minyak goreng atau gas per porsi sangat sulit. Standar industri resto menggunakan alokasi buffer persentase (5% s/d 10% dari total bahan baku) untuk menutup garam, bumbu penyedap, dan gas tabung.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Potongan GoFood & GrabFood */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader className="pb-3 border-b border-slate-800">
          <CardTitle className="text-sm font-semibold text-white flex items-center space-x-2">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold">2</span>
            <span>Struktur Potongan & Program Promo Ojol di Indonesia</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-4 text-xs text-slate-300 leading-relaxed">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00AA13]" />
                <span className="font-semibold text-white">GoFood (GoBiz)</span>
              </div>
              <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                <li><b>Komisi Reguler</b>: 20% dari nilai transaksi menu.</li>
                <li><b>Biaya Pemeliharaan</b>: Sekitar Rp 1.000 per transaksi pesanan selesai.</li>
                <li><b>GoFood Maksimal Pro</b>: Program visibilitas tinggi di mana resto memberikan diskon menu (contoh diskon 25%), dengan pembagian subsidi patungan (merchant menanggung 15%, Gojek mensubsidi 10%).</li>
              </ul>
            </div>

            <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00B14F]" />
                <span className="font-semibold text-white">GrabFood (GrabMerchant)</span>
              </div>
              <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                <li><b>Komisi Standar</b>: 20% (atau skema net PPN tergantung tier kontrak).</li>
                <li><b>Grab Mega Diskon / Kilat</b>: Diskon besar (25% s/d 35%) di mana resto menanggung subsidi utama, ditukar dengan eksposur di carousel utama aplikasi Grab.</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Mathematical Derivation of Reverse Pricing */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader className="pb-3 border-b border-slate-800">
          <CardTitle className="text-sm font-semibold text-white flex items-center space-x-2">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold">3</span>
            <span>Matematika Reverse Pricing: Mengapa Anda Wajib Menggunakannya?</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-4 text-xs text-slate-300 leading-relaxed">
          <p>
            Kesalahan paling mematikan bagi resto di ojol adalah formula <b>&quot;Markup Biasa&quot;</b>:
          </p>
          <div className="bg-rose-500/10 p-3 rounded-lg border border-rose-500/20 text-rose-300 text-[11px]">
            ❌ <b>Salah Kaprah</b>: Ingin untung dari harga offline Rp 30.000, dinaikkan 20% menjadi Rp 36.000. Saat orderan masuk Rp 36.000, Gojek memotong 20% (-Rp 7.200), resto hanya terima <b>Rp 28.800</b>. Jika resto juga ikut promo diskon 20%, resto rugi parah dan nombok!
          </div>

          <p>
            Rumus yang benar adalah <b>Target Net Realization</b>:
          </p>
          <div className="bg-emerald-500/10 p-3.5 rounded-lg border border-emerald-500/30 text-emerald-300 font-mono text-[11px] space-y-1">
            <div>Target Payout = Harga Offline + Selisih Kemasan Online</div>
            <div>Harga Tayang Aplikasi = (Target Payout + Biaya Layanan) / (1 - (Komisi% + Beban Promo Merchant%))</div>
          </div>
          <p className="text-slate-400 text-[11px]">
            Dengan membagi target terhadap sisa persentase bersih, berapapun diskon promo dan komisi yang dipotong oleh aplikasi, uang bersih yang ditransfer ke rekening bank Anda selalu menutup HPP dan target laba Anda secara presisi!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
