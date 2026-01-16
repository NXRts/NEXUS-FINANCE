import { useState, useEffect } from 'react';
import { ArrowDown, ArrowUp, Calendar, Plus, DollarSign, Wallet } from 'lucide-react';
import { cn } from '../lib/utils';
import { storage } from '../lib/storage';
import type { Income, Expense } from '../types';

export function DashboardPage() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

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

  // Calculate stats
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  // Combine and sort transactions for recent list
  const recentTransactions = [
    ...incomes.map(i => ({
      id: i.id,
      date: i.date,
      description: i.clientName, // Using client name as description for income
      category: 'Income',
      amount: i.amount,
      type: 'income' as const,
      icon: DollarSign,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      categoryBg: 'bg-emerald-100 dark:bg-emerald-900/30',
      categoryColor: 'text-emerald-700 dark:text-emerald-400'
    })),
    ...expenses.map(e => ({
      id: e.id,
      date: e.date,
      description: e.vendor, // Using vendor as description for expense
      category: e.category,
      amount: -e.amount,
      type: 'expense' as const,
      icon: Wallet,
      iconBg: 'bg-slate-100 dark:bg-slate-800',
      iconColor: 'text-slate-500',
      categoryBg: 'bg-slate-100 dark:bg-slate-800',
      categoryColor: 'text-slate-600 dark:text-slate-400'
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Dashboard Overview</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Good morning, Alex. Here's what's happening with your finances today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all">
            <Calendar className="w-5 h-5" />
            <span>Last 30 Days</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
            <Plus className="w-5 h-5" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Bento Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Income Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <ArrowDown className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded">+12.5%</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Total Income</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">Rp {totalIncome.toLocaleString('id-ID')}</h3>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center text-xs text-slate-400 font-medium">
            <span className="text-primary font-bold mr-1">Rp 5.2M</span> gained since last month
          </div>
        </div>

        {/* Expense Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta">
              <ArrowUp className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded">-5.2%</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Total Expense</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">Rp {totalExpense.toLocaleString('id-ID')}</h3>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center text-xs text-slate-400 font-medium">
            <span className="text-terracotta font-bold mr-1">Rp 800k</span> saved from last month
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-slate-900 dark:bg-primary/20 p-6 rounded-2xl shadow-xl border border-slate-800 flex flex-col justify-between hover:shadow-2xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-2xl">account_balance</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400 dark:text-primary/70 mb-1">Current Balance</p>
            <h3 className="text-3xl font-extrabold text-white">Rp {balance.toLocaleString('id-ID')}</h3>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center text-xs text-slate-400 font-medium">
            Managed across <span className="text-white font-bold mx-1">4 accounts</span>
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
          <button className="text-sm font-bold text-primary hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-5 text-sm font-medium text-slate-600 dark:text-slate-400">{tx.date}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-8 h-8 rounded flex items-center justify-center", tx.iconBg)}>
                        <tx.icon className={cn("w-4 h-4", tx.iconColor)} />
                      </div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{tx.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn("px-2.5 py-1 text-[10px] font-bold uppercase rounded tracking-wider", tx.categoryBg, tx.categoryColor)}>
                      {tx.category}
                    </span>
                  </td>
                  <td className={cn("px-6 py-5 text-right font-bold", tx.type === 'income' ? 'text-primary' : 'text-terracotta')}>
                    {tx.type === 'income' ? '+' : '-'} Rp {Math.abs(tx.amount).toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
              {recentTransactions.length === 0 && (
                 <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                        No recent transactions found.
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
