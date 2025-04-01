
import { useState, useEffect } from "react";
import { Currency } from "@/types/finance";
import { defaultSettings } from "@/data/financeDefaults";

interface Settings {
  currency: Currency;
  financialYearStart: string;
  currentMonth: number;
  currentYear: number;
  darkMode: boolean;
}

// Currency symbol mapping
const currencySymbols: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  ZAR: "R",
  AUD: "A$"
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>({
    ...defaultSettings,
    darkMode: false
  });

  // Load settings from localStorage on initial mount
  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem("settings");
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error("Error loading settings from localStorage:", error);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("settings", JSON.stringify(settings));
    } catch (error) {
      console.error("Error saving settings to localStorage:", error);
    }
  }, [settings]);

  // Apply dark mode class to HTML element
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Update settings
  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings({ ...settings, ...newSettings });
  };

  // Format currency using symbols instead of codes
  const formatCurrency = (amount: number): string => {
    const symbol = currencySymbols[settings.currency] || "$";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: settings.currency,
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: 2,
    }).format(amount)
      // Replace the currency code with just the symbol
      .replace(settings.currency, symbol);
  };

  return {
    settings,
    updateSettings,
    formatCurrency
  };
};
