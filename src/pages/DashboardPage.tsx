import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDown, ArrowUp, Calendar, Plus, DollarSign, Wallet } from 'lucide-react';
import { cn } from '../lib/utils';
import { storage } from '../lib/storage';
import type { Income, Expense } from '../types';

export function DashboardPage() {
  const navigate = useNavigate();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [dateFilter, setDateFilter] = useState<'all' | '30days'>('all');

  useEffect(() => {
    setIncomes(storage.getIncomes());
    setExpenses(storage.getExpenses());

    const handleStorageChange = () => {
      setIncomes(storage.getIncomes());
      setExpenses(storage.getExpenses());
    };

    window.addEventListener('storage-change', handleStorageChange);
    return () => window.removeEventListener('storage-change', handleStorageChange);
  }, []);

  // Filter Data
  const filteredData = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    let filteredIncomes = incomes;
    let filteredExpenses = expenses;

    if (dateFilter === '30days') {
        filteredIncomes = incomes.filter(i => new Date(i.date) >= thirtyDaysAgo);
        filteredExpenses = expenses.filter(e => new Date(e.date) >= thirtyDaysAgo);
    }
    
    return { incomes: filteredIncomes, expenses: filteredExpenses };
  }, [incomes, expenses, dateFilter]);

  // Calculate stats
  // Only count 'Diterima' incomes and 'Dibayar' expenses for the main balance and totals
  const totalIncome = filteredData.incomes
      .filter(i => i.status === 'Diterima')
      .reduce((acc, curr) => acc + curr.amount, 0);
      
  const totalExpense = filteredData.expenses
      .filter(e => e.status === 'Dibayar')
      .reduce((acc, curr) => acc + curr.amount, 0);
      
  const balance = totalIncome - totalExpense;

  // Calculate Trends (Current Month vs Previous Month)
  const trends = useMemo(() => {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      const prevMonthDate = new Date();
      prevMonthDate.setMonth(now.getMonth() - 1);
      const prevMonth = prevMonthDate.getMonth();
      const prevYear = prevMonthDate.getFullYear();

      const getMonthlyTotal = (data: {date: string, amount: number, status: string}[], month: number, year: number, type: 'income' | 'expense') => {
          return data.filter(item => {
              const d = new Date(item.date);
              // Filter by status for trends as well to match main stats
              const isValidStatus = type === 'income' ? item.status === 'Diterima' : item.status === 'Dibayar';
              return d.getMonth() === month && d.getFullYear() === year && isValidStatus;
          }).reduce((acc, curr) => acc + curr.amount, 0);
      };

      const currentMonthIncome = getMonthlyTotal(incomes, currentMonth, currentYear, 'income');
      const prevMonthIncome = getMonthlyTotal(incomes, prevMonth, prevYear, 'income');
      
      const currentMonthExpense = getMonthlyTotal(expenses, currentMonth, currentYear, 'expense');
      const prevMonthExpense = getMonthlyTotal(expenses, prevMonth, prevYear, 'expense');

      const calculateTrend = (current: number, prev: number) => {
          if (prev === 0) return current > 0 ? 100 : 0;
          return ((current - prev) / prev) * 100;
      };

      return {
          incomeTrend: calculateTrend(currentMonthIncome, prevMonthIncome),
          incomeDiff: currentMonthIncome - prevMonthIncome,
          expenseTrend: calculateTrend(currentMonthExpense, prevMonthExpense),
          expenseDiff: currentMonthExpense - prevMonthExpense // Positive means spent more (bad usually), Negative means saved
      };

  }, [incomes, expenses]);


  const [transactionType, setTransactionType] = useState<'all' | 'income' | 'expense'>('all');

  // Combine and sort transactions for recent list
  const recentTransactions = [
    ...filteredData.incomes.map(i => ({
      id: i.id,
      date: i.date,
      description: i.source, 
      category: 'Pemasukan',
      amount: i.amount,
      type: 'income' as const,
      icon: DollarSign,
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
      iconColor: 'text-emerald-700 dark:text-emerald-400',
      categoryBg: 'bg-emerald-100 dark:bg-emerald-900/30',
      categoryColor: 'text-emerald-700 dark:text-emerald-400',
      status: i.status
    })),
    ...filteredData.expenses.map(e => ({
      id: e.id,
      date: e.date,
      description: e.description || e.invoiceId,
      category: e.category,
      amount: -e.amount,
      type: 'expense' as const,
      icon: Wallet,
      iconBg: 'bg-terracotta/10',
      iconColor: 'text-terracotta',
      categoryBg: 'bg-slate-100 dark:bg-slate-800',
      categoryColor: 'text-slate-600 dark:text-slate-400',
      status: e.status
    }))
  ]
  .filter(t => transactionType === 'all' || t.type === transactionType)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 5);

  const formatCurrency = (val: number) => {
      // Use abs for display, handle negative sign in UI
      return `Rp ${Math.abs(val).toLocaleString('id-ID')}`;
  };

  const formatShortCurrency = (val: number) => {
      if (Math.abs(val) >= 1000000000) return `Rp ${(Math.abs(val) / 1000000000).toFixed(1)}M`;
      if (Math.abs(val) >= 1000000) return `Rp ${(Math.abs(val) / 1000000).toFixed(1)}Jt`;
      if (Math.abs(val) >= 1000) return `Rp ${(Math.abs(val) / 1000).toFixed(0)}rb`;
      return `Rp ${Math.abs(val)}`;
  };
  
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  return (
    <div className="space-y-8 pb-20">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Ringkasan Keuangan</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Selamat datang kembali. Berikut ringkasan keuangan Anda hari ini.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setDateFilter(prev => prev === 'all' ? '30days' : 'all')}
            className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-bold transition-all",
                dateFilter === '30days' 
                    ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white" 
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
            )}
          >
            <Calendar className="w-5 h-5" />
            <span>{dateFilter === '30days' ? '30 Hari Terakhir' : 'Semua Waktu'}</span>
          </button>
          
          <div className="relative">
            <button 
                onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
            >
                <Plus className="w-5 h-5" />
                <span>Tambah Transaksi</span>
            </button>
            {isAddMenuOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsAddMenuOpen(false)}></div>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <button 
                            onClick={() => navigate('/pemasukan')}
                            className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                        >
                            <DollarSign className="w-4 h-4 text-emerald-500" />
                            <span>Pemasukan</span>
                        </button>
                        <button 
                            onClick={() => navigate('/pengeluaran')}
                            className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                        >
                            <Wallet className="w-4 h-4 text-terracotta" />
                            <span>Pengeluaran</span>
                        </button>
                    </div>
                </>
            )}
          </div>
        </div>
      </div>

      {/* Bento Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Income Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 dark:bg-emerald-900/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ArrowDown className="w-6 h-6" />
            </div>
            {/* Trend logic is fine as is, effectively compares realized amounts */}
            <span className={cn("text-xs font-bold px-2 py-1 rounded-lg", trends.incomeTrend >= 0 ? "text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400" : "text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400")}>
                {trends.incomeTrend > 0 ? '+' : ''}{trends.incomeTrend.toFixed(1)}%
            </span>
          </div>
          <div className="relative z-10">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total Pemasukan</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">{formatCurrency(totalIncome)}</h3>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center text-xs text-slate-400 font-bold relative z-10">
            <span className={cn("font-extrabold mr-1", trends.incomeDiff >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500")}>
                {trends.incomeDiff >= 0 ? '+' : '-'}{formatShortCurrency(trends.incomeDiff)}
            </span> 
            {trends.incomeDiff >= 0 ? ' lebih banyak' : ' berkurang'} vs bulan lalu
          </div>
        </div>

        {/* Expense Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-terracotta/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta">
              <ArrowUp className="w-6 h-6" />
            </div>
            {/* Expense trend: More expense (positive trend) is usually red, Less expense (negative trend) is green */}
            <span className={cn("text-xs font-bold px-2 py-1 rounded-lg", trends.expenseTrend <= 0 ? "text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400" : "text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400")}>
                 {trends.expenseTrend > 0 ? '+' : ''}{trends.expenseTrend.toFixed(1)}%
            </span>
          </div>
          <div className="relative z-10">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total Pengeluaran</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">{formatCurrency(totalExpense)}</h3>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center text-xs text-slate-400 font-bold relative z-10">
             <span className={cn("font-extrabold mr-1", trends.expenseDiff <= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-terracotta")}>
                {trends.expenseDiff <= 0 ? '-' : '+'}{formatShortCurrency(trends.expenseDiff)}
            </span>
             {trends.expenseDiff <= 0 ? ' lebih hemat' : ' lebih boros'} vs bulan lalu
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-slate-900 dark:bg-primary/20 p-6 rounded-2xl shadow-xl border border-slate-800 flex flex-col justify-between hover:shadow-2xl transition-all relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-2xl">account_balance</span>
            </div>
            <span className="text-xs font-bold text-white/60 bg-white/10 px-2 py-1 rounded-lg">+12.5% Yield</span>
          </div>
          <div className="relative z-10">
            <p className="text-sm font-bold text-slate-400 dark:text-primary/70 mb-1 uppercase tracking-wider">Saldo Saat Ini</p>
            <h3 className="text-4xl font-extrabold text-white">{balance < 0 ? '-' : ''} {formatCurrency(balance)}</h3>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center text-xs text-slate-400 font-bold relative z-10">
             Status Keuangan: <span className="text-white font-extrabold mx-1">{balance >= 0 ? 'Sehat' : 'Defisit'}</span>
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Transaksi Terakhir</h3>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(['all', 'income', 'expense'] as const).map((type) => (
                <button
                    key={type}
                    onClick={() => setTransactionType(type)}
                    className={cn(
                        "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                        transactionType === type 
                            ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" 
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    )}
                >
                    {type === 'all' ? 'Semua' : type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Deskripsi</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-5 text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">{tx.date}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", tx.iconBg)}>
                        <tx.icon className={cn("w-4 h-4", tx.iconColor)} />
                      </div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{tx.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn("px-2.5 py-1 text-[10px] font-bold uppercase rounded-md tracking-wider whitespace-nowrap", tx.categoryBg, tx.categoryColor)}>
                      {tx.category}
                    </span>
                  </td>
                  <td className={cn("px-6 py-5 text-right font-bold whitespace-nowrap", tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-terracotta')}>
                    {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                  </td>
                </tr>
              ))}
              {recentTransactions.length === 0 && (
                 <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-500 font-medium">
                        Belum ada transaksi {transactionType !== 'all' ? (transactionType === 'income' ? 'pemasukan' : 'pengeluaran') : ''} terbaru.
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
