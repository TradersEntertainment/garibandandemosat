import React from 'react';
import {
  Grid,
  Smartphone,
  Laptop,
  Home,
  ShoppingBag,
  Gamepad2,
  Shirt,
  Sparkles
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Grid': return <Grid size={14} />;
      case 'Smartphone': return <Smartphone size={14} />;
      case 'Laptop': return <Laptop size={14} />;
      case 'Home': return <Home size={14} />;
      case 'ShoppingBag': return <ShoppingBag size={14} />;
      case 'Gamepad2': return <Gamepad2 size={14} />;
      case 'Shirt': return <Shirt size={14} />;
      case 'Sparkles': return <Sparkles size={14} />;
      default: return <Grid size={14} />;
    }
  };

  return (
    <div className="py-3.5 border-b border-white/10 bg-obsidian-950/80 sticky top-[73px] z-30 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-mono font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-cyber-emerald text-obsidian-950 font-bold shadow-lg shadow-cyber-emerald/20 scale-102'
                    : 'bg-obsidian-900/90 text-slate-300 hover:text-white hover:bg-white/5 border border-white/8'
                }`}
              >
                <span className={isSelected ? 'text-obsidian-950' : 'text-cyber-emerald'}>
                  {getIcon(cat.icon)}
                </span>
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                    isSelected
                      ? 'bg-obsidian-950/20 text-obsidian-950 font-black'
                      : 'bg-obsidian-950 text-slate-400 border border-white/5'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
