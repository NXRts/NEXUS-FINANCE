import { useState, useEffect } from 'react';
import { Moon, Sun, Bell, Settings, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check system preference on mount
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 flex-shrink-0">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="max-w-md w-full hidden sm:block">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
            <input
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              placeholder="Search..."
              type="text"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-6">
        <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={() => setIsDark(!isDark)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            title="Toggle Dark Mode"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button className="hidden md:flex w-10 h-10 rounded-full items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            <Bell className="w-5 h-5" />
          </button>
          <button className="hidden md:flex w-10 h-10 rounded-full items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            <Settings className="w-5 h-5" />
          </button>
        </div>
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">Alex Morgan</p>
            <p className="text-xs text-slate-500 font-medium">Administrator</p>
          </div>
          <div
            className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-slate-100 dark:border-slate-700"
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCAYV6RZtJzeiVTsb1LFwM33WEvJ0wEXlFhKXQgfdn1g1PuCBzKrzlB3wFb2GBazJCtO_40_QUcphfrGbaBDWLNQFn3DXMY2vGspQJMYILDLwgTq5GSa00ccCZNSDnUFjPk-SKXyMXB-kG2ZNgL7e4oE1eGiRXu32FGH44CE8hdgnsEXls8Zu8OzfEPd1XlCGRXvbgqbCASP5cN0_c1JATfr08fvxR95oBR3oBeGVMr-6wQaobcVMGq8RxrvOQUNUGbycwuusnAUQU')" }}>
          </div>
        </div>
      </div>
    </header>
  );
}
