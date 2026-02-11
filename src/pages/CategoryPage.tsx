import { useState, useEffect } from 'react';
import { Plus, Wallet, TrendingDown, Briefcase, Star, TrendingUp, Coffee, Car, ShoppingBag, FileText, Trash2 } from 'lucide-react';
import type { Category } from '../types';
import { cn } from '../lib/utils';
import { storage } from '../lib/storage';
import { Modal } from '../components/ui/Modal';

export function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>('income');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Icon Options
  const iconOptions = [
    { value: 'wallet', label: 'Wallet', icon: Wallet },
    { value: 'briefcase', label: 'Briefcase', icon: Briefcase },
    { value: 'star', label: 'Star', icon: Star },
    { value: 'trending-up', label: 'Trending Up', icon: TrendingUp },
    { value: 'coffee', label: 'Coffee', icon: Coffee },
    { value: 'car', label: 'Car', icon: Car },
    { value: 'shopping-bag', label: 'Shopping', icon: ShoppingBag },
    { value: 'file-text', label: 'Bill', icon: FileText },
  ];

  const [formData, setFormData] = useState({
    name: '',
    type: 'income' as 'income' | 'expense',
    icon: 'wallet',
    color: 'emerald'
  });

  useEffect(() => {
    storage.initialize();
    setCategories(storage.getCategories());
  }, []);

  useEffect(() => {
    setCategories(storage.getCategories());
  }, []);

  const filteredCategories = categories.filter(c => c.type === activeTab);

  const getIcon = (iconName: string) => {
    const IconComponent = iconOptions.find(opt => opt.value === iconName)?.icon || Wallet;
    return <IconComponent className="w-6 h-6" />;
  };

  const handleOpenModal = (type?: 'income' | 'expense') => {
    setFormData({
      name: '',
      type: type || activeTab,
      icon: 'wallet',
      color: (type || activeTab) === 'income' ? 'emerald' : 'rose'
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      type: category.type,
      icon: category.icon || 'wallet',
      color: category.color || 'emerald'
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      const updatedCategories = categories.filter(c => c.id !== id);
      setCategories(updatedCategories);
      storage.saveCategories(updatedCategories);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      // Update existing
      const updatedCategories = categories.map(cat => {
        if (cat.id === editingId) {
          return {
            ...cat,
            name: formData.name,
            type: formData.type,
            icon: formData.icon,
            color: formData.color,
            status: cat.status
          };
        }
        return cat;
      });
      setCategories(updatedCategories);
      storage.saveCategories(updatedCategories);
    } else {
      // Create new
      const newCategory: Category = {
        id: crypto.randomUUID(),
        name: formData.name,
        type: formData.type,
        status: 'active',
        icon: formData.icon,
        color: formData.color
      };
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      storage.saveCategories(updatedCategories);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Kategori</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Kelola kategori pemasukan dan pengeluaran Anda.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all"
        >
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
            <div
              key={category.id}
              onClick={() => handleEdit(category)}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group cursor-pointer relative overflow-hidden"
            >
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
                <button
                  onClick={(e) => handleDelete(category.id, e)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Add New Quick Card */}
          <div
            onClick={() => handleOpenModal(activeTab)}
            className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group min-h-[200px]"
          >
            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
              <Plus className="w-6 h-6" />
            </div>
            <p className="font-bold text-slate-900 dark:text-white">Tambah Kategori Baru</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Buat kategori {activeTab === 'income' ? 'pemasukan' : 'pengeluaran'} custom</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Kategori' : 'Tambah Kategori'}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nama Kategori</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400 dark:text-white font-bold"
              placeholder="Contoh: Gaji, Makanan, Tagihan..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tipe Kategori</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income', color: 'emerald' })}
                className={cn(
                  "py-3 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2",
                  formData.type === 'income'
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200 active:scale-95"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                )}
              >
                <TrendingUp className="w-4 h-4" />
                Pemasukan
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense', color: 'rose' })}
                className={cn(
                  "py-3 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2",
                  formData.type === 'expense'
                    ? "bg-rose-100 text-rose-700 border-rose-200 active:scale-95"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                )}
              >
                <TrendingDown className="w-4 h-4" />
                Pengeluaran
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Pilih Ikon</label>
            <div className="grid grid-cols-4 gap-2">
              {iconOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: opt.value })}
                    className={cn(
                      "aspect-square rounded-xl flex items-center justify-center transition-all",
                      formData.icon === opt.value
                        ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                    )}
                    title={opt.label}
                  >
                    <Icon className="w-6 h-6" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
            >
              {editingId ? 'Simpan Perubahan' : 'Buat Kategori'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
