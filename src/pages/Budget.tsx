
import React, { useState, useEffect } from "react";
import { useFinance } from "@/context/FinanceContext";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { BudgetItem } from "@/types/finance";

// Import smaller components
import BudgetItemForm from "@/components/budget/BudgetItemForm";
import MonthNavigator from "@/components/budget/MonthNavigator";
import BalanceCard from "@/components/budget/BalanceCard";
import BudgetCategoryList from "@/components/budget/BudgetCategoryList";
import BudgetStatsCard from "@/components/budget/BudgetStatsCard";
import BudgetItemsTable from "@/components/budget/BudgetItemsTable";

const Budget = () => {
  const {
    budgetItems,
    categories,
    transactions,
    addBudgetItem,
    updateBudgetItem,
    deleteBudgetItem,
    calculateMonthlyBudget,
    calculateActualSpending,
    formatCurrency
  } = useFinance();

  const { toast } = useToast();
  const [activeMonth, setActiveMonth] = useState<number>(new Date().getMonth() + 1);
  const [activeYear, setActiveYear] = useState<number>(new Date().getFullYear());
  const [isAddBudgetItemOpen, setIsAddBudgetItemOpen] = useState(false);
  const [isEditBudgetItemOpen, setIsEditBudgetItemOpen] = useState(false);
  const [currentBudgetItem, setCurrentBudgetItem] = useState<BudgetItem | null>(null);

  // Initialize empty categoryGroups
  const [categoryGroups, setCategoryGroups] = useState([
    {
      name: "Available",
      total: 0,
      expanded: true,
      categories: []
    },
    {
      name: "Spending",
      total: 0,
      expanded: true,
      categories: []
    },
    {
      name: "Debt Payment",
      total: 0,
      expanded: true,
      categories: []
    }
  ]);

  // Effect to update categoryGroups whenever relevant data changes
  useEffect(() => {
    // Transform budget items into category groups
    const activeMonthKey = months[activeMonth - 1].toLowerCase();
    
    // Process income items
    const incomeItems = budgetItems.filter(item => item.type === "income");
    const incomeTotal = incomeItems.reduce((sum, item) => {
      return sum + (item.amounts[activeMonthKey] || 0);
    }, 0);
    
    // Process expense items
    const expenseItems = budgetItems.filter(item => item.type === "expense");
    const expenseTotal = expenseItems.reduce((sum, item) => {
      return sum + (item.amounts[activeMonthKey] || 0);
    }, 0);
    
    // Process spending categories
    const spendingCategories = expenseItems
      .filter(item => {
        const category = categories.find(c => c.id === item.category);
        return category && category.type !== "D"; // Not debt
      })
      .map(item => {
        const category = categories.find(c => c.id === item.category);
        return {
          id: item.id,
          name: category ? category.name : "Unknown",
          amount: item.amounts[activeMonthKey] || 0,
          spent: 0 // Would be calculated from transactions
        };
      });
    
    // Process debt categories
    const debtCategories = expenseItems
      .filter(item => {
        const category = categories.find(c => c.id === item.category);
        return category && category.type === "D"; // Debt type
      })
      .map(item => {
        const category = categories.find(c => c.id === item.category);
        return {
          id: item.id,
          name: category ? category.name : "Unknown",
          amount: item.amounts[activeMonthKey] || 0,
          spent: 0 // Would be calculated from transactions
        };
      });
    
    // Update category groups
    setCategoryGroups([
      {
        name: "Available",
        total: incomeTotal - expenseTotal,
        expanded: true,
        categories: incomeItems.map(item => {
          const category = categories.find(c => c.id === item.category);
          return {
            id: item.id,
            name: category ? category.name : "Unknown",
            amount: item.amounts[activeMonthKey] || 0,
            spent: 0
          };
        })
      },
      {
        name: "Spending",
        total: spendingCategories.reduce((sum, cat) => sum + cat.amount, 0),
        expanded: true,
        categories: spendingCategories
      },
      {
        name: "Debt Payment",
        total: debtCategories.reduce((sum, cat) => sum + cat.amount, 0),
        expanded: true,
        categories: debtCategories
      }
    ]);
  }, [budgetItems, categories, transactions, activeMonth, activeYear]);

  // New budget item state
  const [newBudgetItem, setNewBudgetItem] = useState({
    category: "",
    type: "expense" as "income" | "expense",
    amounts: {} as Record<string, number>
  });

  // Months for display
  const months = [
    'jan', 'feb', 'mar', 'apr', 'may', 'jun',
    'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
  ];

  // Calculate budget summary for the active month
  const { income, expenses, net } = calculateMonthlyBudget(activeMonth, activeYear);
  
  // Get actual spending for comparison
  const actualSpending = calculateActualSpending(activeMonth, activeYear);
  
  // Calculate unbudgeted funds
  const unbudgetedFunds = income - expenses;

  // Handler for toggling category group expansion
  const handleToggleGroup = (groupName: string) => {
    setCategoryGroups(
      categoryGroups.map(group => 
        group.name === groupName 
          ? { ...group, expanded: !group.expanded } 
          : group
      )
    );
  };

  // Get category name for display
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  // Handler for adding a new budget item
  const handleAddBudgetItem = () => {
    if (!newBudgetItem.category) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive"
      });
      return;
    }

    addBudgetItem(newBudgetItem);
    
    setNewBudgetItem({
      category: "",
      type: "expense",
      amounts: {}
    });
    
    setIsAddBudgetItemOpen(false);
    
    toast({
      title: "Success",
      description: "Budget item added successfully",
    });
  };

  // Handler for updating a budget item
  const handleUpdateBudgetItem = () => {
    if (!currentBudgetItem) return;
    
    updateBudgetItem(currentBudgetItem.id, currentBudgetItem);
    setIsEditBudgetItemOpen(false);
    setCurrentBudgetItem(null);
    
    toast({
      title: "Success",
      description: "Budget item updated successfully",
    });
  };

  // Handle month navigation
  const handlePreviousMonth = () => {
    if (activeMonth === 1) {
      setActiveMonth(12);
      setActiveYear(activeYear - 1);
    } else {
      setActiveMonth(activeMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (activeMonth === 12) {
      setActiveMonth(1);
      setActiveYear(activeYear + 1);
    } else {
      setActiveMonth(activeMonth + 1);
    }
  };

  // Filter budget items by type
  const incomeItems = budgetItems.filter(item => item.type === "income");
  const expenseItems = budgetItems.filter(item => item.type === "expense");

  // Handlers for editing and deleting budget items
  const handleEditBudgetItem = (item: BudgetItem) => {
    setCurrentBudgetItem(item);
    setIsEditBudgetItemOpen(true);
  };

  const handleDeleteBudgetItem = (id: string) => {
    deleteBudgetItem(id);
    toast({
      title: "Success",
      description: "Budget item deleted successfully",
    });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Section 1: Top row with month navigator and summary cards */}
        <div className="md:col-span-1">
          <MonthNavigator
            activeMonth={activeMonth}
            activeYear={activeYear}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
            onAddCategory={() => setIsAddBudgetItemOpen(true)}
          />
        </div>
        
        <div className="md:col-span-1">
          <BalanceCard
            title="Net Balance"
            amount={net}
            percentOfExpenses={expenses !== 0 ? (net / expenses) * 100 : 0}
            isNegative={net < 0}
          />
        </div>
        
        <div className="md:col-span-1">
          <BalanceCard
            title="Unbudgeted Funds"
            amount={unbudgetedFunds}
            percentOfExpenses={expenses !== 0 ? (unbudgetedFunds / expenses) * 100 : 0}
            isNegative={unbudgetedFunds < 0}
          />
        </div>
      </div>

      {/* Main content area with categories and stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Section 2: Left side with budget categories */}
        <div className="md:col-span-2">
          {/* Display the BudgetCategoryList for visual categories */}
          <BudgetCategoryList
            categoryGroups={categoryGroups}
            onToggleGroup={handleToggleGroup}
          />
          
          {/* Add BudgetItemsTable to show tabular data */}
          <div className="mt-6">
            <BudgetItemsTable
              incomeItems={incomeItems}
              expenseItems={expenseItems}
              months={months}
              activeMonth={activeMonth}
              getCategoryName={getCategoryName}
              onEditBudgetItem={handleEditBudgetItem}
              onDeleteBudgetItem={handleDeleteBudgetItem}
              onAddIncome={() => {
                setNewBudgetItem({
                  category: "",
                  type: "income",
                  amounts: {}
                });
                setIsAddBudgetItemOpen(true);
              }}
              onAddExpense={() => {
                setNewBudgetItem({
                  category: "",
                  type: "expense",
                  amounts: {}
                });
                setIsAddBudgetItemOpen(true);
              }}
            />
          </div>
        </div>
        
        {/* Section 3: Right side with stats cards */}
        <div className="md:col-span-1 space-y-4">
          <BudgetStatsCard
            title="Monthly Income"
            amount={income}
            trendPercentage={income > 0 ? 5.2 : 0}
            trendDirection="up"
          />
          
          <BudgetStatsCard
            title="Budgeted Expenses"
            amount={expenses}
            trendPercentage={expenses > 0 ? 2.1 : 0}
            trendDirection="down"
          />
          
          <BudgetStatsCard
            title="Spending to Date"
            amount={actualSpending.expenses}
            trendPercentage={Math.abs(actualSpending.expenses / (expenses || 1)) * 10}
            trendDirection={actualSpending.expenses > expenses ? "up" : "down"}
            trendLabel="of budget"
          />
        </div>
      </div>

      {/* Add Budget Item Dialog */}
      <Dialog open={isAddBudgetItemOpen} onOpenChange={setIsAddBudgetItemOpen}>
        <BudgetItemForm 
          type="add"
          newBudgetItem={newBudgetItem}
          setNewBudgetItem={setNewBudgetItem}
          onClose={() => setIsAddBudgetItemOpen(false)}
          onSave={handleAddBudgetItem}
          categories={categories}
          getCategoryName={getCategoryName}
          formatCurrency={formatCurrency}
        />
      </Dialog>

      {/* Edit Budget Item Dialog */}
      <Dialog open={isEditBudgetItemOpen} onOpenChange={setIsEditBudgetItemOpen}>
        <BudgetItemForm 
          type="edit"
          currentBudgetItem={currentBudgetItem}
          setCurrentBudgetItem={setCurrentBudgetItem}
          onClose={() => setIsEditBudgetItemOpen(false)}
          onSave={handleUpdateBudgetItem}
          categories={categories}
          getCategoryName={getCategoryName}
          formatCurrency={formatCurrency}
        />
      </Dialog>
    </div>
  );
};

export default Budget;
