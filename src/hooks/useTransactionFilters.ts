
import { useState, useMemo } from "react";
import { Transaction } from "@/types/finance";

export type TransactionFilterState = {
  account: string;
  category: string;
  startDate: string;
  endDate: string;
  searchTerm: string;
};

const initialFilterState: TransactionFilterState = {
  account: "",
  category: "",
  startDate: "",
  endDate: "",
  searchTerm: "",
};

export function useTransactionFilters(transactions: Transaction[]) {
  const [filter, setFilter] = useState<TransactionFilterState>(initialFilterState);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  // Apply filters and sorting to transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(transaction => {
        // Account filter
        if (filter.account && transaction.account !== filter.account) return false;
        
        // Category filter
        if (filter.category && transaction.category !== filter.category) return false;
        
        // Date range filter
        if (filter.startDate) {
          const transactionDate = new Date(transaction.date);
          const startDate = new Date(filter.startDate);
          if (transactionDate < startDate) return false;
        }
        
        if (filter.endDate) {
          const transactionDate = new Date(transaction.date);
          const endDate = new Date(filter.endDate);
          if (transactionDate > endDate) return false;
        }
        
        // Search term filter (case insensitive search on description and memo)
        if (filter.searchTerm) {
          const searchTerm = filter.searchTerm.toLowerCase();
          const descriptionMatch = transaction.description.toLowerCase().includes(searchTerm);
          const memoMatch = transaction.memo ? transaction.memo.toLowerCase().includes(searchTerm) : false;
          if (!descriptionMatch && !memoMatch) return false;
        }
        
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filter]);

  // Get paginated transactions
  const paginatedTransactions = useMemo(() => {
    return filteredTransactions.slice(
      currentPage * pageSize,
      (currentPage + 1) * pageSize
    );
  }, [filteredTransactions, currentPage, pageSize]);

  // Calculate page count
  const pageCount = Math.ceil(filteredTransactions.length / pageSize);

  // Calculate summary values for filtered transactions
  const totalIncome = useMemo(() => {
    return filteredTransactions.reduce(
      (sum, transaction) => sum + (transaction.deposit || 0),
      0
    );
  }, [filteredTransactions]);

  const totalExpenses = useMemo(() => {
    return filteredTransactions.reduce(
      (sum, transaction) => sum + (transaction.payment || 0),
      0
    );
  }, [filteredTransactions]);

  // Handler functions
  const handleFilterChange = (newFilter: TransactionFilterState) => {
    setFilter(newFilter);
    setCurrentPage(0); // Reset to first page when filter changes
  };

  const handleResetFilters = () => {
    setFilter(initialFilterState);
    setCurrentPage(0);
  };

  return {
    filter,
    filteredTransactions,
    paginatedTransactions,
    currentPage,
    pageSize,
    pageCount,
    totalIncome,
    totalExpenses,
    handleFilterChange,
    handleResetFilters,
    setCurrentPage,
  };
}
