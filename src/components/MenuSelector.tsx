import React from "react";
import { MenuItemInput } from "@/lib/calculator";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Edit2, Trash2, Utensils } from "lucide-react";

interface MenuSelectorProps {
  menus: MenuItemInput[];
  selectedMenuId: string;
  onSelectMenu: (id: string) => void;
  onEditMenu: (menu: MenuItemInput) => void;
  onDeleteMenu: (id: string) => void;
}

export function MenuSelector({
  menus,
  selectedMenuId,
  onSelectMenu,
  onEditMenu,
  onDeleteMenu,
}: MenuSelectorProps) {
  const selectedMenu = menus.find((m) => m.id === selectedMenuId) || menus[0];

  return (
    <div className="space-y-3">
      {/* Horizontal Menu Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {menus.map((menu) => {
          const isSelected = menu.id === selectedMenuId;
          return (
            <button
              key={menu.id}
              onClick={() => onSelectMenu(menu.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all border cursor-pointer ${
                isSelected
                  ? "bg-slate-800 text-white border-sky-500/50 shadow-sm shadow-sky-500/10"
                  : "bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <Utensils className={`h-3 w-3 ${isSelected ? "text-sky-400" : "text-slate-500"}`} />
              <span>{menu.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded ${
                  isSelected ? "bg-slate-700 text-slate-300" : "bg-slate-800 text-slate-500"
                }`}
              >
                {menu.recipeItems.length} bahan
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Menu Detail Card Strip */}
      {selectedMenu && (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-semibold text-white tracking-tight">
                {selectedMenu.name}
              </h2>
              <Badge variant="secondary" className="text-[10px]">
                {selectedMenu.category}
              </Badge>
            </div>
            {selectedMenu.description && (
              <p className="text-xs text-slate-400 max-w-2xl line-clamp-1">
                {selectedMenu.description}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditMenu(selectedMenu)}
              className="h-7 text-xs px-2.5 text-slate-300 hover:text-white"
            >
              <Edit2 className="h-3 w-3 mr-1 text-slate-400" />
              Ubah Parameter
            </Button>
            {menus.length > 1 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (confirm(`Yakin ingin menghapus menu "${selectedMenu.name}"?`)) {
                    onDeleteMenu(selectedMenu.id);
                  }
                }}
                className="h-7 text-xs px-2 text-rose-400 hover:bg-rose-500/20"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
