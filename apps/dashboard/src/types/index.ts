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
  proofOfPayment?: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
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
