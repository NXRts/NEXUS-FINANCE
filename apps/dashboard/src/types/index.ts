export interface Income {
  id: string;
  invoiceId: string;
  clientName: string;
  amount: number;
  date: string;
  status: 'Lunas' | 'Pending' | 'Batal';
  description?: string;
}

export interface Expense {
  id: string;
  vendor: string;
  category: string;
  amount: number;
  date: string;
  status: 'Dibayar' | 'Menunggu' | 'Batal';
  proofOfPayment?: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  status: 'active' | 'inactive';
  icon?: string; // e.g. 'briefcase', 'star', 'chart-bar'
  color?: string; // e.g. 'bg-green-100 text-green-600'
  itemCount?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'viewer';
  avatar?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  icon?: string; // e.g. 'cloud', 'payments'
}
