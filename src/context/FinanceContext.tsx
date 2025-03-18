
import React, { createContext, useContext } from "react";
import { FinanceContextType } from "@/types/finance";
import { useAccounts } from "@/hooks/useAccounts";
import { useTransactions } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import { useBudget } from "@/hooks/useBudget";
import { useSubAccounts } from "@/hooks/useSubAccounts";
import { useSettings } from "@/hooks/useSettings";
import { calculateMonthlyBudget, calculateActualSpending, generateReportData, generateYearlyReportData } from "@/utils/financeCalculations";

// Export all types from the types file
export * from "@/types/finance";

// Create context with default values
export const FinanceContext = createContext<FinanceContextType>({} as FinanceContextType);

// Provider component
export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use our custom hooks
  const { accounts, addAccount, updateAccount, deleteAccount } = useAccounts();
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const { budgetItems, addBudgetItem, updateBudgetItem, deleteBudgetItem } = useBudget();
  const { 
    subAccounts, 
    subAccountTransactions, 
    addSubAccount,
    updateSubAccount,
    deleteSubAccount,
    addSubAccountTransaction,
    updateSubAccountTransaction,
    deleteSubAccountTransaction
  } = useSubAccounts();
  const { settings, updateSettings, formatCurrency } = useSettings();

  // Wrap the utility functions to provide the required state
  const wrappedCalculateMonthlyBudget = (month: number, year: number) => {
    return calculateMonthlyBudget(month, year, budgetItems);
  };

  const wrappedCalculateActualSpending = (month: number, year: number) => {
    return calculateActualSpending(month, year, transactions, categories, budgetItems);
  };

  const wrappedGenerateReportData = (month: number, year: number, yearToDate = false) => {
    return generateReportData(month, year, yearToDate, budgetItems, categories, transactions);
  };

  const wrappedGenerateYearlyReportData = (year: number) => {
    return generateYearlyReportData(year, transactions, categories, budgetItems);
  };

  // Context value
  const value: FinanceContextType = {
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
    
    calculateMonthlyBudget: wrappedCalculateMonthlyBudget,
    calculateActualSpending: wrappedCalculateActualSpending,
    generateReportData: wrappedGenerateReportData,
    generateYearlyReportData: wrappedGenerateYearlyReportData,
    formatCurrency,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};

// Custom hook to use the finance context
export const useFinance = () => useContext(FinanceContext);
