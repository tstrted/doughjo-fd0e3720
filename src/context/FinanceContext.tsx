
import React, { createContext, useContext, useState, useEffect } from "react";

// Types
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

// Context interfaces
interface FinanceContextType {
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
  
  addSubAccount: (subAccount: Omit<SubAccount, "id">) => void;
  updateSubAccount: (id: string, subAccount: Partial<SubAccount>) => void;
  deleteSubAccount: (id: string) => void;
  
  addSubAccountTransaction: (transaction: Omit<SubAccountTransaction, "id">) => void;
  updateSubAccountTransaction: (id: string, transaction: Partial<SubAccountTransaction>) => void;
  deleteSubAccountTransaction: (id: string) => void;
  
  updateSettings: (settings: Partial<typeof defaultSettings>) => void;
  
  // Utility functions
  calculateMonthlyBudget: (month: number, year: number) => { 
    income: number;
    expenses: number;
    net: number;
  };
  
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
  ) => any;
  
  generateYearlyReportData: (year: number) => any;
  
  formatCurrency: (amount: number) => string;
}

// Default settings
const defaultSettings = {
  currency: "ZAR" as Currency,
  financialYearStart: "01/01/2025",
  currentMonth: new Date().getMonth() + 1,
  currentYear: new Date().getFullYear(),
};

// Default data (placeholder data)
const defaultAccounts: Account[] = [
  { id: "1", name: "JD Cheque", type: "Checking", balance: 2235.38, cleared: 2235.38 },
  { id: "2", name: "Money Market Select #1", type: "Savings", balance: 146699.89, cleared: 146699.89 },
  { id: "3", name: "Money Market Call #2", type: "Savings", balance: 0, cleared: 0 },
  { id: "4", name: "PureSave", type: "Savings", balance: 0.12, cleared: 0.12 },
  { id: "5", name: "Credit Card", type: "Credit", balance: 2.89, cleared: 2.89 },
  { id: "6", name: "Superannuation - Aus", type: "Investment", balance: 207350.00, cleared: 207350.00 },
  { id: "7", name: "Tax Free - JD", type: "Investment", balance: 0, cleared: 0 },
  { id: "8", name: "MarketLink", type: "Investment", balance: 35.00, cleared: 35.00 },
];

// Sample categories
const defaultCategories: Category[] = [
  { id: "1", name: "JD Salary", type: "F", description: "Salary income" },
  { id: "2", name: "Interest", type: "F", description: "Interest income" },
  { id: "3", name: "Miscellaneous Income", type: "F", description: "Other income" },
  { id: "4", name: "ADT", type: "F", description: "Security system" },
  { id: "5", name: "Amazon Prime", type: "F", description: "Amazon subscription" },
  { id: "6", name: "Bank Charges - JD", type: "F", description: "Bank fees" },
  { id: "7", name: "Carer", type: "F", description: "Caregiving expenses" },
  { id: "8", name: "Dance - Lexi", type: "F", description: "Dance lessons" },
  { id: "9", name: "Education - Laerskool", type: "F", description: "School expenses" },
  { id: "10", name: "Insurance - Car & Content", type: "F", description: "Insurance" },
  { id: "11", name: "Vehicle Payments (Fortuner)", type: "F", description: "Car payment" },
  { id: "12", name: "Water", type: "F", description: "Water utility" },
  { id: "13", name: "Net Payment", type: "F", description: "Net payment" },
  { id: "14", name: "Licensing", type: "S", description: "License fees" },
  { id: "15", name: "Vehicle Maintenance", type: "S", description: "Car maintenance" },
  { id: "16", name: "Date Night", type: "G", description: "Entertainment" },
  { id: "17", name: "Pocket Money - Kids", type: "G", description: "Allowance" },
  { id: "18", name: "Smile Fund", type: "G", description: "Charity" },
  { id: "19", name: "Beginning Balance", type: "V", description: "Starting balance" },
  { id: "20", name: "Transfer", type: "V", description: "Fund transfer" },
];

// Create context with default values
export const FinanceContext = createContext<FinanceContextType>({
  accounts: defaultAccounts,
  transactions: [],
  categories: defaultCategories,
  budgetItems: [],
  subAccounts: [],
  subAccountTransactions: [],
  settings: defaultSettings,
  
  // Placeholder functions
  addAccount: () => {},
  updateAccount: () => {},
  deleteAccount: () => {},
  
  addTransaction: () => {},
  updateTransaction: () => {},
  deleteTransaction: () => {},
  
  addCategory: () => {},
  updateCategory: () => {},
  deleteCategory: () => {},
  
  addBudgetItem: () => {},
  updateBudgetItem: () => {},
  deleteBudgetItem: () => {},
  
  addSubAccount: () => {},
  updateSubAccount: () => {},
  deleteSubAccount: () => {},
  
  addSubAccountTransaction: () => {},
  updateSubAccountTransaction: () => {},
  deleteSubAccountTransaction: () => {},
  
  updateSettings: () => {},
  
  calculateMonthlyBudget: () => ({ income: 0, expenses: 0, net: 0 }),
  calculateActualSpending: () => ({ 
    income: 0, 
    expenses: 0, 
    net: 0, 
    byCategory: {} 
  }),
  generateReportData: () => ({}),
  generateYearlyReportData: () => ({}),
  formatCurrency: () => "$0.00",
});

