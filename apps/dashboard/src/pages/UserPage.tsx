import { useState, useEffect } from 'react';
import { Search, Filter, Download, UserPlus, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import type { User } from '../types';
import { cn } from '../lib/utils';

const mockUsers: User[] = [
  { 
    id: '1', 
    name: 'Alex Rivera', 
    email: 'alex.r@nexusfinance.com', 
    role: 'admin', 
    department: 'Global Operations', 
    lastLogin: 'Oct 24, 2023 • 14:20', 
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60'
  },
  { 
    id: '2', 
    name: 'Sarah Chen', 
    email: 's.chen@nexusfinance.com', 
    role: 'editor', 
    department: 'Editorial', 
    lastLogin: 'Oct 24, 2023 • 09:15', 
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60'
  },
  { 
    id: '3', 
    name: 'Marcus Wright', 
    email: 'm.wright@nexusfinance.com', 
    role: 'viewer', 
    department: 'Compliance', 
    lastLogin: 'Oct 22, 2023 • 18:44', 
    status: 'inactive',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop&q=60'
  },
  { 
    id: '4', 
    name: 'Elena Petrova', 
    email: 'elena.p@nexusfinance.com', 
    role: 'editor', 
    department: 'Treasury', 
    lastLogin: 'Oct 21, 2023 • 11:30', 
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=60'
  },
];

export function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setUsers(storage.getUsers());
  }, []);

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'admin': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'editor': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'viewer': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">User Management</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Control access permissions and oversee your financial team.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1e40af] text-white text-sm font-bold shadow-lg shadow-blue-900/20 hover:bg-[#1e3a8a] transition-all">
          <UserPlus className="w-5 h-5" />
          <span>Invite User</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search team members by name or email..." 
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
            />
        </div>
        <div className="flex gap-3">
             <button className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
             </button>
             <button className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
                <Download className="w-4 h-4" />
                <span>Export</span>
             </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">     
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f8fafc] dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">User Details</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                       <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm" />
                       <div>
                           <p className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
                           <p className="text-xs text-slate-500 font-medium mt-0.5">Dept: {user.department}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-500 dark:text-slate-400">
                    {user.email}
                  </td>
                  <td className="px-6 py-5">
                     <span className={cn("px-3 py-1 text-[10px] font-bold uppercase rounded-md tracking-wider", getRoleColor(user.role))}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-500 dark:text-slate-400">
                      {user.lastLogin}
                  </td>
                  <td className="px-6 py-5">
                     <div className="flex items-center gap-2">
                         <span className={cn("w-2 h-2 rounded-full", user.status === 'active' ? "bg-emerald-500" : "bg-slate-300")}></span>
                         <span className={cn("text-xs font-bold capitalize", user.status === 'active' ? "text-emerald-700 dark:text-emerald-400" : "text-slate-500")}>
                             {user.status}
                         </span>
                     </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Showing {(currentPage - 1) * 4 + 1} to {Math.min(currentPage * 4, 48)} of 48 users</span>
            <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                {[1, 2, 3].map(page => (
                  <button 
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-all",
                      currentPage === page 
                        ? "bg-[#1e40af] text-white shadow-md shadow-blue-900/20" 
                        : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                  >
                    {page}
                  </button>
                ))}
                <span className="text-slate-400 text-xs">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium transition-all">12</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
