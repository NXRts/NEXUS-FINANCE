import { useState, useEffect } from 'react';
import { Download, TrendingUp, TrendingDown, Wallet, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from '../lib/utils';
import { storage } from '../lib/storage';
import type { Expense } from '../types';

const trendData = [
  { name: 'JAN', income: 4000, expense: 2400 },
  { name: 'FEB', income: 3000, expense: 1398 },
  { name: 'MAR', income: 2000, expense: 9800 },
  { name: 'APR', income: 2780, expense: 3908 },
  { name: 'MAY', income: 1890, expense: 4800 },
  { name: 'JUN', income: 2390, expense: 3800 },
];

const COLORS = ['#007a6c', '#10b981', '#f59e0b', '#cbd5e1', '#ef4444', '#3b82f6'];

const performanceData = [
    { type: 'Highest Expense Category', value: 'Technology / $19,750', prev: '$15,200', change: '+29.9%', trend: 'up', icon: TrendingDown, color: 'bg-rose-100 text-rose-600' },
    { type: 'Average Monthly Income', value: '$24,533.00', prev: '$20,800.00', change: '+10.8%', trend: 'up', icon: Wallet, color: 'bg-emerald-100 text-emerald-600' },
    { type: 'Total Savings Rate', value: '28.4%', prev: '24.1%', change: '+4.3%', trend: 'up', icon: TrendingUp, color: 'bg-blue-100 text-blue-600' },
    { type: 'Utility Efficiency', value: '$420.00', prev: '$450.00', change: '-6.6%', trend: 'down', icon: Zap, color: 'bg-purple-100 text-purple-600' },
];

export function ReportsPage() {
  const [dateFilter, setDateFilter] = useState('This Month');
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    setExpenses(storage.getExpenses());
  }, []);

  // Calculate expenses by category
  const expensesByCategory = expenses.reduce((acc, curr) => {
    if (!acc[curr.category]) {
      acc[curr.category] = 0;
    }
    acc[curr.category] += curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(expensesByCategory).map(([name, value], index) => ({
    name,
    value,
    color: COLORS[index % COLORS.length]
  }));

  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Reports & Analytics</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Detailed overview of your financial performance</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center">
                {['This Month', 'Last 6 Months', 'Year to Date'].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setDateFilter(filter)}
                        className={cn(
                            "px-4 py-2 text-sm font-bold rounded-lg transition-all",
                            dateFilter === filter 
                                ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" 
                                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                        )}
                    >
                        {filter}
                    </button>
                ))}
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all">
                <Download className="w-4 h-4" />
                <span>Export Report</span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expense Trends */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-start mb-6">
                <div>
                   <h3 className="text-lg font-bold text-slate-900 dark:text-white">Income vs. Expense Trends</h3>
                   <div className="flex items-center gap-4 mt-2">
                       <div className="flex items-center gap-2">
                           <span className="w-3 h-3 rounded-full bg-primary/20 border-2 border-primary"></span>
                           <span className="text-xs font-bold text-slate-500">Income</span>
                       </div>
                       <div className="flex items-center gap-2">
                           <span className="w-3 h-3 rounded-full bg-slate-100 border-2 border-slate-300 dark:bg-slate-800 dark:border-slate-600"></span>
                           <span className="text-xs font-bold text-slate-500">Expenses</span>
                       </div>
                   </div>
                </div>
                <div className="text-right">
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">$45,200.00</h3>
                    <p className="text-xs font-bold text-emerald-500 flex items-center justify-end gap-1">
                        <TrendingUp className="w-3 h-3" />
                         +12.5%
                    </p>
                </div>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#007a6c" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#007a6c" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area type="monotone" dataKey="income" stroke="#007a6c" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                        <Area type="monotone" dataKey="expense" stroke="#cbd5e1" strokeDasharray="5 5" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Expenses by Category */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Expenses by Category</h3>
            <div className="flex-1 flex items-center justify-center relative">
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <p className="text-sm text-slate-400 font-medium">Total</p>
                     <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">
                        Rp {(totalExpense / 1000000).toFixed(1)}M
                     </h4>
                 </div>
                 <div className="w-full h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                innerRadius={80}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                 </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
                {categoryData.map((cat) => (
                    <div key={cat.name} className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></span>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                          {cat.name} ({Math.round((cat.value / totalExpense) * 100)}%)
                        </span>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Monthly Net Growth - Placeholder for simple bar chart usage if needed, or keeping it clean as in previous step not fully visible */}
       <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                     <h3 className="text-lg font-bold text-slate-900 dark:text-white">Monthly Net Growth</h3>
                     <p className="text-xs text-slate-500">Net profit after all expenditures</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold">
                    <span>Avg Growth:</span>
                    <span>+$2,105/mo</span>
                </div>
            </div>
            <div className="h-[150px] w-full flex items-end justify-between gap-2">
                {[40, 65, 30, 80, 55, 90, 70, 45].map((h, i) => (
                    <div key={i} className="w-full bg-slate-50 dark:bg-slate-800 rounded-t-lg relative group h-full flex items-end">
                        <div 
                            className="w-full bg-emerald-500/20 group-hover:bg-emerald-500 dark:bg-emerald-500/10 dark:group-hover:bg-emerald-500 transition-all rounded-t-lg mx-auto" 
                            style={{ width: '60%', height: `${h}%` }}
                        ></div>
                         <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 uppercase">
                             {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'][i]}
                         </p>
                    </div>
                ))}
            </div>
       </div>

      {/* Performance Indicators */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
             <h3 className="text-lg font-bold text-slate-900 dark:text-white">Performance Indicators</h3>
             <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                 View All <ChevronRight className="w-3 h-3" />
             </button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Insight Type</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Current Value</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Previous Period</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Change</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Trend</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {performanceData.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", item.color)}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.type}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">{item.value}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">{item.prev}</td>
                                <td className="px-6 py-4">
                                     <span className={cn(
                                         "text-xs font-bold", 
                                         item.change.startsWith('+') ? "text-emerald-500" : "text-rose-500"
                                     )}>
                                         {item.change}
                                     </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <TrendingUp className={cn(
                                        "w-4 h-4 ml-auto",
                                        item.trend === 'up' ? "text-emerald-500" : "text-rose-500 rotate-180"
                                    )} />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}

function ChevronRight({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
    )
}
