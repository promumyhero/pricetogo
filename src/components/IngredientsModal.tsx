import React, { useState } from "react";
import { IngredientInput, SUPPORTED_UNITS } from "@/lib/calculator";
import { formatIDR } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Plus, Trash2, Search } from "lucide-react";

interface IngredientsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredients: IngredientInput[];
  onAddIngredient: (ing: IngredientInput) => void;
  onDeleteIngredient: (id: string) => void;
}

export function IngredientsModal({
  isOpen,
  onClose,
  ingredients,
  onAddIngredient,
  onDeleteIngredient,
}: IngredientsModalProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState<IngredientInput["category"]>("BAHAN_BAKU");
  const [purchasePrice, setPurchasePrice] = useState("50000");
  const [purchaseQty, setPurchaseQty] = useState("1");
  const [purchaseUnit, setPurchaseUnit] = useState("KG");
  const [yieldPercent, setYieldPercent] = useState("100");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newIng: IngredientInput = {
      id: "ing-" + Date.now(),
      name: name.trim(),
      category,
      purchasePrice: parseFloat(purchasePrice) || 0,
      purchaseQty: parseFloat(purchaseQty) || 1,
      purchaseUnit,
      yieldPercent: parseFloat(yieldPercent) || 100,
    };

    onAddIngredient(newIng);
    setName("");
    setPurchasePrice("50000");
    setPurchaseQty("1");
    setYieldPercent("100");
  };

  const filtered = ingredients.filter((ing) => {
    const matchSearch = ing.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "ALL" || ing.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100%-1.5rem)] sm:w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 p-4 sm:p-6 rounded-2xl sm:rounded-xl">
        <DialogHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <DialogTitle className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Master Data Bahan Baku & Kemasan
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
            Daftar harga beli bahan, satuan metrik, dan persentase susut (yield) yang bisa dipakai di seluruh resep menu.
          </DialogDescription>
        </DialogHeader>

        {/* Form Tambah Bahan Baru (Responsive paired grid) */}
        <form
          onSubmit={handleCreate}
          className="bg-zinc-50 dark:bg-zinc-950/70 p-3 sm:p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center space-x-1.5">
              <Plus className="h-3.5 w-3.5" />
              <span>Input Bahan Baku Baru</span>
            </span>
            <span className="text-[10px] text-zinc-400 hidden sm:inline">
              *Otomatis terhubung ke konversi resep
            </span>
          </div>

          <div className="grid grid-cols-12 gap-2 sm:gap-2.5">
            <div className="col-span-12 sm:col-span-5">
              <label className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 block mb-1">
                Nama Bahan Baku
              </label>
              <Input
                placeholder="Contoh: Daging Ayam Fillet, Beras, dll."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-8 text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
                required
              />
            </div>

            <div className="col-span-12 sm:col-span-3">
              <label className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 block mb-1">
                Kategori
              </label>
              <Select
                value={category}
                onValueChange={(val) => setCategory(val as IngredientInput["category"])}
              >
                <SelectTrigger className="h-8 text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
                  <SelectItem value="BAHAN_BAKU">Bahan Baku</SelectItem>
                  <SelectItem value="BUMBU">Bumbu & Saus</SelectItem>
                  <SelectItem value="PACKAGING">Packaging</SelectItem>
                  <SelectItem value="OPERASIONAL">Operasional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-12 sm:col-span-4">
              <label className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 block mb-1">
                Harga Beli (Rp)
              </label>
              <Input
                type="number"
                inputMode="decimal"
                placeholder="50000"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                className="h-8 text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 font-mono tabular-nums"
                required
                min="0"
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 block mb-1">
                Jumlah Beli
              </label>
              <Input
                type="number"
                inputMode="decimal"
                placeholder="1"
                value={purchaseQty}
                onChange={(e) => setPurchaseQty(e.target.value)}
                className="h-8 text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 font-mono tabular-nums"
                min="0.01"
                step="any"
                required
              />
            </div>

            <div className="col-span-6 sm:col-span-4">
              <label className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 block mb-1">
                Satuan Beli
              </label>
              <Select value={purchaseUnit} onValueChange={setPurchaseUnit}>
                <SelectTrigger className="h-8 text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
                  {Object.entries(SUPPORTED_UNITS).map(([code, def]) => (
                    <SelectItem key={code} value={code}>
                      {def.code} - {def.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 block mb-1" title="Persentase bahan yang bisa dipakai setelah dibersihkan/dikupas/dimasak">
                Yield / Susut (%)
              </label>
              <Input
                type="number"
                inputMode="decimal"
                placeholder="100"
                value={yieldPercent}
                onChange={(e) => setYieldPercent(e.target.value)}
                className="h-8 text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 font-mono tabular-nums"
                min="10"
                max="100"
              />
            </div>

            <div className="col-span-6 sm:col-span-2 flex items-end">
              <Button
                type="submit"
                size="sm"
                className="w-full h-8 text-xs"
              >
                + Simpan
              </Button>
            </div>
          </div>
        </form>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
          <div className="relative w-full sm:w-64">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-zinc-400" />
            <Input
              placeholder="Cari bahan baku..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 text-xs pl-8 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
            {["ALL", "BAHAN_BAKU", "BUMBU", "PACKAGING"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`text-[11px] px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                  categoryFilter === cat
                    ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 font-medium"
                    : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                {cat === "ALL" ? "Semua" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Ingredients Table */}
        <div className="overflow-x-auto rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-950/40">
          <table className="w-full text-xs text-left">
            <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="py-2.5 px-3.5">Nama Bahan</th>
                <th className="py-2.5 px-3.5">Kategori</th>
                <th className="py-2.5 px-3.5">Harga Beli</th>
                <th className="py-2.5 px-3.5">Satuan Pembelian</th>
                <th className="py-2.5 px-3.5">Yield / Susut</th>
                <th className="py-2.5 px-2 text-center w-10">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-sans">
              {filtered.map((ing) => (
                <tr key={ing.id} className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30">
                  <td className="py-2 px-3.5 font-medium text-zinc-900 dark:text-zinc-200">
                    {ing.name}
                  </td>
                  <td className="py-2 px-3.5">
                    <Badge variant="secondary" className="text-[10px]">
                      {ing.category}
                    </Badge>
                  </td>
                  <td className="py-2 px-3.5 font-mono text-zinc-800 dark:text-zinc-200">
                    {formatIDR(ing.purchasePrice)}
                  </td>
                  <td className="py-2 px-3.5 font-mono text-zinc-600 dark:text-zinc-300">
                    {ing.purchaseQty} {ing.purchaseUnit}
                  </td>
                  <td className="py-2 px-3.5 font-mono">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        ing.yieldPercent < 100
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40"
                          : "text-zinc-500"
                      }`}
                    >
                      {ing.yieldPercent}%
                    </span>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => onDeleteIngredient(ing.id)}
                      className="text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 cursor-pointer"
                      title="Hapus bahan"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
