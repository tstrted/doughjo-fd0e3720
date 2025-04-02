
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Download, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TransactionFilterPanel } from "./TransactionFilterPanel";

interface TransactionFiltersProps {
  onAddTransaction: () => void;
  onFilterChange: (filter: {
    account: string;
    category: string;
    startDate: string;
    endDate: string;
    searchTerm?: string;
  }) => void;
  filter: {
    account: string;
    category: string;
    startDate: string;
    endDate: string;
    searchTerm?: string;
  };
  accounts: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  onResetFilters: () => void;
  onExportTransactions?: () => void;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  onAddTransaction,
  onFilterChange,
  filter,
  accounts,
  categories,
  onResetFilters,
  onExportTransactions,
}) => {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState(filter.searchTerm || "");

  // Update local search term when filter changes
  React.useEffect(() => {
    setSearchTerm(filter.searchTerm || "");
  }, [filter.searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({
      ...filter,
      searchTerm: searchTerm,
    });
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            size="icon" 
            className="border-none"
            onClick={() => setIsFilterOpen(true)}
          >
            <Filter className="mr-0 h-5 w-5" />
          </Button>
          
          <Button 
            className="gap-2 bg-primary text-white"
            onClick={onAddTransaction}
          >
            <Plus className="h-5 w-5" /> Add Transaction
          </Button>
          
          {onExportTransactions && (
            <Button 
              variant="outline" 
              size="icon" 
              className="border-none"
              onClick={onExportTransactions}
            >
              <Download className="mr-0 h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      
      <form onSubmit={handleSearchSubmit} className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="search"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="h-9"
        />
        <Button type="submit" size="sm" className="h-9">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>

      <TransactionFilterPanel
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        filter={filter}
        onFilterChange={onFilterChange}
        accounts={accounts}
        categories={categories}
        onResetFilters={onResetFilters}
      />
    </div>
  );
};
