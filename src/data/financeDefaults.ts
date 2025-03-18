
import { Account, Category, Currency } from "@/types/finance";

// Default settings
export const defaultSettings = {
  currency: "ZAR" as Currency,
  financialYearStart: "01/01/2025",
  currentMonth: new Date().getMonth() + 1,
  currentYear: new Date().getFullYear(),
};

// Default accounts
export const defaultAccounts: Account[] = [
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
export const defaultCategories: Category[] = [
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

// Generate unique ID helper
export const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
