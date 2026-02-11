import { useState, useEffect, useRef } from 'react';
import { Plus, Search, Filter, Calendar, ChevronLeft, ChevronRight, MoreVertical, Trash2, Edit, Check } from 'lucide-react';
import type { Income, Category } from '../types';
import { cn } from '../lib/utils';
import { storage } from '../lib/storage';
import { Modal } from '../components/ui/Modal';

export function IncomePage() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

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
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

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
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
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
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Pemasukan</h2>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium mt-1">Pantau dan kelola seluruh catatan pendapatan pribadi Anda.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all w-full md:w-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Pemasukan</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 dark:bg-emerald-900/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 relative z-10">Total Pemasukan (Bulan Ini)</p>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 relative z-10">
            Rp {incomes
              .filter(inc => {
                const d = new Date(inc.date);
                const now = new Date();
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
              })
              .reduce((acc, curr) => acc + curr.amount, 0)
              .toLocaleString('id-ID')}
          </h3>
          <p className="text-xs font-bold text-emerald-600 flex items-center gap-1 relative z-10">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            +8.4% vs bulan lalu
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 dark:bg-blue-900/10 rounded-bl-full -mr-4 -mt-4"></div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 relative z-10">Kategori Terbanyak</p>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 relative z-10">
            {(() => {
              const totals: Record<string, number> = {};
              incomes.forEach(inc => { totals[inc.source] = (totals[inc.source] || 0) + inc.amount; });
              const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
              return sorted.length > 0 ? sorted[0][0] : '-';
            })()}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 relative z-10">
            Kontribusi terbesar bulan ini
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 dark:bg-purple-900/10 rounded-bl-full -mr-4 -mt-4"></div>
          <div className="flex justify-between items-start mb-2 relative z-10">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Target Tercapai</p>
          </div>
          <div className="flex items-end gap-2 mb-4 relative z-10">
            <h3 className="text-3xl xs:text-4xl font-extrabold text-slate-900 dark:text-white leading-none">
              {(() => {
                const total = incomes
                  .filter(inc => {
                    const d = new Date(inc.date);
                    const now = new Date();
                    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                  })
                  .reduce((acc, curr) => acc + curr.amount, 0);
                const target = 50000000; // Mock target 50jt
                return Math.min(Math.round((total / target) * 100), 100);
              })()}%
            </h3>
            <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-[10px] font-bold rounded-full mb-1">Target: 50jt</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative z-10">
            <div className="h-full bg-purple-500 rounded-full" style={{
              width: `${(() => {
                const total = incomes.filter(inc => {
                  const d = new Date(inc.date);
                  const now = new Date();
                  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                }).reduce((acc, curr) => acc + curr.amount, 0);
                const target = 50000000;
                return Math.min(Math.round((total / target) * 100), 100);
              })()}%`
            }}></div>
          </div>
        </div>
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
                <th className="px-4 md:px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:table-cell">ID Transaksi</th>
                <th className="px-4 md:px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Sumber</th>
                <th className="px-4 md:px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">Tanggal</th>
                <th className="px-4 md:px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-4 md:px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Jumlah</th>
                <th className="px-4 md:px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedIncomes.map((income) => (
                <tr key={income.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-4 md:px-6 py-4 text-sm font-bold text-primary hidden sm:table-cell">
                    {income.invoiceId}
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{income.source}</span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-medium hidden md:table-cell">
                    {income.date}
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 text-xs font-bold rounded-full",
                      income.status === 'Diterima' && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                      income.status === 'Tertunda' && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                    )}>
                      {income.status}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-right font-bold text-slate-900 dark:text-white">
                    Rp {income.amount.toLocaleString('id-ID')}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-right">
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

        {/* Pagination Controls */}
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
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingId ? 'Edit Pemasukan' : 'Tambah Pemasukan Baru'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Kategori Pemasukan</label>
            <div className="relative" ref={categoryDropdownRef}>
              <button
                type="button"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className={cn(
                  "w-full px-4 py-3 text-left bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm transition-all flex items-center justify-between",
                  isCategoryOpen ? "ring-2 ring-primary/20" : "",
                  !formData.source ? "text-slate-400" : "text-slate-900 dark:text-white font-medium"
                )}
              >
                <span>{formData.source || 'Pilih Kategori'}</span>
                <ChevronRight className={cn("w-4 h-4 text-slate-400 transition-transform duration-200", isCategoryOpen ? "rotate-[270deg]" : "rotate-90")} />
              </button>

              {isCategoryOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-1">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, source: category.name });
                          setIsCategoryOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between",
                          formData.source === category.name
                            ? "bg-primary/10 text-primary font-bold"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                        )}
                      >
                        <span>{category.name}</span>
                        {formData.source === category.name && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                    {categories.length === 0 && (
                      <div className="px-3 py-4 text-center text-xs text-slate-400">
                        Belum ada kategori.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Jumlah (Rp)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
                <input
                  type="number"
                  required
                  placeholder="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tanggal</label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none [color-scheme:light] dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Status</label>
            <div className="grid grid-cols-2 gap-3">
              {['Diterima', 'Tertunda'].map((bgStatus) => (
                <button
                  key={bgStatus}
                  type="button"
                  onClick={() => setFormData({ ...formData, status: bgStatus as any })}
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
      </Modal>
    </div>
  );
}
