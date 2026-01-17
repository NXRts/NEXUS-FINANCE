import type { Income, Expense, Category, User } from '../types';

const STORAGE_KEYS = {
  INCOMES: 'finance_incomes',
  EXPENSES: 'finance_expenses',
  CATEGORIES: 'finance_categories',
  USERS: 'finance_users',
};

const mockIncomes: Income[] = [
  { id: '1', invoiceId: '#INV-2023-001', source: 'Gaji Bulanan', amount: 5000000, date: '2023-10-12', status: 'Diterima', description: 'Gaji Oktober' },
  { id: '2', invoiceId: '#INV-2023-002', source: 'Freelance Design', amount: 1250000, date: '2023-10-14', status: 'Tertunda', description: 'Logo Project' },
  { id: '3', invoiceId: '#INV-2023-003', source: 'Bonus Tahunan', amount: 15700000, date: '2023-10-15', status: 'Diterima', description: 'Bonus Kinerja' },
  { id: '4', invoiceId: '#INV-2023-004', source: 'Investasi Saham', amount: 450000, date: '2023-10-18', status: 'Diterima', description: 'Dividen' },
  { id: '5', invoiceId: '#INV-2023-005', source: 'Jual Barang Bekas', amount: 2800000, date: '2023-10-20', status: 'Diterima', description: 'Jual Laptop' },
];

const mockCategories: Category[] = [
  { id: '1', name: 'Gaji', type: 'income', status: 'active' },
  { id: '2', name: 'Bonus', type: 'income', status: 'active' },
  { id: '3', name: 'Investasi', type: 'income', status: 'active' },
  { id: '4', name: 'Freelance', type: 'income', status: 'active' },
  { id: '5', name: 'Makanan', type: 'expense', status: 'active' },
  { id: '6', name: 'Transportasi', type: 'expense', status: 'active' },
  { id: '7', name: 'Hiburan', type: 'expense', status: 'active' },
];

const mockUsers: User[] = [
  { 
    id: '1', 
    name: 'Admin', 
    email: 'admin@nexusfinance.com', 
    role: 'admin', 
    department: 'Management', 
    lastLogin: 'Oct 24, 2023 • 14:20', 
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff'
  }
];

export const storage = {
  getIncomes: (): Income[] => {
    if (typeof window === 'undefined') return [];
    try {
        const data = localStorage.getItem(STORAGE_KEYS.INCOMES);
        if (!data) return [];
        
        const parsedData = JSON.parse(data);
        
        // Migration logic for old data
        const migratedData = parsedData.map((item: any) => {
            let newItem = { ...item };
            
            // Migrate clientName to source
            if (newItem.clientName && !newItem.source) {
                newItem.source = newItem.clientName;
                delete newItem.clientName;
            }
            
            // Migrate statuses
            if (newItem.status === 'Lunas') newItem.status = 'Diterima';
            if (newItem.status === 'Pending') newItem.status = 'Tertunda';
            if (newItem.status === 'Batal') newItem.status = 'Tertunda'; 
            if (!['Diterima', 'Tertunda'].includes(newItem.status)) {
                newItem.status = 'Tertunda';
            }
            
            return newItem as Income;
        });

        return migratedData;
    } catch (e) {
        console.error("Failed to parse incomes", e);
        return [];
    }
  },
  saveIncomes: (incomes: Income[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.INCOMES, JSON.stringify(incomes));
  },
  
  getExpenses: (): Expense[] => {
    if (typeof window === 'undefined') return [];
    try {
        const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
        if (!data) return [];
        
        const parsedData = JSON.parse(data);
        // Migration: Ensure invoiceId exists
        return parsedData.map((item: any) => {
            if (!item.invoiceId) {
                // Generate a retro-active ID or fallback
                item.invoiceId = `#EXP-${new Date(item.date).getFullYear()}-${item.id.substring(0, 3).toUpperCase()}`;
            }
            if (item.vendor) {
                 // Append old vendor to description if it exists and isn't already there to avoid data loss
                 if (!item.description?.includes(item.vendor)) {
                    item.description = item.description ? `${item.vendor} - ${item.description}` : item.vendor;
                 }
                 delete item.vendor;
            }
            return item as Expense;
        }).filter(item => (item.status as string) !== 'Batal');
    } catch {
        return [];
    }
  },
  saveExpenses: (expenses: Expense[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  },

  getCategories: (): Category[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : [];
  },
  saveCategories: (categories: Category[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },

  getUsers: (): User[] => {
      if (typeof window === 'undefined') return [];
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : [];
  },
  saveUsers: (users: User[]) => {
      if (typeof window === 'undefined') return;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },


  initialize: () => {
    if (typeof window === 'undefined') return;
    
    if (!localStorage.getItem(STORAGE_KEYS.INCOMES)) {
      localStorage.setItem(STORAGE_KEYS.INCOMES, JSON.stringify(mockIncomes));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(mockCategories));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
    }
  }
};
