import { useState, useEffect, useRef } from 'react';
import { Plus, Search, Filter, Calendar, ChevronLeft, ChevronRight, MoreVertical, X, Trash2, Edit } from 'lucide-react';
import type { Income } from '../types';
import { cn } from '../lib/utils';
import { storage } from '../lib/storage';

export function IncomePage() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLast30Days, setShowLast30Days] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: 'date' | 'amount', direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });
  
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    clientName: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Pending' as 'Lunas' | 'Pending' | 'Batal'
  });

  useEffect(() => {
    setIncomes(storage.getIncomes());

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (income: Income) => {
      setEditingId(income.id);
      setFormData({
          clientName: income.clientName,
          amount: income.amount.toString(),
          date: income.date,
          status: income.status as 'Lunas' | 'Pending' | 'Batal'
      });
      setIsModalOpen(true);
      setActiveActionId(null);
  };

  const closeModal = () => {
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({
        clientName: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Pending'
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
        // Update existing income
        const updatedIncomes = incomes.map(income => {
            if (income.id === editingId) {
                return {
                    ...income,
                    clientName: formData.clientName,
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
        // Create new income
        const newIncome: Income = {
          id: crypto.randomUUID(),
          invoiceId: `#INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
          clientName: formData.clientName,
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

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      const updatedIncomes = incomes.filter(income => income.id !== id);
      setIncomes(updatedIncomes);
      storage.saveIncomes(updatedIncomes);
      setActiveActionId(null);
    }
  };

  const toggleActionMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveActionId(activeActionId === id ? null : id);
  };

  const filteredIncomes = incomes.filter(income => {
    const matchesSearch = 
        income.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        income.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        income.status.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (showLast30Days) {
        const incomeDate = new Date(income.date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return matchesSearch && incomeDate >= thirtyDaysAgo;
    }

    return matchesSearch;
  }).sort((a, b) => {
      if (sortConfig.key === 'date') {
          return sortConfig.direction === 'desc' 
            ? new Date(b.date).getTime() - new Date(a.date).getTime()
            : new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
          return sortConfig.direction === 'desc'
            ? b.amount - a.amount
            : a.amount - b.amount;
      }
  });

  return (
    <div className="space-y-8 relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Pemasukan</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Pantau dan kelola seluruh catatan pendapatan dari klien Anda secara real-time.</p>
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
            placeholder="Cari klien, ID invoice, atau status..." 
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
            <div className="relative">
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-xl border text-sm font-bold transition-all",
                         isFilterOpen
                            ? "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                    )}
                >
                    <Filter className="w-5 h-5" />
                    <span>Filter</span>
                </button>

                 {isFilterOpen && (
                    <div 
                        ref={filterMenuRef}
                        className="absolute right-0 top-full mt-2 z-50 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 animate-in fade-in zoom-in-95 duration-200"
                    >
                        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Urutkan</span>
                        </div>
                        <button 
                            onClick={() => { setSortConfig({ key: 'date', direction: 'desc' }); setIsFilterOpen(false); }}
                            className={cn(
                                "w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between",
                                sortConfig.key === 'date' && sortConfig.direction === 'desc' ? "text-primary bg-primary/5" : "text-slate-600 dark:text-slate-300"
                            )}
                        >
                            <span>Tanggal (Terbaru)</span>
                            {sortConfig.key === 'date' && sortConfig.direction === 'desc' && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                        </button>
                        <button 
                            onClick={() => { setSortConfig({ key: 'date', direction: 'asc' }); setIsFilterOpen(false); }}
                            className={cn(
                                "w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between",
                                sortConfig.key === 'date' && sortConfig.direction === 'asc' ? "text-primary bg-primary/5" : "text-slate-600 dark:text-slate-300"
                            )}
                        >
                            <span>Tanggal (Terlama)</span>
                            {sortConfig.key === 'date' && sortConfig.direction === 'asc' && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                        </button>
                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                        <button 
                            onClick={() => { setSortConfig({ key: 'amount', direction: 'desc' }); setIsFilterOpen(false); }}
                            className={cn(
                                "w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between",
                                sortConfig.key === 'amount' && sortConfig.direction === 'desc' ? "text-primary bg-primary/5" : "text-slate-600 dark:text-slate-300"
                            )}
                        >
                            <span>Jumlah (Tertinggi)</span>
                            {sortConfig.key === 'amount' && sortConfig.direction === 'desc' && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                        </button>
                        <button 
                            onClick={() => { setSortConfig({ key: 'amount', direction: 'asc' }); setIsFilterOpen(false); }}
                            className={cn(
                                "w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between",
                                sortConfig.key === 'amount' && sortConfig.direction === 'asc' ? "text-primary bg-primary/5" : "text-slate-600 dark:text-slate-300"
                            )}
                        >
                            <span>Jumlah (Terendah)</span>
                            {sortConfig.key === 'amount' && sortConfig.direction === 'asc' && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-visible">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Invoice ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Klien</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Jumlah</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredIncomes.map((income) => (
                <tr key={income.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group relative">
                  <td className="px-6 py-4 text-sm font-bold text-primary">
                    {income.invoiceId}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                        {income.clientName.substring(0, 2)}
                      </div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{income.clientName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                    {income.date}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                        "px-3 py-1 text-xs font-bold rounded-full",
                        income.status === 'Lunas' && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                        income.status === 'Pending' && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                        income.status === 'Batal' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                    )}>
                      {income.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">
                    Rp {income.amount.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button 
                        onClick={(e) => toggleActionMenu(e, income.id)}
                        className="text-slate-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    
                    {/* Floating Action Menu */}
                    {activeActionId === income.id && (
                        <div 
                            ref={actionMenuRef}
                            className="absolute right-10 top-2 z-50 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 animate-in fade-in zoom-in-95 duration-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button 
                                onClick={() => handleEdit(income)}
                                className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors"
                            >
                                <Edit className="w-4 h-4" />
                                Edit Data
                            </button>
                            <button 
                                onClick={() => handleDelete(income.id)}
                                className="w-full px-4 py-2.5 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-2 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                Hapus
                            </button>
                        </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredIncomes.length === 0 && (
                 <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                        {searchQuery ? 'Tidak ada data yang cocok dengan pencarian Anda.' : 'Belum ada data pemasukan. Klik "Tambah Pemasukan" untuk membuat baru.'}
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination - Keep existing code */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
                Menampilkan <span className="font-bold text-slate-900 dark:text-white">{filteredIncomes.length > 0 ? 1 : 0}-{Math.min(filteredIncomes.length, 5)}</span> dari <span className="font-bold text-slate-900 dark:text-white">{filteredIncomes.length}</span> data
            </p>
            <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary hover:border-primary disabled:opacity-50">
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="hidden md:flex items-center gap-2">
                    <button className="w-8 h-8 rounded-lg bg-primary text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-primary/20">1</button>
                </div>
                <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-primary hover:border-primary transition-colors">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
      </div>

       {/* Summary Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/20">
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">Total Bulan Ini</p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                Rp {incomes.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString('id-ID')}
              </h3>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  +12.5% dari bulan lalu
              </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Invoice Pending</p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                {incomes.filter(i => i.status === 'Pending').length}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Menunggu konfirmasi pembayaran</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Total Transaksi</p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">{incomes.length}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total seluruh pemasukan tercatat</p>
          </div>
      </div>

      {/* Add Income Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-100 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingId ? 'Edit Pemasukan' : 'Tambah Pemasukan Baru'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nama Klien</label>
                <input 
                  type="text" 
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="Contoh: PT. Maju Mundur"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Jumlah (Rp)</label>
                <input 
                  type="number" 
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="0"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tanggal</label>
                  <input 
                    type="date" 
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Status</label>
                  <select 
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Lunas">Lunas</option>
                    <option value="Batal">Batal</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
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
