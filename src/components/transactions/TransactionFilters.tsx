
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Download } from "lucide-react";

interface TransactionFiltersProps {
  onAddTransaction: () => void;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  onAddTransaction,
}) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
      <div className="flex space-x-3">
        <Button variant="outline" size="icon" className="border-none">
          <Filter className="mr-0 h-5 w-5" />
        </Button>
        
        <Button 
          className="gap-2 bg-primary text-white"
          onClick={onAddTransaction}
        >
          <Plus className="h-5 w-5" /> Add Transaction
        </Button>

        <Button variant="outline" size="icon" className="border-none">
          <Plus className="mr-0 h-5 w-5" />
        </Button>
        
        <Button variant="outline" size="icon" className="border-none">
          <Download className="mr-0 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
