import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import type { Expense } from '../types';

const mockExpenses: Expense[] = [
  { id: '1', vendor: 'AWS Web Services', category: 'Technology', amount: 1200000, date: '2023-10-24', proofOfPayment: 'receipt-aws.pdf' },
  { id: '2', vendor: 'Paper.id', category: 'Office Supplies', amount: 450000, date: '2023-10-22' },
  { id: '3', vendor: 'IndiHome', category: 'Utilities', amount: 600000, date: '2023-10-20' },
];

export function ExpensePage() {
  const [expenses] = useState<Expense[]>(mockExpenses);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Pengeluaran</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Manage and track company expenses.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-terracotta text-white text-sm font-bold shadow-lg shadow-terracotta/20 hover:opacity-90 transition-all">
          <Plus className="w-5 h-5" />
          <span>New Expense</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search vendor..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-terracotta/20 outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Proof</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-terracotta/10 flex items-center justify-center text-terracotta text-xs font-bold">
                        {expense.vendor.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{expense.vendor}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase rounded tracking-wider">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                    {expense.date}
                  </td>
                   <td className="px-6 py-4 text-sm">
                    {expense.proofOfPayment ? (
                      <span className="text-primary hover:underline cursor-pointer font-medium">View</span>
                    ) : (
                      <span className="text-slate-400 italic">No receipt</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-terracotta">
                    - Rp {expense.amount.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-terracotta transition-colors">
                      <span className="material-symbols-outlined text-lg">more_vert</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
