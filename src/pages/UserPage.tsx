import { useState, useEffect } from 'react';
import { Search, Filter, Download, UserPlus, MoreVertical, ChevronLeft, ChevronRight, Edit, X, Check, ChevronDown } from 'lucide-react';
import type { User } from '../types';
import { cn } from '../lib/utils';

import { storage } from '../lib/storage';

export function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenu, setActiveMenu] = useState<{ id: string; top: number; right: number } | null>(null);
  
  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      role: 'viewer',
      department: '',
      status: 'active'
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isRoleOpen, setIsRoleOpen] = useState(false);

  useEffect(() => {
    setUsers(storage.getUsers());
  }, []);

  const handleDeleteUser = (id: string) => {
      const updatedUsers = users.filter(user => user.id !== id);
      setUsers(updatedUsers);
      storage.saveUsers(updatedUsers);
      setActiveMenu(null);
  };

  const handleCreateUser = () => {
      setEditingId(null);
      setFormData({
          name: '',
          email: '',
          role: 'viewer',
          department: '',
          status: 'active'
      });
      setIsModalOpen(true);
  };

  const handleEditUser = (userId: string) => {
      const userToEdit = users.find(u => u.id === userId);
      if (userToEdit) {
          setEditingId(userId);
          setFormData({
              name: userToEdit.name,
              email: userToEdit.email,
              role: userToEdit.role,
              department: userToEdit.department,
              status: userToEdit.status
          });
          setIsModalOpen(true);
          setActiveMenu(null);
      }
  };

  const handleCloseModal = () => {
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({
          name: '',
          email: '',
          role: 'viewer',
          department: '',
          status: 'active'
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingId) {
          const updatedUsers = users.map(user => {
              if (user.id === editingId) {
                  return {
                      ...user,
                      ...formData,
                      role: formData.role as 'admin' | 'editor' | 'viewer',
                      status: formData.status as 'active' | 'inactive'
                  };
              }
              return user;
          });
          setUsers(updatedUsers);
          storage.saveUsers(updatedUsers);
      } else {
          // Create new user
          const newUser: User = {
              id: crypto.randomUUID(),
              ...formData,
              role: formData.role as 'admin' | 'editor' | 'viewer',
              status: formData.status as 'active' | 'inactive',
              lastLogin: 'Never', // Default for new invite
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random` // Auto-generate avatar
          };
          const updatedUsers = [newUser, ...users];
          setUsers(updatedUsers);
          storage.saveUsers(updatedUsers);
      }
      handleCloseModal();
  };

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
        <button 
            onClick={handleCreateUser}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1e40af] text-white text-sm font-bold shadow-lg shadow-blue-900/20 hover:bg-[#1e3a8a] transition-all"
        >
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
        <div className="overflow-x-auto min-h-[400px]">
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
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group relative">
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
                  <td className="px-6 py-5 text-right relative">
                    <button 
                         onClick={(e) => {
                            e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            setActiveMenu(activeMenu?.id === user.id ? null : {
                                id: user.id,
                                top: rect.bottom + 5,
                                right: window.innerWidth - rect.right
                            });
                        }}
                        className={cn(
                            "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg",
                            activeMenu?.id === user.id && "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                        )}
                    >
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
      
      {/* Fixed Menu Portal */}
      {activeMenu && (
        <div className="fixed inset-0 z-[100]" onClick={() => setActiveMenu(null)}>
             {/* Backdrop */}
             <div 
                className="absolute w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                style={{ top: activeMenu.top, right: activeMenu.right }}
                onClick={(e) => e.stopPropagation()}
             >
                <button 
                    onClick={() => handleEditUser(activeMenu.id)}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800/50"
                >
                    Edit Values
                </button>
                <button 
                    onClick={() => handleDeleteUser(activeMenu.id)}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                >
                    Delete User
                </button>
            </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {editingId ? <Edit className="w-5 h-5 text-primary" /> : <UserPlus className="w-5 h-5 text-primary" />}
                        {editingId ? 'Edit User' : 'Invite User'}
                    </h3>
                    <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                            <input 
                                type="text" 
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                                placeholder="e.g. Alez Morgan"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                            <input 
                                type="email" 
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                                placeholder="user@company.com"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Role</label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setIsRoleOpen(!isRoleOpen)}
                                        className={cn(
                                            "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium flex items-center justify-between",
                                            isRoleOpen && "ring-2 ring-primary/20 border-primary"
                                        )}
                                    >
                                        <span className="capitalize">{formData.role}</span>
                                        <ChevronDown className={cn("w-4 h-4 transition-transform", isRoleOpen ? "rotate-180" : "")} />
                                    </button>
                                    {isRoleOpen && (
                                        <div className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                            {['admin', 'editor', 'viewer'].map((role) => (
                                                <button
                                                    key={role}
                                                    type="button"
                                                    onClick={() => { setFormData({...formData, role: role as any}); setIsRoleOpen(false); }}
                                                    className={cn(
                                                        "w-full text-left px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-between capitalize",
                                                        formData.role === role 
                                                            ? "bg-primary/10 text-primary" 
                                                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                                                    )}
                                                >
                                                    {role}
                                                    {formData.role === role && <Check className="w-4 h-4 text-primary" />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Status</label>
                                <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                                    {['active', 'inactive'].map((status) => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => setFormData({...formData, status: status as any})}
                                            className={cn(
                                                "flex-1 py-1.5 rounded-lg text-sm font-bold capitalize transition-all",
                                                formData.status === status 
                                                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" 
                                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                            )}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                         <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Department</label>
                            <input 
                                type="text" 
                                required
                                value={formData.department}
                                onChange={(e) => setFormData({...formData, department: e.target.value})}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                                placeholder="e.g. Finance"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button 
                            type="button" 
                            onClick={handleCloseModal}
                            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 py-3 px-4 rounded-xl bg-[#1e40af] text-white font-bold hover:bg-[#1e3a8a] shadow-lg shadow-blue-900/20 transition-all"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
