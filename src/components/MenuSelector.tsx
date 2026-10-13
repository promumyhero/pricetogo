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
    <div className="space-y-2.5 sm:space-y-3">
      {/* Horizontal Menu Pills (Touch-scrollable on phone & tablet) */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1.5 scrollbar-none -mx-1 px-1 touch-pan-x">
        {menus.map((menu) => {
          const isSelected = menu.id === selectedMenuId;
          return (
            <button
              key={menu.id}
              onClick={() => onSelectMenu(menu.id)}
              className={`flex items-center space-x-2 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border cursor-pointer shrink-0 ${
                isSelected
                  ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 shadow-xs"
                  : "bg-white dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              <Utensils className={`h-3 w-3 ${isSelected ? "opacity-90" : "opacity-40"}`} />
              <span>{menu.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isSelected
                    ? "bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                }`}
              >
                {menu.recipeItems.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Menu Detail Card */}
      {selectedMenu && (
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200/90 dark:border-zinc-800/80 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs transition-colors">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                {selectedMenu.name}
              </h2>
              <Badge variant="secondary" className="text-[10px]">
                {selectedMenu.category}
              </Badge>
            </div>
            {selectedMenu.description && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-2xl line-clamp-2 sm:line-clamp-1 leading-relaxed">
                {selectedMenu.description}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800/60">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditMenu(selectedMenu)}
              className="h-8 text-xs px-3 text-zinc-700 dark:text-zinc-300"
            >
              <Edit2 className="h-3 w-3 mr-1.5 text-zinc-500 dark:text-zinc-400" />
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
                className="h-8 text-xs px-2.5"
                title="Hapus menu"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
