import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { LayoutDashboard, TrendingUp, TrendingDown, Layers, User } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: TrendingUp, label: 'Pemasukan', href: '/pemasukan' },
  { icon: TrendingDown, label: 'Pengeluaran', href: '/pengeluaran' },
  { icon: Layers, label: 'Kategori', href: '/kategori' },
  { icon: User, label: 'User', href: '/user' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white">
          <span className="material-symbols-outlined">account_balance_wallet</span>
        </div>
        <div>
          <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">FIN TRACKER</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Modern Admin</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive 
                  ? "active-nav" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
             <span className="material-symbols-outlined">
                {item.label === 'Dashboard' ? 'dashboard' :
                 item.label === 'Pemasukan' ? 'trending_up' :
                 item.label === 'Pengeluaran' ? 'trending_down' :
                 item.label === 'Kategori' ? 'category' : 'person'}
             </span>
              <span className={cn("font-medium text-sm", isActive && "font-semibold")}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-xl">
          <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Pro Plan</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">Unlock advanced analytics and reports.</p>
          <button className="w-full py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors">Upgrade Now</button>
        </div>
      </div>
    </aside>
  );
}
