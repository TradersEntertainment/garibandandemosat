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
      case 'Grid': return <Grid size={15} />;
      case 'Smartphone': return <Smartphone size={15} />;
      case 'Laptop': return <Laptop size={15} />;
      case 'Home': return <Home size={15} />;
      case 'ShoppingBag': return <ShoppingBag size={15} />;
      case 'Gamepad2': return <Gamepad2 size={15} />;
      case 'Shirt': return <Shirt size={15} />;
      case 'Sparkles': return <Sparkles size={15} />;
      default: return <Grid size={15} />;
    }
  };

  return (
    <div className="py-4 border-b border-slate-800/80 bg-slate-950/70 sticky top-[73px] z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-bold scale-102'
                    : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800/80'
                }`}
              >
                <span className={isSelected ? 'text-slate-950' : 'text-emerald-400'}>
                  {getIcon(cat.icon)}
                </span>
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-slate-950/20 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
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
