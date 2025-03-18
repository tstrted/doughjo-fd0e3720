
import { useState, useEffect } from "react";
import { BudgetItem } from "@/types/finance";
import { generateId } from "@/data/financeDefaults";

export const useBudget = () => {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);

  // Load budget items from localStorage on initial mount
  useEffect(() => {
    try {
      const storedBudgetItems = localStorage.getItem("budgetItems");
      if (storedBudgetItems) {
        setBudgetItems(JSON.parse(storedBudgetItems));
      }
    } catch (error) {
      console.error("Error loading budget items from localStorage:", error);
    }
  }, []);

  // Save budget items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("budgetItems", JSON.stringify(budgetItems));
    } catch (error) {
      console.error("Error saving budget items to localStorage:", error);
    }
  }, [budgetItems]);

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

  return {
    budgetItems,
    addBudgetItem,
    updateBudgetItem,
    deleteBudgetItem
  };
};
