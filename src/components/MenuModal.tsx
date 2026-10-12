import React, { useState, useEffect } from "react";
import { MenuItemInput } from "@/lib/calculator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMenu?: MenuItemInput | null;
  onSaveMenu: (menu: MenuItemInput) => void;
}

export function MenuModal({
  isOpen,
  onClose,
  initialMenu,
  onSaveMenu,
}: MenuModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Makanan Utama");
  const [description, setDescription] = useState("");
  const [targetMarginDineIn, setTargetMarginDineIn] = useState("65");
  const [overheadPercent, setOverheadPercent] = useState("5");
  const [packagingOfflineCost, setPackagingOfflineCost] = useState("500");
  const [packagingOnlineCost, setPackagingOnlineCost] = useState("2500");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (initialMenu) {
        setName(initialMenu.name);
        setCategory(initialMenu.category || "Makanan Utama");
        setDescription(initialMenu.description || "");
        setTargetMarginDineIn(initialMenu.targetMarginDineIn.toString());
        setOverheadPercent(initialMenu.overheadPercent.toString());
        setPackagingOfflineCost(initialMenu.packagingOfflineCost.toString());
        setPackagingOnlineCost(initialMenu.packagingOnlineCost.toString());
      } else {
        setName("");
        setCategory("Makanan Utama");
        setDescription("");
        setTargetMarginDineIn("65");
        setOverheadPercent("5");
        setPackagingOfflineCost("500");
        setPackagingOnlineCost("2500");
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [initialMenu, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const saved: MenuItemInput = {
      id: initialMenu ? initialMenu.id : "menu-" + Date.now(),
      name: name.trim(),
      category,
      description: description.trim() || undefined,
      targetMarginDineIn: parseFloat(targetMarginDineIn) || 65,
      overheadPercent: parseFloat(overheadPercent) || 5,
      packagingOfflineCost: parseFloat(packagingOfflineCost) || 500,
      packagingOnlineCost: parseFloat(packagingOnlineCost) || 2500,
      recipeItems: initialMenu ? initialMenu.recipeItems : [],
      manualOfflinePrice: initialMenu?.manualOfflinePrice,
    };

    onSaveMenu(saved);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg bg-slate-900 border-slate-800 text-slate-100 p-6">
        <DialogHeader className="border-b border-slate-800 pb-3">
          <DialogTitle className="text-base font-semibold text-white">
            {initialMenu ? "Ubah Data Menu" : "Tambah Menu Makanan / Minuman Baru"}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            Atur parameter dasar menu, target margin keuntungan, dan alokasi kemasan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">
                Nama Menu
              </label>
              <Input
                placeholder="Contoh: Paket Ayam Penyet Sambal Ijo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-8 text-xs bg-slate-950 border-slate-700"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Kategori
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-8 text-xs bg-slate-950 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="Makanan Utama">Makanan Utama</SelectItem>
                    <SelectItem value="Minuman">Minuman</SelectItem>
                    <SelectItem value="Snack / Cemilan">Snack / Cemilan</SelectItem>
                    <SelectItem value="Paket Combo">Paket Combo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Target Gross Margin (%)
                </label>
                <Input
                  type="number"
                  value={targetMarginDineIn}
                  onChange={(e) => setTargetMarginDineIn(e.target.value)}
                  className="h-8 text-xs bg-slate-950 border-slate-700 font-mono"
                  min="20"
                  max="90"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">
                Deskripsi Singkat (Opsional)
              </label>
              <Input
                placeholder="Keterangan porsi / keunggulan produk..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-8 text-xs bg-slate-950 border-slate-700"
              />
            </div>

            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">
                  Overhead Buffer (%)
                </label>
                <Input
                  type="number"
                  value={overheadPercent}
                  onChange={(e) => setOverheadPercent(e.target.value)}
                  className="h-8 text-xs bg-slate-950 border-slate-700 font-mono"
                  min="0"
                  max="30"
                />
                <span className="text-[9px] text-slate-500 block mt-0.5">
                  Minyak/gas/listrik
                </span>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">
                  Packaging Dine-In (Rp)
                </label>
                <Input
                  type="number"
                  value={packagingOfflineCost}
                  onChange={(e) => setPackagingOfflineCost(e.target.value)}
                  className="h-8 text-xs bg-slate-950 border-slate-700 font-mono"
                  min="0"
                  step="100"
                />
                <span className="text-[9px] text-slate-500 block mt-0.5">
                  Kertas alas/tisu
                </span>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">
                  Packaging Online (Rp)
                </label>
                <Input
                  type="number"
                  value={packagingOnlineCost}
                  onChange={(e) => setPackagingOnlineCost(e.target.value)}
                  className="h-8 text-xs bg-slate-950 border-slate-700 font-mono"
                  min="0"
                  step="100"
                />
                <span className="text-[9px] text-slate-500 block mt-0.5">
                  Bowl + lid + sendok + tas
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              className="text-xs bg-sky-500 hover:bg-sky-400 text-slate-950 font-medium"
            >
              Simpan Menu
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
