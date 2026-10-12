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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-800 text-slate-100 p-6">
        <DialogHeader className="border-b border-slate-800 pb-3">
          <DialogTitle className="text-base font-semibold text-white">
            Master Data Bahan Baku & Kemasan
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            Daftar harga beli bahan, satuan metrik, dan persentase susut (yield) yang bisa dipakai di seluruh resep menu.
          </DialogDescription>
        </DialogHeader>

        {/* Form Tambah Bahan Baru */}
        <form
          onSubmit={handleCreate}
          className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
              <Plus className="h-3.5 w-3.5 text-sky-400" />
              <span>Input Bahan Baku Baru</span>
            </span>
            <span className="text-[11px] text-slate-500">
              *Otomatis terhubung ke konversi resep
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            <div className="sm:col-span-5">
              <label className="text-[10px] text-slate-400 block mb-1">
                Nama Bahan Baku
              </label>
              <Input
                placeholder="Contoh: Daging Ayam Fillet, Beras, dll."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-8 text-xs bg-slate-900 border-slate-700"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <label className="text-[10px] text-slate-400 block mb-1">
                Kategori
              </label>
              <Select
                value={category}
                onValueChange={(val) => setCategory(val as IngredientInput["category"])}
              >
                <SelectTrigger className="h-8 text-xs bg-slate-900 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  <SelectItem value="BAHAN_BAKU">Bahan Baku</SelectItem>
                  <SelectItem value="BUMBU">Bumbu & Saus</SelectItem>
                  <SelectItem value="PACKAGING">Packaging</SelectItem>
                  <SelectItem value="OPERASIONAL">Operasional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-4">
              <label className="text-[10px] text-slate-400 block mb-1">
                Harga Beli (Rp)
              </label>
              <Input
                type="number"
                placeholder="50000"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                className="h-8 text-xs bg-slate-900 border-slate-700 font-mono"
                required
                min="0"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="text-[10px] text-slate-400 block mb-1">
                Jumlah Beli
              </label>
              <Input
                type="number"
                placeholder="1"
                value={purchaseQty}
                onChange={(e) => setPurchaseQty(e.target.value)}
                className="h-8 text-xs bg-slate-900 border-slate-700 font-mono"
                min="0.01"
                step="any"
                required
              />
            </div>

            <div className="sm:col-span-4">
              <label className="text-[10px] text-slate-400 block mb-1">
                Satuan Beli
              </label>
              <Select value={purchaseUnit} onValueChange={setPurchaseUnit}>
                <SelectTrigger className="h-8 text-xs bg-slate-900 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  {Object.entries(SUPPORTED_UNITS).map(([code, def]) => (
                    <SelectItem key={code} value={code}>
                      {def.code} - {def.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-3">
              <label className="text-[10px] text-slate-400 block mb-1" title="Persentase bahan yang bisa dipakai setelah dibersihkan/dikupas/dimasak">
                Yield / Susut (%)
              </label>
              <Input
                type="number"
                placeholder="100"
                value={yieldPercent}
                onChange={(e) => setYieldPercent(e.target.value)}
                className="h-8 text-xs bg-slate-900 border-slate-700 font-mono"
                min="10"
                max="100"
              />
            </div>

            <div className="sm:col-span-2 flex items-end">
              <Button
                type="submit"
                size="sm"
                className="w-full h-8 text-xs bg-sky-500 hover:bg-sky-400 text-slate-950 font-medium"
              >
                + Simpan
              </Button>
            </div>
          </div>
        </form>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2">
          <div className="relative w-full sm:w-64">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <Input
              placeholder="Cari bahan baku..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 text-xs pl-8 bg-slate-950 border-slate-800"
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
                    ? "bg-slate-800 border-slate-700 text-white font-medium"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                {cat === "ALL" ? "Semua" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Ingredients Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-800/80">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Nama Bahan</th>
                <th className="py-2.5 px-3">Kategori</th>
                <th className="py-2.5 px-3">Harga Beli</th>
                <th className="py-2.5 px-3">Satuan Pembelian</th>
                <th className="py-2.5 px-3">Yield / Susut</th>
                <th className="py-2.5 px-2 text-center w-10">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filtered.map((ing) => (
                <tr key={ing.id} className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 font-medium text-slate-200">
                    {ing.name}
                  </td>
                  <td className="py-2 px-3">
                    <Badge variant="secondary" className="text-[10px]">
                      {ing.category}
                    </Badge>
                  </td>
                  <td className="py-2 px-3 font-mono text-slate-200">
                    {formatIDR(ing.purchasePrice)}
                  </td>
                  <td className="py-2 px-3 font-mono text-slate-300">
                    {ing.purchaseQty} {ing.purchaseUnit}
                  </td>
                  <td className="py-2 px-3 font-mono">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        ing.yieldPercent < 100
                          ? "bg-amber-500/15 text-amber-300"
                          : "text-slate-400"
                      }`}
                    >
                      {ing.yieldPercent}%
                    </span>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => onDeleteIngredient(ing.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
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
