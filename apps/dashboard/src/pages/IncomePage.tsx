import { useState } from 'react';
import { Plus, Search, Filter, Calendar, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import type { Income } from '../types';
import { cn } from '../lib/utils';

const mockIncomes: Income[] = [
  { id: '1', invoiceId: '#INV-2023-001', clientName: 'Budi Santoso', amount: 5000000, date: '12 Okt 2023', status: 'Lunas', description: 'Web Development' },
  { id: '2', invoiceId: '#INV-2023-002', clientName: 'Siti Aminah', amount: 1250000, date: '14 Okt 2023', status: 'Pending', description: 'Logo Design' },
  { id: '3', invoiceId: '#INV-2023-003', clientName: 'PT. Teknologi Maju', amount: 15700000, date: '15 Okt 2023', status: 'Lunas', description: 'App Development' },
  { id: '4', invoiceId: '#INV-2023-004', clientName: 'Andi Ramadhan', amount: 450000, date: '18 Okt 2023', status: 'Batal', description: 'Consultation' },
  { id: '5', invoiceId: '#INV-2023-005', clientName: 'Diana Maria', amount: 2800000, date: '20 Okt 2023', status: 'Lunas', description: 'Social Media Management' },
];

export function IncomePage() {
  const [incomes] = useState<Income[]>(mockIncomes);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Pemasukan</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Pantau dan kelola seluruh catatan pendapatan dari klien Anda secara real-time.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
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
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all">
                <Calendar className="w-5 h-5" />
                <span>30 Hari Terakhir</span>
            </button>
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all">
                <Filter className="w-5 h-5" />
                <span>Filter</span>
            </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Invoice ID</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Klien</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Jumlah</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {incomes.map((income) => (
                <tr key={income.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-5 text-sm font-bold text-primary">
                    {income.invoiceId}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                        {income.clientName.substring(0, 2)}
                      </div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{income.clientName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-500 dark:text-slate-400 font-medium">
                    {income.date}
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn(
                        "px-3 py-1 text-xs font-bold rounded-full",
                        income.status === 'Lunas' && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                        income.status === 'Pending' && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                        income.status === 'Batal' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                    )}>
                      {income.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right font-bold text-slate-900 dark:text-white">
                    Rp {income.amount.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="text-slate-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
                Menampilkan <span className="font-bold text-slate-900 dark:text-white">1-5</span> dari <span className="font-bold text-slate-900 dark:text-white">156</span> data
            </p>
            <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary hover:border-primary disabled:opacity-50">
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-lg bg-primary text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-primary/20">1</button>
                <button className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-medium flex items-center justify-center hover:border-primary hover:text-primary transition-colors">2</button>
                <button className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-medium flex items-center justify-center hover:border-primary hover:text-primary transition-colors">3</button>
                <span className="text-slate-400 px-1">...</span>
                <button className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-medium flex items-center justify-center hover:border-primary hover:text-primary transition-colors">12</button>
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
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Rp 245.800.000</h3>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  +12.5% dari bulan lalu
              </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Invoice Pending</p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">24</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Menunggu konfirmasi pembayaran</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Rata-Rata Pendapatan</p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Rp 8.200.000</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Dihitung per invoice lunas</p>
          </div>
      </div>
    </div>
  );
}
