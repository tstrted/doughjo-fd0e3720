
// Types for finance data
export type Currency = "USD" | "EUR" | "GBP" | "ZAR" | "AUD";

export type CategoryType = "F" | "S" | "G" | "V";

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  description?: string;
}

export interface Account {
  id: string;
  name: string;
  type: string;
  goal?: number;
  cleared?: number;
  balance: number;
}

export interface Transaction {
  id: string;
  account: string;
  date: string;
  description: string;
  category: string;
  payment?: number;
  deposit?: number;
  accountBalance?: number;
  clearedBalance?: number;
  balance?: number;
  memo?: string;
  cleared?: boolean;
  type?: "payment" | "deposit" | "transfer" | "balance" | string;
}

export interface BudgetItem {
  id: string;
  category: string;
  type: "income" | "expense";
  amounts: Record<string, number>;
}

export interface SubAccount {
  id: string;
  fund: string;
  location: string;
  goal?: number;
  percentage?: number;
  balance: number;
}

export interface SubAccountTransaction {
  id: string;
  fund: string;
  date: string;
  number?: string;
  description: string;
  memo?: string;
  payment?: number;
  deposit?: number;
  fundBalance?: number;
  totalBalance?: number;
}

// Report interfaces
export interface BudgetSummary {
  income: number;
  expenses: number;
  net: number;
}

export interface CategoryData {
  budget: number;
  actual: number;
  difference: number;
}

export interface ReportData {
  budgetSummary: BudgetSummary;
  actualSummary: BudgetSummary;
  difference: BudgetSummary;
  categories: Record<string, CategoryData>;
}

export interface MonthlyData {
  month: number;
  monthName: string;
  income: number;
  expenses: number;
  net: number;
}

export interface CategoryBreakdown {
  total: number;
  average: number;
}

export interface YearlyReportData {
  monthlyData: MonthlyData[];
  totals: BudgetSummary;
  averages: BudgetSummary;
  categoryBreakdown: Record<string, CategoryBreakdown>;
}

// Context interface
export interface FinanceContextType {
  // Data
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
  budgetItems: BudgetItem[];
  subAccounts: SubAccount[];
  subAccountTransactions: SubAccountTransaction[];
  settings: {
    currency: Currency;
    financialYearStart: string;
    currentMonth: number;
    currentYear: number;
    darkMode: boolean; // Added darkMode property
  };
  
  // Functions
  addAccount: (account: Omit<Account, "id">) => void;
  updateAccount: (id: string, account: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  addBudgetItem: (budgetItem: Omit<BudgetItem, "id">) => void;
  updateBudgetItem: (id: string, budgetItem: Partial<BudgetItem>) => void;
  deleteBudgetItem: (id: string) => void;
  clearBudgetItems: () => void;
  
  addSubAccount: (subAccount: Omit<SubAccount, "id">) => void;
  updateSubAccount: (id: string, subAccount: Partial<SubAccount>) => void;
  deleteSubAccount: (id: string) => void;
  
  addSubAccountTransaction: (transaction: Omit<SubAccountTransaction, "id">) => void;
  updateSubAccountTransaction: (id: string, transaction: Partial<SubAccountTransaction>) => void;
  deleteSubAccountTransaction: (id: string) => void;
  
  updateSettings: (settings: Partial<{ 
    currency: Currency;
    financialYearStart: string;
    currentMonth: number;
    currentYear: number;
    darkMode: boolean; // Added darkMode property
  }>) => void;
  
  // Utility functions
  calculateMonthlyBudget: (month: number, year: number) => BudgetSummary;
  calculateActualSpending: (month: number, year: number) => {
    income: number;
    expenses: number;
    net: number;
    byCategory: Record<string, { budgeted: number; actual: number; difference: number }>;
  };
  
  generateReportData: (
    month: number,
    year: number,
    yearToDate?: boolean
  ) => ReportData;
  
  generateYearlyReportData: (year: number) => YearlyReportData;
  
  formatCurrency: (amount: number) => string;
}

