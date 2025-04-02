
import { useEffect } from "react";
import { Transaction } from "@/types/finance";

/**
 * Custom hook to calculate and update transaction balances
 * 
 * @param transactions - List of transactions
 * @param updateTransaction - Function to update a transaction
 */
export const useTransactionBalances = (
  transactions: Transaction[],
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void
) => {
  // Calculate transaction balances
  useEffect(() => {
    // Sort transactions by date (oldest first)
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Group transactions by account
    const accountTransactions: Record<string, typeof transactions> = {};
    
    sortedTransactions.forEach(transaction => {
      if (!accountTransactions[transaction.account]) {
        accountTransactions[transaction.account] = [];
      }
      accountTransactions[transaction.account].push(transaction);
    });
    
    // Update running balances by account
    Object.keys(accountTransactions).forEach(accountId => {
      let runningBalance = 0;
      let runningClearedBalance = 0;
      
      accountTransactions[accountId].forEach(transaction => {
        // Calculate running balance
        if (transaction.deposit) {
          runningBalance += transaction.deposit;
          if (transaction.cleared) {
            runningClearedBalance += transaction.deposit;
          }
        }
        if (transaction.payment) {
          runningBalance -= transaction.payment;
          if (transaction.cleared) {
            runningClearedBalance -= transaction.payment;
          }
        }
        
        // Update transaction with calculated balance if it doesn't match
        if (transaction.balance !== runningBalance || transaction.clearedBalance !== runningClearedBalance) {
          updateTransaction(transaction.id, {
            balance: runningBalance,
            clearedBalance: runningClearedBalance
          });
        }
      });
    });
  }, [transactions, updateTransaction]);
};
