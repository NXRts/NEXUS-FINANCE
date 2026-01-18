import { useState, useEffect, useMemo } from 'react';
import { Download, TrendingUp, TrendingDown, Wallet, Zap, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from '../lib/utils';
import { storage } from '../lib/storage';
import type { Expense, Income } from '../types';

const COLORS = ['#007a6c', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899', '#f97316'];

export function ReportsPage() {
  const [dateFilter, setDateFilter] = useState('Last 6 Months');
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    // Load data from storage
    const loadedIncomes = storage.getIncomes();
    const loadedExpenses = storage.getExpenses();
    setIncomes(loadedIncomes);
    setExpenses(loadedExpenses);
  }, []);

  // --- Helper Functions ---

  const getMonthKey = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };
  
  const formatCompactCurrency = (amount: number) => {
      if (amount >= 1000000000) return `Rp ${(amount / 1000000000).toFixed(1)}M`;
      if (amount >= 1000000) return `Rp ${(amount / 1000000).toFixed(1)}Jt`;
      return `Rp ${(amount / 1000).toFixed(0)}kb`;
  };

  // --- Calculations ---

  // 1. Trend Data (Income vs Expense over time)
  const trendData = useMemo(() => {
    const dataMap: Record<string, { name: string; income: number; expense: number; sortKey: string }> = {};
    
    const now = new Date();
    
    if (dateFilter === 'This Month') {
        // Daily breakdown for the current month
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        
        for (let i = 1; i <= daysInMonth; i++) {
             // Create date string YYYY-MM-DD
             const dayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
             const displayDate = String(i).padStart(2, '0');
             dataMap[dayStr] = { name: displayDate, income: 0, expense: 0, sortKey: dayStr };
        }

        incomes.forEach(item => {
            const dateOnly = item.date.split('T')[0];
            if (dataMap[dateOnly]) dataMap[dateOnly].income += item.amount;
        });

        expenses.forEach(item => {
             const dateOnly = item.date.split('T')[0];
             if (dataMap[dateOnly]) dataMap[dateOnly].expense += item.amount;
        });

    } else {
        // Monthly breakdown
        let monthsToShow = 6;
        if (dateFilter === 'Year to Date') monthsToShow = now.getMonth() + 1;

        // Initialize last N months
        for (let i = monthsToShow - 1; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const name = d.toLocaleString('default', { month: 'short' }).toUpperCase();
            dataMap[key] = { name, income: 0, expense: 0, sortKey: key };
        }

        incomes.forEach(item => {
            const key = getMonthKey(item.date);
            if (dataMap[key]) dataMap[key].income += item.amount;
        });

        expenses.forEach(item => {
            const key = getMonthKey(item.date);
            if (dataMap[key]) dataMap[key].expense += item.amount;
        });
    }

    return Object.values(dataMap).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  }, [incomes, expenses, dateFilter]);


  // 2. Expenses by Category (Overall or filtered by time?) 
  // Let's make it reflect the current `dateFilter` logic roughly, or just "All Time" for broader view?
  // Usually reports match the filter. Let's filter expenses by the range in `trendData`.
  const categoryData = useMemo(() => {
      const activeMonths = new Set(trendData.map(d => d.sortKey));
      
      const filteredExpenses = expenses.filter(e => {
        if (dateFilter === 'This Month') {
             // For daily view, match string keys YYYY-MM-DD
             return activeMonths.has(e.date.split('T')[0]);
        }
        return activeMonths.has(getMonthKey(e.date));
      });
      
      const catMap: Record<string, number> = {};
      filteredExpenses.forEach(e => {
          catMap[e.category] = (catMap[e.category] || 0) + e.amount;
      });

      // const total = Object.values(catMap).reduce((a, b) => a + b, 0);

      return Object.entries(catMap)
        .map(([name, value], index) => ({
            name,
            value,
            color: COLORS[index % COLORS.length]
        }))
        .sort((a, b) => b.value - a.value); // Sort highest first
  }, [expenses, trendData]);

  const totalFilteredExpense = categoryData.reduce((acc, curr) => acc + curr.value, 0);


  // 3. Performance Indicators (Comparison: This Month vs Last Month)
  const kpiData = useMemo(() => {
      const now = new Date();
      const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthKey = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;

      const calcMonthTotal = (items: (Income | Expense)[], key: string) => 
          items.filter(i => getMonthKey(i.date) === key).reduce((sum, i) => sum + i.amount, 0);

      const currIncome = calcMonthTotal(incomes, currentMonthKey);
      const prevIncome = calcMonthTotal(incomes, lastMonthKey);
      
      const currExpense = calcMonthTotal(expenses, currentMonthKey);
      const prevExpense = calcMonthTotal(expenses, lastMonthKey);

      const currSavings = currIncome - currExpense;
      const prevSavings = prevIncome - prevExpense;
      const currSavingsRate = currIncome > 0 ? (currSavings / currIncome) * 100 : 0;
      const prevSavingsRate = prevIncome > 0 ? (prevSavings / prevIncome) * 100 : 0;

      const getChange = (curr: number, prev: number) => {
          if (prev === 0) return curr > 0 ? '+100%' : '0%';
          const percent = ((curr - prev) / prev) * 100;
          return `${percent > 0 ? '+' : ''}${percent.toFixed(1)}%`;
      };

      const getTrend = (curr: number, prev: number) => curr >= prev ? 'up' : 'down';
      const getInverseTrend = (curr: number, prev: number) => curr <= prev ? 'up' : 'down'; // Less expense is 'up' (good)

      return [
          { 
              type: 'Total Income', 
              value: formatCompactCurrency(currIncome), 
              prev: formatCompactCurrency(prevIncome), 
              change: getChange(currIncome, prevIncome), 
              trend: getTrend(currIncome, prevIncome),
              icon: Wallet, 
              color: 'bg-emerald-100 text-emerald-600' 
          },
          { 
              type: 'Total Expense', 
              value: formatCompactCurrency(currExpense), 
              prev: formatCompactCurrency(prevExpense), 
              change: getChange(currExpense, prevExpense), 
              trend: getInverseTrend(currExpense, prevExpense), // Lower is better visual, but technically 'up' arrow might mean increase. Let's use standard: Green if good. 
              // Actually implementation below uses `item.trend === 'up'` -> green. So if expense dropped, we want 'up' (green).
              isExpense: true,
              icon: TrendingDown, 
              color: 'bg-rose-100 text-rose-600' 
          },
          { 
              type: 'Net Savings', 
              value: formatCompactCurrency(currSavings), 
              prev: formatCompactCurrency(prevSavings), 
              change: getChange(currSavings, prevSavings), 
              trend: getTrend(currSavings, prevSavings),
              icon: Calendar, // Using Calendar as 'Month End Result' icon
              color: 'bg-blue-100 text-blue-600' 
          },
          { 
              type: 'Savings Rate', 
              value: `${currSavingsRate.toFixed(1)}%`, 
              prev: `${prevSavingsRate.toFixed(1)}%`, 
              change: getChange(currSavingsRate, prevSavingsRate), 
              trend: getTrend(currSavingsRate, prevSavingsRate),
              icon: Zap, 
              color: 'bg-purple-100 text-purple-600' 
          },
      ];
  }, [incomes, expenses]);

  // --- Export ---
  const handleExport = () => {
      const csvRows = [];
      csvRows.push(['Date', 'Type', 'Category/Source', 'Description', 'Amount', 'Status']);
      
      incomes.forEach(i => csvRows.push([i.date, 'Income', i.source, i.description || '', i.amount, i.status]));
      expenses.forEach(e => csvRows.push([e.date, 'Expense', e.category, e.description || '', e.amount, e.status]));

      const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `finance_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

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
            <button 
                onClick={handleExport}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all">
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
                {/* 
                <div className="text-right">
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">$45,200.00</h3>
                    <p className="text-xs font-bold text-emerald-500 flex items-center justify-end gap-1">
                        <TrendingUp className="w-3 h-3" />
                         +12.5%
                    </p>
                </div> 
                */}
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
                            formatter={(value: any) => formatCurrency(value)}
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
                        {formatCompactCurrency(totalFilteredExpense)}
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
                            <Tooltip formatter={(value: any) => formatCurrency(value)} />
                        </PieChart>
                    </ResponsiveContainer>
                 </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-6 max-h-[150px] overflow-y-auto no-scrollbar">
                {categoryData.length > 0 ? categoryData.map((cat) => (
                    <div key={cat.name} className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }}></span>
                        <div className="flex flex-col">
                             <span className="text-xs font-bold text-slate-600 dark:text-slate-400 line-clamp-1" title={cat.name}>
                               {cat.name}
                             </span>
                             <span className="text-[10px] text-slate-400">
                                {Math.round((cat.value / totalFilteredExpense) * 100)}%
                             </span>
                        </div>
                    </div>
                )) : (
                    <p className="text-xs text-slate-400 col-span-2 text-center">No expenses in this period.</p>
                )}
            </div>
        </div>
      </div>

      {/* Monthly Net Growth Chart */}
       <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                     <h3 className="text-lg font-bold text-slate-900 dark:text-white">Monthly Net Growth</h3>
                     <p className="text-xs text-slate-500">Net profit (Income - Expense) over time</p>
                </div>
            </div>
            <div className="h-[150px] w-full flex items-end justify-between gap-2">
                {trendData.map((data, i) => {
                    const net = data.income - data.expense;
                    // Find max absolute net value to scale bars relative to max, avoiding div by zero
                    const maxNet = Math.max(...trendData.map(d => Math.abs(d.income - d.expense)), 1); 
                    const heightPercent = Math.min((Math.abs(net) / maxNet) * 100, 100);
                    
                    const isPositive = net >= 0;

                    return (
                    <div key={i} className="w-full bg-slate-50 dark:bg-slate-800 rounded-t-lg relative group h-full flex items-end justify-center">
                        <div 
                            className={cn(
                                "w-full transition-all rounded-t-lg mx-auto min-h-[4px]",
                                isPositive 
                                    ? "bg-emerald-500/20 group-hover:bg-emerald-500 dark:bg-emerald-500/10" 
                                    : "bg-rose-500/20 group-hover:bg-rose-500 dark:bg-rose-500/10"
                            )}
                            style={{ width: '60%', height: `${heightPercent}%` }}
                            title={formatCurrency(net)}
                        ></div>
                         <p className="absolute -bottom-6 text-[10px] font-bold text-slate-400 uppercase">
                             {data.name}
                         </p>
                    </div>
                )})}
                {trendData.length === 0 && <p className="w-full text-center text-sm text-slate-400">No data available</p>}
            </div>
       </div>

      {/* Performance Indicators (KPIs) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
             <h3 className="text-lg font-bold text-slate-900 dark:text-white">Monthly Performance (MoM)</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Insight Type</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Current Month</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Last Month</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Change</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Trend</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {kpiData.map((item, index) => {
                        const Icon = item.icon;
                        
                        // Logic for color: 
                        // If it's expense: Up trend = Bad (Red), Down trend = Good (Green)
                        // But we decided "Up" arrow means "Increase".
                        // Change Color:
                        // Normal: Increase (+) -> Green, Decrease (-) -> Red
                        // Expense: Increase (+) -> Red, Decrease (-) -> Green
                        
                        let changeColor = item.change.includes('+') ? "text-emerald-500" : "text-rose-500";
                        if (item.isExpense) {
                            changeColor = item.change.includes('+') ? "text-rose-500" : "text-emerald-500";
                        }
                        
                        // Trend Icon color follows the same logic
                        let trendColor = item.trend === 'up' ? "text-emerald-500" : "text-rose-500";
                         if (item.isExpense) {
                            trendColor = item.trend === 'up' ? "text-rose-500" : "text-emerald-500";
                        }

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
                                     <span className={cn("text-xs font-bold", changeColor)}>
                                         {item.change}
                                     </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <TrendingUp className={cn(
                                        "w-4 h-4 ml-auto",
                                        trendColor,
                                        item.trend === 'down' && "rotate-180"
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
