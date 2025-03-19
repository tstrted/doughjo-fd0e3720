
import React from "react";
import { Label } from "@/components/ui/label";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BudgetItem, Category } from "@/types/finance";
import MonthlyAmountInputs from "./MonthlyAmountInputs";

interface EditBudgetItemFormProps {
  currentBudgetItem: BudgetItem;
  setCurrentBudgetItem: React.Dispatch<React.SetStateAction<BudgetItem | null>>;
  months: string[];
  onClose: () => void;
  onSave: () => void;
  getCategoryName: (categoryId: string) => string;
}

const EditBudgetItemForm: React.FC<EditBudgetItemFormProps> = ({
  currentBudgetItem,
  setCurrentBudgetItem,
  months,
  onClose,
  onSave,
  getCategoryName,
}) => {
  // Handler for setting a monthly amount
  const handleSetCurrentMonthlyAmount = (month: string, value: string) => {
    const amount = parseFloat(value) || 0;
    setCurrentBudgetItem({
      ...currentBudgetItem,
      amounts: {
        ...currentBudgetItem.amounts,
        [month.toLowerCase()]: amount
      }
    });
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Edit Budget Item</DialogTitle>
        <DialogDescription>
          Update monthly amounts for this budget item.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">
            {currentBudgetItem.type === 'income' ? 'Income' : 'Expense'}: {getCategoryName(currentBudgetItem.category)}
          </h3>
        </div>
        <MonthlyAmountInputs
          months={months}
          amounts={currentBudgetItem.amounts}
          onChange={handleSetCurrentMonthlyAmount}
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onSave}>Update Budget Item</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default EditBudgetItemForm;
