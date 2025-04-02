
import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

interface TransactionFilterPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filter: {
    account: string;
    category: string;
    startDate: string;
    endDate: string;
    searchTerm?: string;
  };
  onFilterChange: (filter: {
    account: string;
    category: string;
    startDate: string;
    endDate: string;
    searchTerm?: string;
  }) => void;
  accounts: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  onResetFilters: () => void;
}

export const TransactionFilterPanel: React.FC<TransactionFilterPanelProps> = ({
  open,
  onOpenChange,
  filter,
  onFilterChange,
  accounts,
  categories,
  onResetFilters,
}) => {
  // Local state to track filter changes before applying
  const [localFilter, setLocalFilter] = React.useState(filter);

  // Reset local filter when panel opens with new filter values
  React.useEffect(() => {
    setLocalFilter(filter);
  }, [filter, open]);

  const handleFilterChange = (field: string, value: string) => {
    setLocalFilter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilter);
    onOpenChange(false);
  };

  const handleResetFilters = () => {
    onResetFilters();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Filter Transactions</SheetTitle>
          <SheetDescription>
            Apply filters to narrow down your transaction list
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="account">Account</Label>
            <Select
              value={localFilter.account}
              onValueChange={(value) => handleFilterChange("account", value)}
            >
              <SelectTrigger id="account">
                <SelectValue placeholder="All Accounts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Accounts</SelectItem>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={localFilter.category}
              onValueChange={(value) => handleFilterChange("category", value)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="searchTerm">Search</Label>
            <Input
              id="searchTerm"
              placeholder="Search descriptions or memos"
              value={localFilter.searchTerm || ""}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={localFilter.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={localFilter.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
            />
          </div>
        </div>

        <SheetFooter>
          <div className="flex w-full space-x-2 justify-between">
            <Button variant="outline" onClick={handleResetFilters}>
              Reset Filters
            </Button>
            <Button onClick={handleApplyFilters}>Apply Filters</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
