
import { useState, useEffect } from "react";
import { Category } from "@/types/finance";
import { defaultCategories, generateId } from "@/data/financeDefaults";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);

  // Load categories from localStorage on initial mount
  useEffect(() => {
    try {
      const storedCategories = localStorage.getItem("categories");
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      }
    } catch (error) {
      console.error("Error loading categories from localStorage:", error);
    }
  }, []);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("categories", JSON.stringify(categories));
    } catch (error) {
      console.error("Error saving categories to localStorage:", error);
    }
  }, [categories]);

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

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory
  };
};
