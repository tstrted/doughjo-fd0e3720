
import React, { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { BudgetItem } from "@/types/finance";

// Import smaller components
import BudgetHeader from "@/components/budget/BudgetHeader";
import BudgetSummary from "@/components/budget/BudgetSummary";
import BudgetOverview from "@/components/budget/BudgetOverview";
import BudgetItemForm from "@/components/budget/BudgetItemForm";
import BudgetItemsTable from "@/components/budget/BudgetItemsTable";

const Budget = () => {
  const { 
    budgetItems, 
    categories, 
    addBudgetItem, 
    updateBudgetItem, 
    deleteBudgetItem,
    calculateMonthlyBudget,
    formatCurrency
  } = useFinance();
  
  const { toast } = useToast();
  const [activeMonth, setActiveMonth] = useState<number>(new Date().getMonth() + 1);
  const [activeYear, setActiveYear] = useState<number>(new Date().getFullYear());
  const [isAddBudgetItemOpen, setIsAddBudgetItemOpen] = useState(false);
  const [isEditBudgetItemOpen, setIsEditBudgetItemOpen] = useState(false);
  const [currentBudgetItem, setCurrentBudgetItem] = useState<BudgetItem | null>(null);
  
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
  
  // Filter budget items by type
  const incomeItems = budgetItems.filter(item => item.type === 'income');
  const expenseItems = budgetItems.filter(item => item.type === 'expense');

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

  // Handler for initiating edit
  const handleEditBudgetItem = (item: BudgetItem) => {
    setCurrentBudgetItem({...item});
    setIsEditBudgetItemOpen(true);
  };

  // Handler for deleting a budget item
  const handleDeleteBudgetItem = (id: string) => {
    deleteBudgetItem(id);
    toast({
      title: "Success",
      description: "Budget item deleted successfully",
    });
  };

  // Add income item with preset type
  const handleAddIncomeItem = () => {
    setNewBudgetItem({...newBudgetItem, type: "income"});
    setIsAddBudgetItemOpen(true);
  };

  // Add expense item with preset type
  const handleAddExpenseItem = () => {
    setNewBudgetItem({...newBudgetItem, type: "expense"});
    setIsAddBudgetItemOpen(true);
  };

  // Handle month navigation
  const handlePreviousMonth = () => {
    setActiveMonth(activeMonth > 1 ? activeMonth - 1 : 12);
  };

  const handleNextMonth = () => {
    setActiveMonth(activeMonth < 12 ? activeMonth + 1 : 1);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <BudgetHeader onAddBudgetItem={() => setIsAddBudgetItemOpen(true)} />

      <BudgetSummary summary={{ income, expenses, net }} />

      <BudgetOverview 
        income={income}
        expenses={expenses}
        net={net}
        activeMonth={activeMonth}
        activeYear={activeYear}
        months={months}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
        expenseItems={expenseItems}
        getCategoryName={getCategoryName}
      />

      <BudgetItemsTable 
        incomeItems={incomeItems}
        expenseItems={expenseItems}
        months={months}
        activeMonth={activeMonth}
        getCategoryName={getCategoryName}
        onEditBudgetItem={handleEditBudgetItem}
        onDeleteBudgetItem={handleDeleteBudgetItem}
        onAddIncome={handleAddIncomeItem}
        onAddExpense={handleAddExpenseItem}
      />

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
