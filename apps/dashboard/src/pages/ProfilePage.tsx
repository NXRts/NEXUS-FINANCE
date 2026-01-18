import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Calendar, Shield, Building, Camera, Edit2 } from 'lucide-react';
import type { User } from '../types';
import { storage } from '../lib/storage';

export function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // For demo purposes, we'll get the first user (Alex Morgan) or the logged in user context
    const users = storage.getUsers();
    if (users.length > 0) {
        setUser(users[0]);
    }
  }, []);

  if (!user) return <div className="p-8 text-center text-slate-500">Loading profile...</div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="relative h-48 rounded-3xl bg-gradient-to-r from-slate-900 via-[#1e40af] to-slate-900 overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* Main Profile Content - Overlapping the banner */}
      <div className="px-6 relative -mt-20">
          <div className="flex flex-col md:flex-row items-end md:items-end gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
              {/* Avatar Group */}
              <div className="relative group">
                  <div className="w-40 h-40 rounded-full border-4 border-white dark:border-slate-900 shadow-2xl overflow-hidden bg-white">
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                  <button className="absolute bottom-2 right-2 p-2 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-200">
                      <Camera className="w-5 h-5" />
                  </button>
              </div>

              {/* Name & Role Info */}
              <div className="flex-1 pb-2">
                  <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{user.name}</h1>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-lg mt-1">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pb-4">
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                      <Edit2 className="w-4 h-4" />
                      <span>Edit Profile</span>
                  </button>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Contact Info */}
          <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Contact Information</h3>
                  <div className="space-y-4">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                              <Mail className="w-5 h-5" />
                          </div>
                          <div>
                              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Email</p>
                              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user.email}</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                              <Phone className="w-5 h-5" />
                          </div>
                          <div>
                              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Phone</p>
                              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">+1 (555) 123-4567</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                              <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Location</p>
                              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">New York, USA</p>
                          </div>
                      </div>
                  </div>
              </div>

               <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Work Information</h3>
                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                              <Building className="w-5 h-5" />
                          </div>
                          <div>
                              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Department</p>
                              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user.department}</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                              <Shield className="w-5 h-5" />
                          </div>
                          <div>
                              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Role Access</p>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                                {user.role.toUpperCase()}
                              </span>
                          </div>
                      </div>
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                              <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Joined Date</p>
                              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">January 15, 2024</p>
                          </div>
                      </div>
                   </div>
               </div>
          </div>

          {/* Right Column - Activity & Bio */}
          <div className="md:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">About Me</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                      Experienced Financial Administrator with over 5 years of expertise in budget management, financial reporting, and operational efficiency. Passionate about streamlining financial processes and ensuring fiscal responsibility across all departments. Currently leading the Finance & Operations team to drive sustainable growth.
                  </p>
                  
                  <div className="mt-8">
                       <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Skills & Expertise</h4>
                       <div className="flex flex-wrap gap-2">
                           {['Financial Analysis', 'Budgeting', 'Risk Management', 'Taxation', 'Auditing', 'Excel Expert', 'Leadership'].map(skill => (
                               <span key={skill} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold">
                                   {skill}
                               </span>
                           ))}
                       </div>
                  </div>
              </div>

               <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Recent Activity</h3>
                  <div className="space-y-6">
                      {[1, 2, 3].map((_, i) => (
                          <div key={i} className="flex gap-4 pb-6 border-b border-slate-50 dark:border-slate-800/50 last:border-0 last:pb-0">
                               <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center">
                                   <div className="w-3 h-3 bg-primary rounded-full"></div>
                               </div>
                               <div>
                                   <p className="text-sm font-bold text-slate-900 dark:text-white">Updated Quartely Financial Report</p>
                                   <p className="text-xs text-slate-500 mt-1">Uploaded 3 new files to the finance folder. Reviewed by the board.</p>
                                   <span className="text-[10px] font-bold text-slate-400 mt-2 block">2 hours ago</span>
                               </div>
                          </div>
                      ))}
                  </div>
               </div>
          </div>
      </div>
    </div>
  );
}
