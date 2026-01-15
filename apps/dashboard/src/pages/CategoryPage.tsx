import { useState } from 'react';
import { Plus, Wallet, TrendingDown, Briefcase, Star, TrendingUp, Coffee, Car, ShoppingBag, FileText } from 'lucide-react';
import type { Category } from '../types';
import { cn } from '../lib/utils';

const mockCategories: Category[] = [
  // Income
  { id: '1', name: 'Gaji Bulanan', type: 'income', status: 'active', icon: 'briefcase', color: 'emerald' },
  { id: '2', name: 'Bonus & Insentif', type: 'income', status: 'active', icon: 'star', color: 'emerald' },
  { id: '3', name: 'Investasi', type: 'income', status: 'active', icon: 'trending-up', color: 'emerald' },
  
  // Expense
  { id: '4', name: 'Makan & Minum', type: 'expense', status: 'active', icon: 'coffee', color: 'rose' },
  { id: '5', name: 'Transportasi', type: 'expense', status: 'active', icon: 'car', color: 'rose' },
  { id: '6', name: 'Belanja Rutin', type: 'expense', status: 'active', icon: 'shopping-bag', color: 'rose' },
  { id: '7', name: 'Tagihan & Air', type: 'expense', status: 'active', icon: 'file-text', color: 'rose' },
];

export function CategoryPage() {
  const [categories] = useState<Category[]>(mockCategories);
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>('income');

  const filteredCategories = categories.filter(c => c.type === activeTab);

  const getIcon = (iconName: string) => {
    switch(iconName) {
      case 'briefcase': return <Briefcase className="w-6 h-6" />;
      case 'star': return <Star className="w-6 h-6" />;
      case 'trending-up': return <TrendingUp className="w-6 h-6" />;
      case 'coffee': return <Coffee className="w-6 h-6" />;
      case 'car': return <Car className="w-6 h-6" />;
      case 'shopping-bag': return <ShoppingBag className="w-6 h-6" />;
      case 'file-text': return <FileText className="w-6 h-6" />;
      default: return <Wallet className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Kategori</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Kelola kategori pemasukan dan pengeluaran Anda.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all">
          <Plus className="w-5 h-5" />
          <span>Tambah Kategori</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-8">
          <button 
            onClick={() => setActiveTab('income')}
            className={cn(
              "pb-4 text-sm font-bold flex items-center gap-2 transition-all border-b-2",
              activeTab === 'income' 
                ? "text-slate-900 dark:text-white border-slate-900 dark:border-white" 
                : "text-slate-400 border-transparent hover:text-slate-600 dark:hover:text-slate-300"
            )}
          >
            <TrendingUp className={cn("w-4 h-4", activeTab === 'income' ? "text-emerald-500" : "text-slate-400")} />
            Kategori Pemasukan
          </button>
          <button 
            onClick={() => setActiveTab('expense')}
            className={cn(
              "pb-4 text-sm font-bold flex items-center gap-2 transition-all border-b-2",
              activeTab === 'expense' 
                ? "text-slate-900 dark:text-white border-slate-900 dark:border-white" 
                : "text-slate-400 border-transparent hover:text-slate-600 dark:hover:text-slate-300"
            )}
          >
            <TrendingDown className={cn("w-4 h-4", activeTab === 'expense' ? "text-rose-500" : "text-slate-400")} />
            Kategori Pengeluaran
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {activeTab === 'income' ? 'Kategori Pemasukan' : 'Kategori Pengeluaran'}
          </h3>
          <span className={cn(
            "px-2 py-0.5 text-[10px] font-bold uppercase rounded-md tracking-wider",
            activeTab === 'income' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
          )}>
            {filteredCategories.length} Items
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group cursor-pointer relative overflow-hidden">
               <div className={cn(
                 "absolute top-0 left-0 w-full h-1",
                 category.color === 'emerald' ? "bg-emerald-500" : "bg-rose-500"
               )}></div>
               
               <div className="mb-6">
                 <div className={cn(
                   "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                   category.color === 'emerald' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400"
                 )}>
                   {getIcon(category.icon || 'wallet')}
                 </div>
                 <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{category.name}</h4>
               </div>

               <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                 <span className={cn(
                   "text-xs font-bold uppercase tracking-wider",
                   category.type === 'income' ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                 )}>
                   {category.type.toUpperCase()}
                 </span>
                 <span className="text-xs font-medium text-slate-400">
                   Active
                 </span>
               </div>
            </div>
          ))}
          
          {/* Add New Quick Card */}
           <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group min-h-[200px]">
             <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
               <Plus className="w-6 h-6" />
             </div>
             <p className="font-bold text-slate-900 dark:text-white">Tambah Kategori Baru</p>
             <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Buat kategori {activeTab === 'income' ? 'pemasukan' : 'pengeluaran'} custom</p>
           </div>
        </div>
      </div>
    </div>
  );
}
