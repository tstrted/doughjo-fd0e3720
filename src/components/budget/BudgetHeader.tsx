
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BudgetHeaderProps {
  onAddBudgetItem: () => void;
}

const BudgetHeader: React.FC<BudgetHeaderProps> = ({ onAddBudgetItem }) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold tracking-tight">Budget Planning</h2>
      <Button onClick={onAddBudgetItem}>
        <Plus className="mr-2 h-4 w-4" /> Add Budget Item
      </Button>
    </div>
  );
};

export default BudgetHeader;
