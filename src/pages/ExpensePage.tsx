import { useState, useEffect, useMemo, useRef } from 'react';
import { Filter, Download, ChevronLeft, ChevronRight, Plus, TrendingUp, ChevronDown, Check, X, Calendar, MoreVertical, Edit, Trash2 } from 'lucide-react';
import type { Expense, Category } from '../types';
import { cn } from '../lib/utils';
import { storage } from '../lib/storage';

export function ExpensePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dateFilter, setDateFilter] = useState<'all' | '30days'>('30days');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Action State
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  // Add Expense Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormCategoryOpen, setIsFormCategoryOpen] = useState(false);
  const [formData, setFormData] = useState({

    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Menunggu' as 'Dibayar' | 'Menunggu',
    description: ''
  });

  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const formCategoryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setExpenses(storage.getExpenses());
    // Fetch categories with type 'expense' and status 'active' (case-insensitive safety)
    setCategories(storage.getCategories().filter(c => c.type.toLowerCase() === 'expense' && c.status === 'active'));

    const handleStorageChange = () => {
        setExpenses(storage.getExpenses());
        setCategories(storage.getCategories().filter(c => c.type.toLowerCase() === 'expense' && c.status === 'active'));
    };
    window.addEventListener('storage-change', handleStorageChange);
    
    const handleClickOutside = (event: MouseEvent) => {
        if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
            setIsCategoryDropdownOpen(false);
        }
        if (formCategoryDropdownRef.current && !formCategoryDropdownRef.current.contains(event.target as Node)) {
            setIsFormCategoryOpen(false);
        }
        if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
            setActiveActionId(null);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
        window.removeEventListener('storage-change', handleStorageChange);
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // --- Filtering Logic ---
  const filteredExpenses = useMemo(() => {
    let filtered = [...expenses];

    // Date Filter
    if (dateFilter === '30days') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filtered = filtered.filter(e => new Date(e.date) >= thirtyDaysAgo);
    }

    // Category Filter
    if (categoryFilter !== 'all') {
        filtered = filtered.filter(e => e.category === categoryFilter);
    }

    // Sort by date desc
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, dateFilter, categoryFilter]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const paginatedExpenses = filteredExpenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // --- Stats Calculation ---
  const stats = useMemo(() => {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      const prevMonthDate = new Date();
      prevMonthDate.setMonth(now.getMonth() - 1);
      const prevMonth = prevMonthDate.getMonth();
      const prevYear = prevMonthDate.getFullYear();

      // 1. Total Expense (Current Month)
      const currentMonthExpenses = expenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });
      const totalCurrentMonth = currentMonthExpenses.reduce((acc, curr) => acc + curr.amount, 0);

      // Previous Month for comparison
      const prevMonthExpensesTotal = expenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
      }).reduce((acc, curr) => acc + curr.amount, 0);

      const trend = prevMonthExpensesTotal === 0 
        ? (totalCurrentMonth > 0 ? 100 : 0) 
        : ((totalCurrentMonth - prevMonthExpensesTotal) / prevMonthExpensesTotal) * 100;

      // 2. Top Category
      const categoryTotals: Record<string, number> = {};
      currentMonthExpenses.forEach(e => {
          categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
      });
      
      const sortedCategories = Object.entries(categoryTotals).sort(([,a], [,b]) => b - a);
      const topCategory = sortedCategories[0]?.[0] || '-';
      const secondCategory = sortedCategories[1]?.[0] || '-';

      // 3. Budget (Mock Logic: Assumed Budget = Total Expense * 1.25 or fixed 10M for demo if total is low)
      // For dynamic feel: Budget is 150% of last month's expense OR default 5.000.000 if no data
      const assumedBudget = Math.max(prevMonthExpensesTotal * 1.2, 5000000); 
      const budgetUsedPercent = assumedBudget === 0 ? 0 : Math.min(100, (totalCurrentMonth / assumedBudget) * 100);

      return {
          totalCurrentMonth,
          trend,
          topCategory,
          secondCategory,
          budgetUsedPercent,
          assumedBudget
      };
  }, [expenses]);

  // --- Handlers ---
  const handleExportCSV = () => {
    const headers = ['ID Transaksi', 'Kategori', 'Tanggal', 'Jumlah', 'Status', 'Deskripsi'];
    const csvContent = [
        headers.join(','),
        ...filteredExpenses.map(e => [
            `"${e.invoiceId}"`,
            `"${e.category}"`,
            e.date,
            e.amount,
            e.status,
            `"${e.description || ''}"`
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `expenses_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleEdit = (expense: Expense) => {
      setEditingId(expense.id);
      setFormData({
          category: expense.category,
          amount: expense.amount.toString(),
          date: expense.date,
          status: expense.status as 'Dibayar' | 'Menunggu',
          description: expense.description || ''
      });
      setIsModalOpen(true);
      setActiveActionId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        const updatedExpenses = expenses.filter(inc => inc.id !== id);
        setExpenses(updatedExpenses);
        storage.saveExpenses(updatedExpenses);
    }
    setActiveActionId(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Menunggu',
        description: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
        // Update existing
        const updatedExpenses = expenses.map(expense => {
            if (expense.id === editingId) {
                return {
                    ...expense,
                    category: formData.category,
                    amount: Number(formData.amount),
                    date: formData.date,
                    status: formData.status,
                    description: formData.description
                };
            }
            return expense;
        });
        setExpenses(updatedExpenses);
        storage.saveExpenses(updatedExpenses);
    } else {
        // Create new
        const newExpense: Expense = {
            id: crypto.randomUUID(),
            invoiceId: `#EXP-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            category: formData.category,
            amount: Number(formData.amount),
            date: formData.date,
            status: formData.status,
            description: formData.description
        };
        
        const updatedExpenses = [newExpense, ...expenses];
        setExpenses(updatedExpenses);
        storage.saveExpenses(updatedExpenses);
    }
    
    handleCloseModal();
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Pengelolaan Pengeluaran</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Monitor dan kelola seluruh biaya operasional bisnis Anda.</p>
      </div>

       {/* Stats Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-terracotta/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 relative z-10">Total Pengeluaran (Bulan Ini)</p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 relative z-10">
                  Rp {stats.totalCurrentMonth.toLocaleString('id-ID')}
              </h3>
              <p className="text-xs font-bold flex items-center gap-1 relative z-10">
                  {stats.trend > 0 ? (
                      <span className="text-terracotta flex items-center"><TrendingUp className="w-3 h-3 mr-1"/>+{stats.trend.toFixed(1)}%</span>
                  ) : (
                      <span className="text-emerald-500 flex items-center"><TrendingUp className="w-3 h-3 mr-1 rotate-180"/>{stats.trend.toFixed(1)}%</span>
                  )}
                   <span className="text-slate-400 font-normal ml-1">vs bulan lalu</span>
              </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 dark:bg-blue-900/10 rounded-bl-full -mr-4 -mt-4"></div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 relative z-10">Kategori Terbanyak</p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 relative z-10 truncate">{stats.topCategory}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 relative z-10">Followed by: <span className="font-bold text-emerald-600 dark:text-emerald-400">{stats.secondCategory}</span></p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 dark:bg-emerald-900/10 rounded-bl-full -mr-4 -mt-4"></div>
              <div className="flex justify-between items-start mb-2 relative z-10">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Budget Terpakai</p>
              </div>
              <div className="flex items-end gap-2 mb-4 relative z-10">
                <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-none">{stats.budgetUsedPercent.toFixed(0)}%</h3>
                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded-full mb-1">
                    Sisa: {(100 - stats.budgetUsedPercent).toFixed(0)}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative z-10">
                  <div 
                    className={cn("h-full rounded-full transition-all", stats.budgetUsedPercent > 90 ? "bg-red-500" : "bg-primary")} 
                    style={{ width: `${stats.budgetUsedPercent}%` }}
                  ></div>
              </div>
          </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-slate-900 p-2 md:p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto md:overflow-visible pb-2 md:pb-0 px-2 shrink-0 scrollbar-hide">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mr-2 shrink-0">
                <Filter className="w-4 h-4" />
                <span>Filters:</span>
            </div>
            
            {/* Custom Category Dropdown */}
            <div className="relative" ref={categoryDropdownRef}>
                <button 
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-sm font-semibold transition-all min-w-[160px] justify-between"
                >
                    <span>{categoryFilter === 'all' ? 'Semua Kategori' : categoryFilter}</span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform", isCategoryDropdownOpen ? "rotate-180" : "")} />
                </button>

                {isCategoryDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-1">
                            <button
                                onClick={() => { setCategoryFilter('all'); setIsCategoryDropdownOpen(false); }}
                                className={cn(
                                    "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between",
                                    categoryFilter === 'all' 
                                        ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white" 
                                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                                )}
                            >
                                <span>Semua Kategori</span>
                                {categoryFilter === 'all' && <Check className="w-4 h-4" />}
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => { setCategoryFilter(cat.name); setIsCategoryDropdownOpen(false); }}
                                    className={cn(
                                        "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between",
                                        categoryFilter === cat.name 
                                            ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white" 
                                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                                    )}
                                >
                                    <span>{cat.name}</span>
                                    {categoryFilter === cat.name && <Check className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <button 
                onClick={() => setDateFilter(prev => prev === '30days' ? 'all' : '30days')}
                className={cn(
                    "px-4 py-2.5 rounded-lg border text-sm font-semibold whitespace-nowrap transition-colors",
                    dateFilter === '30days' 
                        ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-200 dark:text-slate-900"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                )}
            >
                {dateFilter === '30days' ? '30 Hari Terakhir' : 'Semua Waktu'}
            </button>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
             <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex-1 md:flex-none"
             >
                <Plus className="w-4 h-4" />
                <span>Add Expense</span>
            </button>
            <button 
                onClick={handleExportCSV}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-sm transition-all md:w-auto"
            >
                <Download className="w-4 h-4" />
                <span className="hidden md:inline">Export CSV</span>
            </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-visible min-h-[300px]">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">ID Transaksi</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Jumlah</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedExpenses.length > 0 ? (
                  paginatedExpenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta font-bold text-xs">
                            EXP
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{expense.invoiceId}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{expense.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={cn(
                            "px-3 py-1 text-[10px] font-bold uppercase rounded-md tracking-wider",
                            // Dynamic color generation based on char code could be better, but keeping simple
                            "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" 
                        )}>
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-500 dark:text-slate-400 font-medium">
                        {expense.date}
                      </td>
                      <td className="px-6 py-5 text-right font-bold text-terracotta">
                        Rp {expense.amount.toLocaleString('id-ID')}
                      </td>
                       <td className="px-6 py-5">
                         <div className="flex items-center gap-2">
                            <div className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                expense.status === 'Dibayar' ? "bg-emerald-500" : 
                                "bg-amber-500"
                            )}></div>
                            <span className={cn(
                                "text-sm font-bold",
                                expense.status === 'Dibayar' ? "text-emerald-700 dark:text-emerald-400" : 
                                "text-amber-700 dark:text-amber-400"
                            )}>
                                {expense.status}
                            </span>
                         </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="relative">
                            <button 
                                onClick={() => setActiveActionId(activeActionId === expense.id ? null : expense.id)}
                                className="text-slate-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <MoreVertical className="w-4 h-4" />
                            </button>
                            {activeActionId === expense.id && (
                                <div ref={actionMenuRef} className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 z-10 overflow-hidden">
                                    <button 
                                        onClick={() => handleEdit(expense)}
                                        className="w-full text-left px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                                    >
                                        <Edit className="w-4 h-4" />
                                        <span>Edit</span>
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(expense.id)}
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
                  ))
              ) : (
                  <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                          Tidak ada data pengeluaran yang sesuai filter.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredExpenses.length > 0 && (
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Menampilkan <span className="font-bold text-slate-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredExpenses.length)}</span> dari <span className="font-bold text-slate-900 dark:text-white">{filteredExpenses.length}</span> transaksi
                </p>
                 <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary hover:border-primary disabled:opacity-50 flex items-center justify-center transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary hover:border-primary disabled:opacity-50 flex items-center justify-center transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        )}
      </div>

       {/* Add Expense Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingId ? 'Edit Pengeluaran' : 'Tambah Pengeluaran Baru'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">


              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Kategori</label>
                <div className="relative" ref={formCategoryDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsFormCategoryOpen(!isFormCategoryOpen)}
                    className={cn(
                      "w-full px-4 py-3 text-left bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm transition-all flex items-center justify-between",
                      isFormCategoryOpen ? "ring-2 ring-primary/20" : "",
                      !formData.category ? "text-slate-400" : "text-slate-900 dark:text-white font-medium"
                    )}
                  >
                    <span>{formData.category || 'Pilih Kategori'}</span>
                    <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-200", isFormCategoryOpen ? "rotate-180" : "")} />
                  </button>

                  {isFormCategoryOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-1">
                        {categories.map(category => (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() => {
                              setFormData({...formData, category: category.name});
                              setIsFormCategoryOpen(false);
                            }}
                            className={cn(
                              "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between",
                              formData.category === category.name 
                                ? "bg-primary/10 text-primary font-bold" 
                                : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                            )}
                          >
                            <span>{category.name}</span>
                            {formData.category === category.name && <Check className="w-4 h-4" />}
                          </button>
                        ))}
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
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
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
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none [color-scheme:light] dark:[color-scheme:dark]"
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
                  {['Dibayar', 'Menunggu'].map((bgStatus) => (
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

              <div>
                 <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Deskripsi (Opsional)</label>
                 <textarea 
                  placeholder="Tambahkan catatan..."
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400 resize-none"
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                >
                  {editingId ? 'Simpan Perubahan' : 'Simpan Pengeluaran'}
                </button>
              </div>
            </form>
          </div>
        </div>
       )}
    </div>
  );
}
