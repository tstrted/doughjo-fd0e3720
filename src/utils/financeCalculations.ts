
import { BudgetItem, BudgetSummary, Category, CategoryData, MonthlyData, ReportData, Transaction, YearlyReportData } from "@/types/finance";

// Helper function to get month name
export const getMonthName = (month: number): string => {
  const date = new Date();
  date.setMonth(month - 1);
  return date.toLocaleString('default', { month: 'short' });
};

// Calculate monthly budget
export const calculateMonthlyBudget = (
  month: number, 
  year: number, 
  budgetItems: BudgetItem[]
): BudgetSummary => {
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
export const calculateActualSpending = (
  month: number, 
  year: number, 
  transactions: Transaction[],
  categories: Category[],
  budgetItems: BudgetItem[]
) => {
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
export const generateReportData = (
  month: number, 
  year: number, 
  yearToDate = false,
  budgetItems: BudgetItem[],
  categories: Category[],
  transactions: Transaction[]
): ReportData => {
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
    categories: {} as Record<string, CategoryData>,
  };

  if (yearToDate) {
    // Calculate for all months up to the specified month
    for (let m = 1; m <= month; m++) {
      const monthlyBudget = calculateMonthlyBudget(m, year, budgetItems);
      const monthlyActual = calculateActualSpending(m, year, transactions, categories, budgetItems);

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
    const monthlyBudget = calculateMonthlyBudget(month, year, budgetItems);
    const monthlyActual = calculateActualSpending(month, year, transactions, categories, budgetItems);

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
export const generateYearlyReportData = (
  year: number,
  transactions: Transaction[],
  categories: Category[],
  budgetItems: BudgetItem[]
): YearlyReportData => {
  const monthlyData: MonthlyData[] = [];

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
    const monthlyActual = calculateActualSpending(month, year, transactions, categories, budgetItems);
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
    const { byCategory } = calculateActualSpending(month, year, transactions, categories, budgetItems);

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

// Format currency
export const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};
