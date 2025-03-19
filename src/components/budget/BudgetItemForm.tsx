
import React, { useState } from "react";
import { BudgetItem, Category } from "@/types/finance";
import { useToast } from "@/hooks/use-toast";
import AddBudgetItemForm from "./AddBudgetItemForm";
import EditBudgetItemForm from "./EditBudgetItemForm";

interface BudgetItemFormProps {
  type: "add" | "edit";
  newBudgetItem?: {
    category: string;
    type: "income" | "expense";
    amounts: Record<string, number>;
  };
  currentBudgetItem?: BudgetItem | null;
  setNewBudgetItem?: React.Dispatch<React.SetStateAction<{
    category: string;
    type: "income" | "expense";
    amounts: Record<string, number>;
  }>>;
  setCurrentBudgetItem?: React.Dispatch<React.SetStateAction<BudgetItem | null>>;
  onClose: () => void;
  onSave: () => void;
  categories: Category[];
  getCategoryName: (categoryId: string) => string;
  formatCurrency: (amount: number) => string;
}

const BudgetItemForm: React.FC<BudgetItemFormProps> = ({
  type,
  newBudgetItem,
  currentBudgetItem,
  setNewBudgetItem,
  setCurrentBudgetItem,
  onClose,
  onSave,
  categories,
  getCategoryName,
  formatCurrency
}) => {
  const { toast } = useToast();
  const [bulkAmount, setBulkAmount] = useState<string>("");
  const [selectedMonths, setSelectedMonths] = useState<Record<string, boolean>>({});

  // Months for display
  const months = [
    'jan', 'feb', 'mar', 'apr', 'may', 'jun', 
    'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
  ];

  // Toggle month selection
  const toggleMonth = (month: string) => {
    setSelectedMonths({
      ...selectedMonths,
      [month]: !selectedMonths[month]
    });
  };

  // Select all months
  const selectAllMonths = () => {
    const allSelected = months.reduce((acc, month) => {
      acc[month] = true;
      return acc;
    }, {} as Record<string, boolean>);
    
    setSelectedMonths(allSelected);
  };

  // Clear all month selections
  const clearMonthSelections = () => {
    setSelectedMonths({});
  };

  // Handler for applying bulk amount to selected months
  const applyBulkAmount = () => {
    if (type === "add" && setNewBudgetItem && newBudgetItem) {
      const amount = parseFloat(bulkAmount) || 0;
      const newAmounts = {...newBudgetItem.amounts};
      
      for (const month of months) {
        if (selectedMonths[month]) {
          newAmounts[month] = amount;
        }
      }
      
      setNewBudgetItem({
        ...newBudgetItem,
        amounts: newAmounts
      });
      
      toast({
        title: "Applied",
        description: `Applied ${formatCurrency(amount)} to selected months`,
      });
    }
  };

  if (type === "add" && newBudgetItem && setNewBudgetItem) {
    return (
      <AddBudgetItemForm
        newBudgetItem={newBudgetItem}
        setNewBudgetItem={setNewBudgetItem}
        months={months}
        selectedMonths={selectedMonths}
        bulkAmount={bulkAmount}
        setBulkAmount={setBulkAmount}
        toggleMonth={toggleMonth}
        selectAllMonths={selectAllMonths}
        clearMonthSelections={clearMonthSelections}
        applyBulkAmount={applyBulkAmount}
        onClose={onClose}
        onSave={onSave}
        categories={categories}
        getCategoryName={getCategoryName}
        formatCurrency={formatCurrency}
      />
    );
  }

  if (type === "edit" && currentBudgetItem && setCurrentBudgetItem) {
    return (
      <EditBudgetItemForm
        currentBudgetItem={currentBudgetItem}
        setCurrentBudgetItem={setCurrentBudgetItem}
        months={months}
        onClose={onClose}
        onSave={onSave}
        getCategoryName={getCategoryName}
      />
    );
  }

  return null;
};

export default BudgetItemForm;
