
import React, { useState } from "react";
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

  // Mock data for category groups (in real app this would be derived from budgetItems)
  const [categoryGroups, setCategoryGroups] = useState([
    {
      name: "Available",
      total: -720.00,
      expanded: true,
      categories: []
    },
    {
      name: "Spending",
      total: 6270.00,
      expanded: true,
      categories: [
        { id: "1", name: "Groceries", budgeted: 240.00, spent: 0, dueDate: undefined },
        { id: "2", name: "Gas", budgeted: 100.00, spent: 140.00, dueDate: undefined },
        { id: "3", name: "Netflix", budgeted: 149.00, spent: 0, dueDate: "1st" },
        { id: "4", name: "School", budgeted: 2500.00, spent: 0, dueDate: "1st" },
        { id: "5", name: "Dance", budgeted: 465.00, spent: 0, dueDate: undefined },
        { id: "6", name: "Tennis", budgeted: 2606.00, spent: 250.00, dueDate: undefined },
        { id: "7", name: "Fun Fund", budgeted: 1000.00, spent: 400.00, dueDate: undefined },
      ]
    },
    {
      name: "Debt Payment",
      total: -10000.00,
      expanded: true,
      categories: [
        { id: "8", name: "Car", budgeted: 8960.00, spent: 8960.00, dueDate: "1st" },
        { id: "9", name: "House Loan", budgeted: 10000.00, spent: 20000.00, dueDate: "1st" },
      ]
    }
  ]);

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
  
  // Calculate unbudgeted funds (this is mock data, replace with real calculation)
  const unbudgetedFunds = 0;

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
          <BudgetCategoryList
            categoryGroups={categoryGroups}
            onToggleGroup={handleToggleGroup}
          />
        </div>
        
        {/* Section 3: Right side with stats cards */}
        <div className="md:col-span-1 space-y-4">
          <BudgetStatsCard
            title="Monthly Income"
            amount={income}
            trendPercentage={5.2}
            trendDirection="up"
          />
          
          <BudgetStatsCard
            title="Budgeted Expenses"
            amount={expenses}
            trendPercentage={2.1}
            trendDirection="down"
          />
          
          <BudgetStatsCard
            title="Spending to Date"
            amount={actualSpending.expenses}
            trendPercentage={Math.abs(actualSpending.expenses / expenses) * 10}
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
