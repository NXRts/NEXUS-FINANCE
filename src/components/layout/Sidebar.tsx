import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { LayoutDashboard, TrendingUp, TrendingDown, Layers, User, Wallet } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: TrendingUp, label: 'Pemasukan', href: '/pemasukan' },
  { icon: TrendingDown, label: 'Pengeluaran', href: '/pengeluaran' },
  { icon: Layers, label: 'Kategori', href: '/kategori' },
  { icon: TrendingUp, label: 'Reports', href: '/reports' },
  { icon: User, label: 'User', href: '/user' },
];

export function Sidebar() {
  const location = useLocation();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Simple fetch for demo
    const users = JSON.parse(localStorage.getItem('finance_users') || '[]');
    if (users.length > 0) setUser(users[0]);
  }, []);

  return (
    <aside className="w-72 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col h-full transition-all duration-300">
      {/* Header */}
      <div className="p-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <Wallet className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-white leading-tight">NEXUS FINANCE</h1>
          <p className="text-xs text-slate-400 font-medium tracking-wide">Modern Admin</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 relative overflow-hidden",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-[0_0_12px_rgba(0,122,108,0.4)]"></div>
              )}
              
              <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "text-slate-500 group-hover:text-slate-300")} />
              <span className={cn("font-medium text-sm tracking-wide", isActive && "font-bold")}>{item.label}</span>
              
              {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary/50"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Widget */}
      {user && (
        <div className="p-4 border-t border-slate-800">
            <Link to="/profile" className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-all group">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border-2 border-slate-700 group-hover:border-slate-500 transition-colors" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.role}</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            </Link>
        </div>
      )}
    </aside>
  );
}
