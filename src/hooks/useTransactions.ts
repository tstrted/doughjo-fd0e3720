
import { useState, useEffect } from "react";
import { Transaction } from "@/types/finance";
import { generateId } from "@/data/financeDefaults";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load transactions from localStorage on initial mount
  useEffect(() => {
    try {
      const storedTransactions = localStorage.getItem("transactions");
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      } else {
        // Ensure we start with empty array if nothing in localStorage
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error loading transactions from localStorage:", error);
      // On error, reset to empty array
      setTransactions([]);
    }
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("transactions", JSON.stringify(transactions));
    } catch (error) {
      console.error("Error saving transactions to localStorage:", error);
    }
  }, [transactions]);

  // CRUD operations for transactions
  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = { 
      id: generateId(), 
      ...transaction,
      cleared: transaction.cleared || false,
      type: transaction.type || (transaction.deposit ? "deposit" : "payment")
    };
    setTransactions([...transactions, newTransaction]);
  };

  const updateTransaction = (id: string, transaction: Partial<Transaction>) => {
    setTransactions(transactions.map(trans => trans.id === id ? { ...trans, ...transaction } : trans));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(trans => trans.id !== id));
  };

  // Add clear method
  const clearTransactions = () => {
    setTransactions([]);
  };

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    clearTransactions
  };
};
