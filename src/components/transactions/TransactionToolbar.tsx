
import React from "react";
import { TransactionFilters } from "./TransactionFilters";
import { TransactionFilterState } from "@/hooks/useTransactionFilters";

interface TransactionToolbarProps {
  onAddTransaction: () => void;
  onFilterChange: (filter: TransactionFilterState) => void;
  filter: TransactionFilterState;
  accounts: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  onResetFilters: () => void;
  onExportTransactions?: () => void;
  onImportTransactions?: (e?: React.MouseEvent) => void;
}

export const TransactionToolbar: React.FC<TransactionToolbarProps> = ({
  onAddTransaction,
  onFilterChange,
  filter,
  accounts,
  categories,
  onResetFilters,
  onExportTransactions,
  onImportTransactions,
}) => {
  return (
    <TransactionFilters
      onAddTransaction={onAddTransaction}
      onFilterChange={onFilterChange}
      filter={filter}
      accounts={accounts}
      categories={categories}
      onResetFilters={onResetFilters}
      onExportTransactions={onExportTransactions}
      onImportTransactions={onImportTransactions}
    />
  );
};
