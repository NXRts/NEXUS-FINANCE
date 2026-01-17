import { useState, useEffect, useRef } from 'react';
import { Plus, Search, Filter, Calendar, ChevronLeft, ChevronRight, MoreVertical, X, Trash2, Edit, Check } from 'lucide-react';
import type { Income, Category } from '../types';
import { cn } from '../lib/utils';
import { storage } from '../lib/storage';

export function IncomePage() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [showLast30Days, setShowLast30Days] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: 'date' | 'amount' | null, direction: 'asc' | 'desc' }>({ key: null, direction: 'desc' });
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const actionMenuRef = useRef<HTMLDivElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Tertunda' as 'Diterima' | 'Tertunda'
  });

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    storage.initialize();
    setIncomes(storage.getIncomes());
    setCategories(storage.getCategories().filter(c => c.type === 'income' && c.status === 'active'));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setActiveActionId(null);
      }
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEdit = (income: Income) => {
      setEditingId(income.id);
      setFormData({
          source: income.source,
          amount: income.amount.toString(),
          date: income.date,
          status: income.status as 'Diterima' | 'Tertunda'
      });
      setIsModalOpen(true);
      setActiveActionId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        const updatedIncomes = incomes.filter(inc => inc.id !== id);
        setIncomes(updatedIncomes);
        storage.saveIncomes(updatedIncomes);
    }
    setActiveActionId(null);
  };

  const closeModal = () => {
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({
        source: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Tertunda'
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
        // Update existing
        const updatedIncomes = incomes.map(income => {
            if (income.id === editingId) {
                return {
                    ...income,
                    source: formData.source,
                    amount: Number(formData.amount),
                    date: formData.date,
                    status: formData.status
                };
            }
            return income;
        });
        setIncomes(updatedIncomes);
        storage.saveIncomes(updatedIncomes);
    } else {
        // Create new
        const newIncome: Income = {
          id: crypto.randomUUID(),
          invoiceId: `#INC-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
          source: formData.source,
          amount: Number(formData.amount),
          date: formData.date,
          status: formData.status,
        };
        const updatedIncomes = [newIncome, ...incomes];
        setIncomes(updatedIncomes);
        storage.saveIncomes(updatedIncomes);
    }
    
    closeModal();
  };

  // Filter Logic
  const filteredIncomes = incomes.filter(income => {
    const matchesSearch = 
        income.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        income.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        income.status.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (showLast30Days) {
        const incomeDate = new Date(income.date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return matchesSearch && incomeDate >= thirtyDaysAgo;
    }

    return matchesSearch;
  });

  // Sorting Logic
  if (sortConfig.key) {
      filteredIncomes.sort((a, b) => {
          if (sortConfig.key === 'date') {
              return sortConfig.direction === 'asc' 
                  ? new Date(a.date).getTime() - new Date(b.date).getTime()
                  : new Date(b.date).getTime() - new Date(a.date).getTime();
          }
          if (sortConfig.key === 'amount') {
              return sortConfig.direction === 'asc' 
                  ? a.amount - b.amount
                  : b.amount - a.amount;
          }
          return 0;
      });
  }

  // Pagination Logic
  const totalPages = Math.ceil(filteredIncomes.length / itemsPerPage);
  const paginatedIncomes = filteredIncomes.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Pemasukan</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Pantau dan kelola seluruh catatan pendapatan pribadi Anda.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Pemasukan</span>
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari sumber pemasukan, ID, atau status..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex gap-4">
            <button 
                onClick={() => setShowLast30Days(!showLast30Days)}
                className={cn(
                    "flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-bold transition-all",
                    showLast30Days 
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                )}
            >
                <Calendar className="w-5 h-5" />
                <span>30 Hari Terakhir</span>
            </button>
            <div className="relative" ref={filterMenuRef}>
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-bold hover:bg-slate-50 transition-all"
                >
                    <Filter className="w-5 h-5" />
                    <span>Filter</span>
                </button>
                {isFilterOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 z-20 overflow-hidden">
                        <div className="p-2 space-y-1">
                            <p className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Urutkan Berdasarkan</p>
                            <button 
                                onClick={() => { setSortConfig({ key: 'date', direction: 'desc' }); setIsFilterOpen(false); }}
                                className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg flex items-center justify-between"
                            >
                                <span>Tanggal (Terbaru)</span>
                                {sortConfig.key === 'date' && sortConfig.direction === 'desc' && <Check className="w-4 h-4 text-primary" />}
                            </button>
                            <button 
                                onClick={() => { setSortConfig({ key: 'date', direction: 'asc' }); setIsFilterOpen(false); }}
                                className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg flex items-center justify-between"
                            >
                                <span>Tanggal (Terlama)</span>
                                {sortConfig.key === 'date' && sortConfig.direction === 'asc' && <Check className="w-4 h-4 text-primary" />}
                            </button>
                            <button 
                                onClick={() => { setSortConfig({ key: 'amount', direction: 'desc' }); setIsFilterOpen(false); }}
                                className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg flex items-center justify-between"
                            >
                                <span>Jumlah (Tertinggi)</span>
                                {sortConfig.key === 'amount' && sortConfig.direction === 'desc' && <Check className="w-4 h-4 text-primary" />}
                            </button>
                            <button 
                                onClick={() => { setSortConfig({ key: 'amount', direction: 'asc' }); setIsFilterOpen(false); }}
                                className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg flex items-center justify-between"
                            >
                                <span>Jumlah (Terendah)</span>
                                {sortConfig.key === 'amount' && sortConfig.direction === 'asc' && <Check className="w-4 h-4 text-primary" />}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-visible min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">ID Transaksi</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Sumber</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Jumlah</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedIncomes.map((income) => (
                <tr key={income.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-primary">
                    {income.invoiceId}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{income.source}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                    {income.date}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                        "px-3 py-1 text-xs font-bold rounded-full",
                        income.status === 'Diterima' && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                        income.status === 'Tertunda' && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                    )}>
                      {income.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">
                    Rp {income.amount.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative">
                        <button 
                            onClick={() => setActiveActionId(activeActionId === income.id ? null : income.id)}
                            className="text-slate-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>
                        {activeActionId === income.id && (
                            <div ref={actionMenuRef} className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 z-10 overflow-hidden">
                                <button 
                                    onClick={() => handleEdit(income)}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                                >
                                    <Edit className="w-4 h-4" />
                                    <span>Edit</span>
                                </button>
                                <button 
                                    onClick={() => handleDelete(income.id)}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Hapus</span>
                                </button>
                            </div>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedIncomes.length === 0 && (
                 <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                        {searchQuery ? 'Tidak ada data yang cocok dengan pencarian Anda.' : 'Belum ada data pemasukan. Klik "Tambah Pemasukan" untuk membuat baru.'}
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
                Menampilkan <span className="font-bold text-slate-900 dark:text-white">{filteredIncomes.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, filteredIncomes.length)}</span> dari <span className="font-bold text-slate-900 dark:text-white">{filteredIncomes.length}</span> data
            </p>
            <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button 
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={cn(
                            "w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center transition-all",
                            currentPage === page 
                                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                                : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary"
                        )}
                    >
                        {page}
                    </button>
                ))}
                <button 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
      </div>

       {/* Modal Tambah/Edit Pemasukan */}
       {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingId ? 'Edit Pemasukan' : 'Tambah Pemasukan Baru'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Kategori Pemasukan</label>
                <div className="relative">
                  <select 
                    required
                    value={formData.source}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
                  >
                    <option value="" disabled>Pilih Kategori</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Jumlah (Rp)</label>
                   <input 
                    type="number" 
                    required
                    placeholder="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tanggal</label>
                   <input 
                    type="date" 
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Status</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Diterima', 'Tertunda'].map((bgStatus) => (
                    <button
                      key={bgStatus}
                      type="button"
                      onClick={() => setFormData({...formData, status: bgStatus as any})}
                      className={cn(
                        "py-3 rounded-xl text-sm font-bold border transition-all",
                        formData.status === bgStatus 
                          ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                      )}
                    >
                      {bgStatus}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                >
                  {editingId ? 'Simpan Perubahan' : 'Simpan Pemasukan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
