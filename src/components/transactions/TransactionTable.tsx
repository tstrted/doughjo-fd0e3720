
import React from "react";
import { Transaction } from "@/types/finance";
import { TransactionList } from "./TransactionList";
import { TransactionPagination } from "./TransactionPagination";

interface TransactionTableProps {
  transactions: Transaction[];
  categories: { id: string; name: string }[];
  accounts: { id: string; name: string }[];
  currentPage: number;
  pageSize: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onEdit: (transactionId: string) => void;
  onDelete: (transactionId: string) => void;
  onToggleCleared: (transactionId: string, isCleared: boolean) => void;
  formatDate: (dateString: string) => string;
  getTransactionType: (transaction: Transaction) => string;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  categories,
  accounts,
  currentPage,
  pageSize,
  pageCount,
  onPageChange,
  onEdit,
  onDelete,
  onToggleCleared,
  formatDate,
  getTransactionType,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800 border-b">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Payee</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <TransactionList
              transactions={transactions}
              categories={categories}
              accounts={accounts}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleCleared={onToggleCleared}
              formatDate={formatDate}
              getTransactionType={getTransactionType}
            />
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {transactions.length > 0 && (
        <TransactionPagination 
          currentPage={currentPage}
          pageCount={pageCount}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};
