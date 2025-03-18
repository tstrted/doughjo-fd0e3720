
import { useState, useEffect } from "react";
import { Account } from "@/types/finance";
import { defaultAccounts, generateId } from "@/data/financeDefaults";

export const useAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>(defaultAccounts);

  // Load accounts from localStorage on initial mount
  useEffect(() => {
    try {
      const storedAccounts = localStorage.getItem("accounts");
      if (storedAccounts) {
        setAccounts(JSON.parse(storedAccounts));
      }
    } catch (error) {
      console.error("Error loading accounts from localStorage:", error);
    }
  }, []);

  // Save accounts to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("accounts", JSON.stringify(accounts));
    } catch (error) {
      console.error("Error saving accounts to localStorage:", error);
    }
  }, [accounts]);

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

  return {
    accounts,
    addAccount,
    updateAccount,
    deleteAccount
  };
};
