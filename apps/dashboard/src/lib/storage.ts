import type { Income, Expense, Category, User } from '../types';

const STORAGE_KEYS = {
  INCOMES: 'finance_incomes',
  EXPENSES: 'finance_expenses',
  CATEGORIES: 'finance_categories',
  USERS: 'finance_users',
};

// Initial Seed Data
const INITIAL_DATA = {
  categories: [
    { id: '1', name: 'Gaji Bulanan', type: 'income', status: 'active', icon: 'briefcase', color: 'emerald' },
    { id: '2', name: 'Bonus & Insentif', type: 'income', status: 'active', icon: 'star', color: 'emerald' },
    { id: '3', name: 'Investasi', type: 'income', status: 'active', icon: 'trending-up', color: 'emerald' },
    { id: '4', name: 'Makan & Minum', type: 'expense', status: 'active', icon: 'coffee', color: 'rose' },
    { id: '5', name: 'Transportasi', type: 'expense', status: 'active', icon: 'car', color: 'rose' },
    { id: '6', name: 'Belanja Rutin', type: 'expense', status: 'active', icon: 'shopping-bag', color: 'rose' },
    { id: '7', name: 'Tagihan & Air', type: 'expense', status: 'active', icon: 'file-text', color: 'rose' },
  ] as Category[],
  users: [
    { 
        id: '1', 
        name: 'Alex Rivera', 
        email: 'alex.r@fintracker.com', 
        role: 'admin', 
        department: 'Global Operations', 
        lastLogin: 'Oct 24, 2023 • 14:20', 
        status: 'active',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60'
    },
    { 
        id: '2', 
        name: 'Sarah Chen', 
        email: 's.chen@fintracker.com', 
        role: 'editor', 
        department: 'Editorial', 
        lastLogin: 'Oct 24, 2023 • 09:15', 
        status: 'active',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60'
    },
  ] as User[],
  incomes: [
      { id: '1', invoiceId: '#INV-2023-001', clientName: 'Acme Corp', amount: 15000000, date: '2023-10-24', status: 'Lunas' },
      { id: '2', invoiceId: '#INV-2023-002', clientName: 'Global Tech', amount: 8500000, date: '2023-10-22', status: 'Pending' },
      { id: '3', invoiceId: '#INV-2023-003', clientName: 'Creative Studio', amount: 4200000, date: '2023-10-20', status: 'Lunas' },
  ] as Income[],
  expenses: [
     { id: '1', vendor: 'Amazon Web Services', category: 'Technology', amount: 1500000, date: '2023-10-24', status: 'Dibayar', proofOfPayment: '#' },
     { id: '2', vendor: 'WeWork Office', category: 'Facilities', amount: 4500000, date: '2023-10-23', status: 'Menunggu', proofOfPayment: '#' },
     { id: '3', vendor: 'Uber Business', category: 'Transport', amount: 350000, date: '2023-10-22', status: 'Dibayar', proofOfPayment: '#' },
  ] as Expense[]
};

export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage`, error);
      return defaultValue;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      // Dispatch a custom event to notify listeners of changes
      window.dispatchEvent(new Event('storage-change'));
    } catch (error) {
      console.error(`Error writing ${key} to localStorage`, error);
    }
  },

  // Specialized helpers
  getIncomes: () => storage.get<Income[]>(STORAGE_KEYS.INCOMES, []),
  saveIncomes: (incomes: Income[]) => storage.set(STORAGE_KEYS.INCOMES, incomes),
  
  getExpenses: () => storage.get<Expense[]>(STORAGE_KEYS.EXPENSES, []),
  saveExpenses: (expenses: Expense[]) => storage.set(STORAGE_KEYS.EXPENSES, expenses),

  getCategories: () => storage.get<Category[]>(STORAGE_KEYS.CATEGORIES, []),
  saveCategories: (categories: Category[]) => storage.set(STORAGE_KEYS.CATEGORIES, categories),

  getUsers: () => storage.get<User[]>(STORAGE_KEYS.USERS, []),
  saveUsers: (users: User[]) => storage.set(STORAGE_KEYS.USERS, users),

  // Initialize data if empty
  initialize: () => {
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
        storage.saveCategories(INITIAL_DATA.categories);
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        storage.saveUsers(INITIAL_DATA.users);
    }
    if (!localStorage.getItem(STORAGE_KEYS.INCOMES)) {
        storage.saveIncomes(INITIAL_DATA.incomes);
    }
    if (!localStorage.getItem(STORAGE_KEYS.EXPENSES)) {
        storage.saveExpenses(INITIAL_DATA.expenses);
    }
  }
};
