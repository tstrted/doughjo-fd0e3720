
import React from "react";
import { Label } from "@/components/ui/label";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BudgetItem, Category } from "@/types/finance";
import BulkAmountSetter from "./BulkAmountSetter";
import MonthlyAmountInputs from "./MonthlyAmountInputs";

interface AddBudgetItemFormProps {
  newBudgetItem: {
    category: string;
    type: "income" | "expense";
    amounts: Record<string, number>;
  };
  setNewBudgetItem: React.Dispatch<React.SetStateAction<{
    category: string;
    type: "income" | "expense";
    amounts: Record<string, number>;
  }>>;
  months: string[];
  selectedMonths: Record<string, boolean>;
  bulkAmount: string;
  setBulkAmount: (value: string) => void;
  toggleMonth: (month: string) => void;
  selectAllMonths: () => void;
  clearMonthSelections: () => void;
  applyBulkAmount: () => void;
  onClose: () => void;
  onSave: () => void;
  categories: Category[];
  getCategoryName: (categoryId: string) => string;
  formatCurrency: (amount: number) => string;
}

const AddBudgetItemForm: React.FC<AddBudgetItemFormProps> = ({
  newBudgetItem,
  setNewBudgetItem,
  months,
  selectedMonths,
  bulkAmount,
  setBulkAmount,
  toggleMonth,
  selectAllMonths,
  clearMonthSelections,
  applyBulkAmount,
  onClose,
  onSave,
  categories,
  getCategoryName,
  formatCurrency,
}) => {
  // Handler for setting a monthly amount
  const handleSetMonthlyAmount = (month: string, value: string) => {
    const amount = parseFloat(value) || 0;
    setNewBudgetItem({
      ...newBudgetItem,
      amounts: {
        ...newBudgetItem.amounts,
        [month.toLowerCase()]: amount
      }
    });
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Add New Budget Item</DialogTitle>
        <DialogDescription>
          Create a new budget item and set monthly amounts.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={newBudgetItem.type}
            onValueChange={(value: "income" | "expense") => 
              setNewBudgetItem({ ...newBudgetItem, type: value })
            }
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={newBudgetItem.category}
            onValueChange={(value) => 
              setNewBudgetItem({ ...newBudgetItem, category: value })
            }
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories
                .filter(c => {
                  // Filter categories based on the selected type
                  if (newBudgetItem.type === "income") {
                    return ["JD Salary", "Interest", "Miscellaneous Income"].includes(c.name);
                  } else {
                    return !["JD Salary", "Interest", "Miscellaneous Income", "Beginning Balance", "Transfer"].includes(c.name);
                  }
                })
                .map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>
        <BulkAmountSetter
          months={months}
          selectedMonths={selectedMonths}
          bulkAmount={bulkAmount}
          setBulkAmount={setBulkAmount}
          toggleMonth={toggleMonth}
          selectAllMonths={selectAllMonths}
          clearMonthSelections={clearMonthSelections}
          applyBulkAmount={applyBulkAmount}
          formatCurrency={formatCurrency}
        />
        <MonthlyAmountInputs
          months={months}
          amounts={newBudgetItem.amounts}
          onChange={handleSetMonthlyAmount}
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onSave}>Add Budget Item</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default AddBudgetItemForm;
