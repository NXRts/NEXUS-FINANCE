import { useState } from 'react';
import { Filter, Download, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import type { Expense } from '../types';
import { cn } from '../lib/utils';

const mockExpenses: Expense[] = [
  { id: '1', vendor: 'Amazon Web Services', category: 'Technology', amount: 18250000, date: '12 Okt 2023', status: 'Dibayar', description: 'Cloud Infrastructure', proofOfPayment: 'receipt.pdf' },
  { id: '2', vendor: 'Office Space Rent', category: 'Utility', amount: 15000000, date: '01 Okt 2023', status: 'Dibayar', description: 'South Jakarta Tower', proofOfPayment: 'receipt.pdf' },
  { id: '3', vendor: 'Facebook Ads', category: 'Marketing', amount: 8450000, date: '08 Okt 2023', status: 'Menunggu', description: 'Q4 Campaign', proofOfPayment: 'receipt.pdf' },
  { id: '4', vendor: 'Slack Subscription', category: 'Technology', amount: 3500000, date: '15 Okt 2023', status: 'Dibayar', description: 'Standard Plan', proofOfPayment: 'receipt.pdf' },
];

export function ExpensePage() {
  const [expenses] = useState<Expense[]>(mockExpenses);

  return (
    <div className="space-y-8">
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
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 relative z-10">Rp 45.200.000</h3>
              <p className="text-xs font-bold text-terracotta flex items-center gap-1 relative z-10">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  +12.5% vs bulan lalu
              </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 dark:bg-blue-900/10 rounded-bl-full -mr-4 -mt-4"></div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 relative z-10">Kategori Terbanyak</p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 relative z-10">Technology</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 relative z-10">Followed by: <span className="font-bold text-emerald-600 dark:text-emerald-400">Marketing</span></p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 dark:bg-emerald-900/10 rounded-bl-full -mr-4 -mt-4"></div>
              <div className="flex justify-between items-start mb-2 relative z-10">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Budget Terpakai</p>
              </div>
              <div className="flex items-end gap-2 mb-4 relative z-10">
                <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-none">78%</h3>
                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded-full mb-1">Sisa: 22%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative z-10">
                  <div className="h-full bg-primary rounded-full" style={{ width: '78%' }}></div>
              </div>
          </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-slate-900 p-2 md:p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 px-2">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mr-2">
                <Filter className="w-4 h-4" />
                <span>Filters:</span>
            </div>
            <button className="px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 whitespace-nowrap">
                Semua Kategori
            </button>
            <button className="px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 whitespace-nowrap">
                30 Hari Terakhir
            </button>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-sm transition-all w-full md:w-auto justify-center md:justify-start">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Jumlah</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Bukti</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta font-bold text-sm">
                        {expense.vendor.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{expense.vendor}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{expense.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn(
                        "px-3 py-1 text-[10px] font-bold uppercase rounded-md tracking-wider",
                        expense.category === 'Technology' && "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
                        expense.category === 'Utility' && "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
                        expense.category === 'Marketing' && "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
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
                            expense.status === 'Dibayar' ? "bg-emerald-500" : "bg-slate-400"
                        )}></div>
                        <span className={cn(
                            "text-sm font-bold",
                            expense.status === 'Dibayar' ? "text-emerald-700 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"
                        )}>
                            {expense.status}
                        </span>
                     </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <button className="text-slate-400 hover:text-primary transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
                Menampilkan <span className="font-bold text-slate-900 dark:text-white">1 - 4</span> dari <span className="font-bold text-slate-900 dark:text-white">48</span> transaksi
            </p>
             <div className="flex items-center gap-2">
                <button className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary hover:border-primary disabled:opacity-50 flex items-center justify-center transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-lg bg-primary text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-primary/20">1</button>
                <button className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-medium flex items-center justify-center hover:border-primary hover:text-primary transition-colors">2</button>
                <button className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-medium flex items-center justify-center hover:border-primary hover:text-primary transition-colors">3</button>
                <button className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary hover:border-primary flex items-center justify-center transition-colors">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
      </div>
      
       {/* Footer */}
       <div className="text-center py-6">
           <p className="text-sm text-slate-400">
               Butuh bantuan? <a href="#" className="font-bold text-primary hover:underline">Hubungi Support</a> atau <a href="#" className="font-bold text-primary hover:underline">Buka Dokumentasi</a>
           </p>
       </div>
    </div>
  );
}