// Provider component
export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for all our data
  const [accounts, setAccounts] = useState<Account[]>(defaultAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [subAccounts, setSubAccounts] = useState<SubAccount[]>([]);
  const [subAccountTransactions, setSubAccountTransactions] = useState<SubAccountTransaction[]>([]);
  const [settings, setSettings] = useState(defaultSettings);

  // Load data from localStorage on initial mount
  useEffect(() => {
    try {
      const storedAccounts = localStorage.getItem("accounts");
      const storedTransactions = localStorage.getItem("transactions");
      const storedCategories = localStorage.getItem("categories");
      const storedBudgetItems = localStorage.getItem("budgetItems");
      const storedSubAccounts = localStorage.getItem("subAccounts");
      const storedSubAccountTransactions = localStorage.getItem("subAccountTransactions");
      const storedSettings = localStorage.getItem("settings");

      if (storedAccounts) setAccounts(JSON.parse(storedAccounts));
      if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
      if (storedCategories) setCategories(JSON.parse(storedCategories));
      if (storedBudgetItems) setBudgetItems(JSON.parse(storedBudgetItems));
      if (storedSubAccounts) setSubAccounts(JSON.parse(storedSubAccounts));
      if (storedSubAccountTransactions) setSubAccountTransactions(JSON.parse(storedSubAccountTransactions));
      if (storedSettings) setSettings(JSON.parse(storedSettings));
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("accounts", JSON.stringify(accounts));
      localStorage.setItem("transactions", JSON.stringify(transactions));
      localStorage.setItem("categories", JSON.stringify(categories));
      localStorage.setItem("budgetItems", JSON.stringify(budgetItems));
      localStorage.setItem("subAccounts", JSON.stringify(subAccounts));
      localStorage.setItem("subAccountTransactions", JSON.stringify(subAccountTransactions));
      localStorage.setItem("settings", JSON.stringify(settings));
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
    }
  }, [accounts, transactions, categories, budgetItems, subAccounts, subAccountTransactions, settings]);

  // Generate unique ID helper
  const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // CRUD operations for accounts
  const addAccount = (account: Omit<Account, "id">) => {
    const newAccount = { id: generateId(), ...account };
    setAccounts([...accounts, newAccount]);
  };

  const updateAccount = (id: string, account: Partial<Account>) => {
    setAccounts(accounts.map(acc => acc.id === id ? { ...acc, ...account } : acc));
  };

  const deleteAccount = (id: string) => {
    setAccounts(accounts.filter(acc => acc.id !== id));
  };

  // CRUD operations for transactions
  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = { id: generateId(), ...transaction };
    setTransactions([...transactions, newTransaction]);
  };

  const updateTransaction = (id: string, transaction: Partial<Transaction>) => {
    setTransactions(transactions.map(trans => trans.id === id ? { ...trans, ...transaction } : trans));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(trans => trans.id !== id));
  };

  // CRUD operations for categories
  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory = { id: generateId(), ...category };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (id: string, category: Partial<Category>) => {
    setCategories(categories.map(cat => cat.id === id ? { ...cat, ...category } : cat));
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  // CRUD operations for budget items
  const addBudgetItem = (budgetItem: Omit<BudgetItem, "id">) => {
    const newBudgetItem = { id: generateId(), ...budgetItem };
    setBudgetItems([...budgetItems, newBudgetItem]);
  };

  const updateBudgetItem = (id: string, budgetItem: Partial<BudgetItem>) => {
    setBudgetItems(budgetItems.map(item => item.id === id ? { ...item, ...budgetItem } : item));
  };

  const deleteBudgetItem = (id: string) => {
    setBudgetItems(budgetItems.filter(item => item.id !== id));
  };

  // CRUD operations for sub-accounts
  const addSubAccount = (subAccount: Omit<SubAccount, "id">) => {
    const newSubAccount = { id: generateId(), ...subAccount };
    setSubAccounts([...subAccounts, newSubAccount]);
  };

  const updateSubAccount = (id: string, subAccount: Partial<SubAccount>) => {
    setSubAccounts(subAccounts.map(acc => acc.id === id ? { ...acc, ...subAccount } : acc));
  };

  const deleteSubAccount = (id: string) => {
    setSubAccounts(subAccounts.filter(acc => acc.id !== id));
  };

  // CRUD operations for sub-account transactions
  const addSubAccountTransaction = (transaction: Omit<SubAccountTransaction, "id">) => {
    const newTransaction = { id: generateId(), ...transaction };
    setSubAccountTransactions([...subAccountTransactions, newTransaction]);
  };

  const updateSubAccountTransaction = (id: string, transaction: Partial<SubAccountTransaction>) => {
    setSubAccountTransactions(subAccountTransactions.map(trans => 
      trans.id === id ? { ...trans, ...transaction } : trans
    ));
  };

  const deleteSubAccountTransaction = (id: string) => {
    setSubAccountTransactions(subAccountTransactions.filter(trans => trans.id !== id));
  };

  // Update settings
  const updateSettings = (newSettings: Partial<typeof defaultSettings>) => {
    setSettings({ ...settings, ...newSettings });
  };

  // Utility functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: settings.currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Helper function to get month name
  const getMonthName = (month: number) => {
    const date = new Date();
    date.setMonth(month - 1);
    return date.toLocaleString('default', { month: 'short' });
  };

  // Calculate monthly budget
  const calculateMonthlyBudget = (month: number, year: number) => {
    const income = budgetItems
      .filter(item => item.type === 'income')
      .reduce((total, item) => {
        const monthKey = getMonthName(month).toLowerCase();
        return total + (item.amounts[monthKey] || 0);
      }, 0);

    const expenses = budgetItems
      .filter(item => item.type === 'expense')
      .reduce((total, item) => {
        const monthKey = getMonthName(month).toLowerCase();
        return total + (item.amounts[monthKey] || 0);
      }, 0);

    return { income, expenses, net: income - expenses };
  };

  // Calculate actual spending for a month
  const calculateActualSpending = (month: number, year: number) => {
    // Filter transactions for the specified month and year
    const filteredTransactions = transactions.filter(transaction => {
      const date = new Date(transaction.date);
      return date.getMonth() + 1 === month && date.getFullYear() === year;
    });

    // Calculate income
    const income = filteredTransactions.reduce((total, transaction) => {
      const category = categories.find(c => c.id === transaction.category);
      if (category && ["JD Salary", "Interest", "Miscellaneous Income"].includes(category.name)) {
        return total + (transaction.deposit || 0);
      }
      return total;
    }, 0);

    // Calculate expenses
    const expenses = filteredTransactions.reduce((total, transaction) => {
      const category = categories.find(c => c.id === transaction.category);
      if (category && !["JD Salary", "Interest", "Miscellaneous Income", "Beginning Balance", "Transfer"].includes(category.name)) {
        return total + (transaction.payment || 0);
      }
      return total;
    }, 0);

    // Calculate by category
    const byCategory: Record<string, { budgeted: number, actual: number, difference: number }> = {};

    // First populate with budgeted amounts
    budgetItems.forEach(item => {
      const monthKey = getMonthName(month).toLowerCase();
      const amount = item.amounts[monthKey] || 0;
      const categoryName = categories.find(c => c.id === item.category)?.name || item.category;
      
      byCategory[categoryName] = {
        budgeted: amount,
        actual: 0,
        difference: -amount, // Will be updated after calculating actual
      };
    });

    // Then add actual spending
    filteredTransactions.forEach(transaction => {
      const categoryObj = categories.find(c => c.id === transaction.category);
      if (!categoryObj) return;
      
      const categoryName = categoryObj.name;
      const amount = transaction.payment || transaction.deposit || 0;
      
      if (!byCategory[categoryName]) {
        byCategory[categoryName] = {
          budgeted: 0,
          actual: 0,
          difference: 0,
        };
      }
      
      // Increase actual amount based on transaction type
      if (["JD Salary", "Interest", "Miscellaneous Income"].includes(categoryName)) {
        byCategory[categoryName].actual += (transaction.deposit || 0);
      } else if (!["Beginning Balance", "Transfer"].includes(categoryName)) {
        byCategory[categoryName].actual += (transaction.payment || 0);
      }
      
      // Recalculate difference
      byCategory[categoryName].difference = byCategory[categoryName].actual - byCategory[categoryName].budgeted;
    });

    return { income, expenses, net: income - expenses, byCategory };
  };

  // Generate report data
  const generateReportData = (month: number, year: number, yearToDate = false) => {
    const result = {
      budgetSummary: {
        income: 0,
        expenses: 0,
        net: 0,
      },
      actualSummary: {
        income: 0,
        expenses: 0,
        net: 0,
      },
      difference: {
        income: 0,
        expenses: 0,
        net: 0,
      },
      categories: {} as Record<string, {
        budget: number;
        actual: number;
        difference: number;
      }>,
    };

    if (yearToDate) {
      // Calculate for all months up to the specified month
      for (let m = 1; m <= month; m++) {
        const monthlyBudget = calculateMonthlyBudget(m, year);
        const monthlyActual = calculateActualSpending(m, year);

        result.budgetSummary.income += monthlyBudget.income;
        result.budgetSummary.expenses += monthlyBudget.expenses;
        result.actualSummary.income += monthlyActual.income;
        result.actualSummary.expenses += monthlyActual.expenses;

        // Add categories
        Object.entries(monthlyActual.byCategory).forEach(([categoryName, data]) => {
          if (!result.categories[categoryName]) {
            result.categories[categoryName] = {
              budget: 0,
              actual: 0,
              difference: 0,
            };
          }

          result.categories[categoryName].budget += data.budgeted;
          result.categories[categoryName].actual += data.actual;
        });
      }
    } else {
      // Just for the specified month
      const monthlyBudget = calculateMonthlyBudget(month, year);
      const monthlyActual = calculateActualSpending(month, year);

      result.budgetSummary = monthlyBudget;
      result.actualSummary = {
        income: monthlyActual.income,
        expenses: monthlyActual.expenses,
        net: monthlyActual.income - monthlyActual.expenses,
      };

      // Add categories
      Object.entries(monthlyActual.byCategory).forEach(([categoryName, data]) => {
        result.categories[categoryName] = {
          budget: data.budgeted,
          actual: data.actual,
          difference: data.difference,
        };
      });
    }

    // Calculate nets and differences
    result.budgetSummary.net = result.budgetSummary.income - result.budgetSummary.expenses;
    result.actualSummary.net = result.actualSummary.income - result.actualSummary.expenses;
    
    result.difference = {
      income: result.actualSummary.income - result.budgetSummary.income,
      expenses: result.actualSummary.expenses - result.budgetSummary.expenses,
      net: result.actualSummary.net - result.budgetSummary.net,
    };

    // Calculate differences for each category
    Object.keys(result.categories).forEach((category) => {
      result.categories[category].difference = 
        result.categories[category].actual - result.categories[category].budget;
    });

    return result;
  };

  // Generate yearly report data
  const generateYearlyReportData = (year: number) => {
    const monthlyData = [];

    // Get data for each month
    for (let month = 1; month <= 12; month++) {
      const data = {
        month,
        monthName: getMonthName(month),
        income: 0,
        expenses: 0,
        net: 0,
      };

      // Get actual spending for the month
      const monthlyActual = calculateActualSpending(month, year);
      data.income = monthlyActual.income;
      data.expenses = monthlyActual.expenses;
      data.net = monthlyActual.net;

      monthlyData.push(data);
    }

    // Calculate totals
    const totals = {
      income: monthlyData.reduce((sum, data) => sum + data.income, 0),
      expenses: monthlyData.reduce((sum, data) => sum + data.expenses, 0),
      net: monthlyData.reduce((sum, data) => sum + data.net, 0),
    };

    // Calculate averages
    const averages = {
      income: totals.income / 12,
      expenses: totals.expenses / 12,
      net: totals.net / 12,
    };

    // Get categorical breakdown
    const categoryBreakdown: Record<string, { total: number; average: number }> = {};

    // For each month, get spending by category
    for (let month = 1; month <= 12; month++) {
      const { byCategory } = calculateActualSpending(month, year);

      Object.entries(byCategory).forEach(([category, data]) => {
        if (!categoryBreakdown[category]) {
          categoryBreakdown[category] = { total: 0, average: 0 };
        }

        // For income categories, add deposits; for expense categories, add payments
        const isIncome = ["JD Salary", "Interest", "Miscellaneous Income"].includes(category);
        const amount = isIncome ? data.actual : data.actual;
        
        categoryBreakdown[category].total += amount;
      });
    }

    // Calculate averages for each category
    Object.keys(categoryBreakdown).forEach(category => {
      categoryBreakdown[category].average = categoryBreakdown[category].total / 12;
    });

    return {
      monthlyData,
      totals,
      averages,
      categoryBreakdown,
    };
  };

  // Context value
  const value = {
    accounts,
    transactions,
    categories,
    budgetItems,
    subAccounts,
    subAccountTransactions,
    settings,
    
    addAccount,
    updateAccount,
    deleteAccount,
    
    addTransaction,
    updateTransaction,
    deleteTransaction,
    
    addCategory,
    updateCategory,
    deleteCategory,
    
    addBudgetItem,
    updateBudgetItem,
    deleteBudgetItem,
    
    addSubAccount,
    updateSubAccount,
    deleteSubAccount,
    
    addSubAccountTransaction,
    updateSubAccountTransaction,
    deleteSubAccountTransaction,
    
    updateSettings,
    
    calculateMonthlyBudget,
    calculateActualSpending,
    generateReportData,
    generateYearlyReportData,
    formatCurrency,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};

// Custom hook to use the finance context
export const useFinance = () => useContext(FinanceContext);
