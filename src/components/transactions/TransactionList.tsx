
import React from "react";
import { Transaction } from "@/types/finance";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import { Checkbox } from "@/components/ui/checkbox";
import { TransactionTypeIcon } from "@/components/transactions/TransactionTypeIcon";
import { format } from "date-fns";

interface TransactionListProps {
  transactions: Transaction[];
  categories: { id: string; name: string }[];
  accounts: { id: string; name: string }[];
  onEdit: (transactionId: string) => void;
  onDelete: (transactionId: string) => void;
  onToggleCleared: (transactionId: string, isCleared: boolean) => void;
  formatDate: (dateString: string) => string;
  getTransactionType: (transaction: Transaction) => string;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  categories,
  accounts,
  onEdit,
  onDelete,
  onToggleCleared,
  formatDate,
  getTransactionType,
}) => {
  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  // Get account name by ID
  const getAccountName = (accountId: string) => {
    const account = accounts.find((a) => a.id === accountId);
    return account ? account.name : accountId;
  };

  if (transactions.length === 0) {
    return (
      <tr className="border-b">
        <td colSpan={6} className="px-4 py-12 text-center">
          <div className="flex flex-col items-center justify-center">
            <p className="text-muted-foreground mb-4">No transactions found</p>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Transaction
            </Button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <>
      {transactions.map((transaction) => (
        <tr key={transaction.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
          <td className="px-4 py-3">{formatDate(transaction.date)}</td>
          <td className="px-4 py-3">
            <TransactionTypeIcon type={getTransactionType(transaction)} />
          </td>
          <td className="px-4 py-3">
            <div className="font-medium">{transaction.description}</div>
            <div className="text-xs text-gray-500">
              {getCategoryName(transaction.category)} • {getAccountName(transaction.account)}
            </div>
          </td>
          <td className="px-4 py-3 text-right">
            {transaction.deposit ? (
              <span className="text-finance-income font-medium">
                +<CurrencyDisplay amount={transaction.deposit} />
              </span>
            ) : transaction.payment ? (
              <span className="text-finance-expense font-medium">
                <CurrencyDisplay amount={transaction.payment} />
              </span>
            ) : null}
          </td>
          <td className="px-4 py-3 text-center">
            <div className="flex justify-center">
              <Checkbox
                checked={transaction.cleared}
                onCheckedChange={(checked) => 
                  onToggleCleared(transaction.id, checked as boolean)
                }
                className={transaction.cleared ? "bg-green-500 border-green-500" : ""}
              />
            </div>
          </td>
          <td className="px-4 py-3 text-right">
            <div className="flex space-x-1 justify-end">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onEdit(transaction.id)}
                className="h-8 w-8"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onDelete(transaction.id)}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

import { Plus } from "lucide-react";
