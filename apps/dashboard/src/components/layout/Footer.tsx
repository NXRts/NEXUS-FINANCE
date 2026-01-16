
export function Footer() {
  return (
    <footer className="w-full py-6 px-8 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
        <p>© 2024 Fin Tracker. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors">Contact Support</a>
        </div>
      </div>
    </footer>
  );
}
