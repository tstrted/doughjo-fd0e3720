
import { useState, useEffect } from "react";
import { SubAccount, SubAccountTransaction } from "@/types/finance";
import { generateId } from "@/data/financeDefaults";

export const useSubAccounts = () => {
  const [subAccounts, setSubAccounts] = useState<SubAccount[]>([]);
  const [subAccountTransactions, setSubAccountTransactions] = useState<SubAccountTransaction[]>([]);

  // Load subAccounts and transactions from localStorage on initial mount
  useEffect(() => {
    try {
      const storedSubAccounts = localStorage.getItem("subAccounts");
      const storedSubAccountTransactions = localStorage.getItem("subAccountTransactions");

      if (storedSubAccounts) setSubAccounts(JSON.parse(storedSubAccounts));
      if (storedSubAccountTransactions) setSubAccountTransactions(JSON.parse(storedSubAccountTransactions));
    } catch (error) {
      console.error("Error loading sub-account data from localStorage:", error);
    }
  }, []);

  // Save subAccounts and transactions to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("subAccounts", JSON.stringify(subAccounts));
    } catch (error) {
      console.error("Error saving sub-accounts to localStorage:", error);
    }
  }, [subAccounts]);

  useEffect(() => {
    try {
      localStorage.setItem("subAccountTransactions", JSON.stringify(subAccountTransactions));
    } catch (error) {
      console.error("Error saving sub-account transactions to localStorage:", error);
    }
  }, [subAccountTransactions]);

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

  return {
    subAccounts,
    subAccountTransactions,
    addSubAccount,
    updateSubAccount,
    deleteSubAccount,
    addSubAccountTransaction,
    updateSubAccountTransaction,
    deleteSubAccountTransaction
  };
};
