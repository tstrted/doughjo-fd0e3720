
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BudgetItem, Category } from "@/types/finance";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

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

  // Handler for setting a monthly amount for a new budget item
  const handleSetMonthlyAmount = (month: string, value: string) => {
    if (type === "add" && setNewBudgetItem && newBudgetItem) {
      const amount = parseFloat(value) || 0;
      setNewBudgetItem({
        ...newBudgetItem,
        amounts: {
          ...newBudgetItem.amounts,
          [month.toLowerCase()]: amount
        }
      });
    }
  };

  // Handler for setting a monthly amount for an existing budget item
  const handleSetCurrentMonthlyAmount = (month: string, value: string) => {
    if (type === "edit" && setCurrentBudgetItem && currentBudgetItem) {
      const amount = parseFloat(value) || 0;
      setCurrentBudgetItem({
        ...currentBudgetItem,
        amounts: {
          ...currentBudgetItem.amounts,
          [month.toLowerCase()]: amount
        }
      });
    }
  };

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
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label>Bulk Amount Setting</Label>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={selectAllMonths}>Select All</Button>
                <Button type="button" variant="outline" size="sm" onClick={clearMonthSelections}>Clear</Button>
              </div>
            </div>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="0.00"
                value={bulkAmount}
                onChange={(e) => setBulkAmount(e.target.value)}
              />
              <Button type="button" onClick={applyBulkAmount}>Apply</Button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {months.map((month) => (
                <div key={month} className="flex items-center space-x-2">
                  <Checkbox
                    id={`select-${month}`}
                    checked={selectedMonths[month] || false}
                    onCheckedChange={() => toggleMonth(month)}
                  />
                  <Label
                    htmlFor={`select-${month}`}
                    className="text-sm cursor-pointer"
                  >
                    {month.charAt(0).toUpperCase() + month.slice(1)}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            <Label>Monthly Amounts</Label>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {months.map((month) => (
                <div key={month} className="flex items-center space-x-2">
                  <Label htmlFor={`month-${month}`} className="w-10 flex-shrink-0">
                    {month.charAt(0).toUpperCase() + month.slice(1)}
                  </Label>
                  <Input
                    id={`month-${month}`}
                    type="number"
                    placeholder="0.00"
                    value={newBudgetItem.amounts[month] || ""}
                    onChange={(e) => handleSetMonthlyAmount(month, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>Add Budget Item</Button>
        </DialogFooter>
      </DialogContent>
    );
  }

  if (type === "edit" && currentBudgetItem && setCurrentBudgetItem) {
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
          <div className="grid gap-4">
            <Label>Monthly Amounts</Label>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {months.map((month) => (
                <div key={month} className="flex items-center space-x-2">
                  <Label htmlFor={`edit-month-${month}`} className="w-10 flex-shrink-0">
                    {month.charAt(0).toUpperCase() + month.slice(1)}
                  </Label>
                  <Input
                    id={`edit-month-${month}`}
                    type="number"
                    placeholder="0.00"
                    value={currentBudgetItem.amounts[month] || ""}
                    onChange={(e) => handleSetCurrentMonthlyAmount(month, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>Update Budget Item</Button>
        </DialogFooter>
      </DialogContent>
    );
  }

  return null;
};

export default BudgetItemForm;
