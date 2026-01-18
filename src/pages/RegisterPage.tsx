import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, ShieldCheck } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

// Mock data for the mini chart (same as login for consistency)
const chartData = [
  { value: 4000 },
  { value: 3000 },
  { value: 5000 },
  { value: 4500 },
  { value: 6000 },
  { value: 5500 },
  { value: 7000 },
];

export function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate registration
    console.log("Registering", formData);
    navigate('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 font-manrope">
      {/* Left Panel - Branding & Visuals */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1e293b] dark:bg-[#0f172a] relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
        }}></div>
        
        {/* Decorative Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        {/* Header */}
        <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                <span className="material-symbols-outlined text-white">account_balance_wallet</span>
            </div>
            <span className="text-xl font-bold tracking-tight">FIN TRACKER</span>
        </div>

        {/* Main Content */}
        <div className="relative z-10 space-y-12">
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
                Join the future <br/>
                of financial <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">management.</span>
            </h1>
            <p className="text-slate-300 text-lg max-w-md leading-relaxed">
                Create your account today and start your journey towards financial freedom with our advanced tracking tools.
            </p>

            {/* Visual Cards */}
            <div className="flex gap-6">
                {/* Total Assets Card */}
                <div className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl w-64 shadow-2xl">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Total Assets</p>
                    <h3 className="text-2xl font-bold mb-2">$142,850.00</h3>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="flex items-center text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                            <span className="mr-1">↑</span> +12.5%
                        </span>
                    </div>
                    <div className="h-16 w-full opacity-80">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="value" stroke="#818cf8" strokeWidth={2} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Security Card */}
                 <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl w-48 shadow-xl flex flex-col justify-between">
                    <div>
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Security</p>
                        <h3 className="text-xl font-bold">256-bit</h3>
                    </div>
                    <div className="flex items-center gap-2 text-indigo-300 text-xs font-medium mt-4">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Encrypted</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-slate-400">
            © 2024 Fin Tracker Inc. Professional Wealth Management Solutions.
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative">
          <div className="w-full max-w-[420px] space-y-8">
              <div className="text-center lg:text-left">
                  <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Create Account</h2>
                  <p className="text-slate-500 dark:text-slate-400">Sign up to get started with Fin Tracker.</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <input 
                            type="email" 
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@company.com"
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                         <input 
                            type={showPassword ? "text" : "password"} 
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full pl-12 pr-12 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Confirm Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                         <input 
                            type={showConfirmPassword ? "text" : "password"} 
                            name="confirmPassword"
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full pl-12 pr-12 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <div className="flex items-start pt-2">
                    <input 
                        id="terms" 
                        type="checkbox" 
                        required
                        className="w-4 h-4 mt-0.5 rounded border-slate-300 text-primary focus:ring-primary/20" 
                    />
                    <label htmlFor="terms" className="ml-2 text-sm text-slate-500 dark:text-slate-400">
                        I agree to the <a href="#" className="font-bold text-[#1e293b] dark:text-white hover:underline">Terms of Service</a> and <a href="#" className="font-bold text-[#1e293b] dark:text-white hover:underline">Privacy Policy</a>
                    </label>
                </div>

                <button type="submit" className="w-full py-3.5 bg-[#1e293b] dark:bg-primary text-white font-bold rounded-xl hover:bg-[#1e293b]/90 dark:hover:bg-primary/90 transition-all shadow-lg shadow-slate-900/20 dark:shadow-primary/20 flex items-center justify-center gap-2 group">
                    <span>Create Account</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </form>

              <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-slate-50 dark:bg-slate-900 px-4 text-slate-400 font-bold tracking-wider">Or continue with</span>
                  </div>
              </div>

              <button className="w-full py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-3">
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                  <span>Sign up with Google</span>
              </button>

              <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                  Already have an account? <a href="/login" onClick={(e) => {e.preventDefault(); navigate('/login');}} className="font-bold text-[#1e293b] dark:text-white hover:underline">Sign in</a>
              </p>
          </div>
      </div>
    </div>
  );
}
