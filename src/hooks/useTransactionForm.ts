
import { useState } from "react";
import { format } from "date-fns";
import { Transaction } from "@/types/finance";
import { useToast } from "@/hooks/use-toast";

export interface TransactionFormData {
  account: string;
  date: string;
  description: string;
  category: string;
  payment?: number;
  deposit?: number;
  memo: string;
  cleared: boolean;
  type: "payment" | "deposit" | "transfer" | "balance" | string;
}

export function useTransactionForm(
  addTransaction: (transaction: Omit<Transaction, "id">) => void,
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void
) {
  const { toast } = useToast();
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isEditTransactionOpen, setIsEditTransactionOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<string | null>(null);
  
  const initialFormState: TransactionFormData = {
    account: "",
    date: format(new Date(), "yyyy-MM-dd"),
    description: "",
    category: "",
    payment: undefined,
    deposit: undefined,
    memo: "",
    cleared: false,
    type: "payment"
  };
  
  const [newTransaction, setNewTransaction] = useState<TransactionFormData>(initialFormState);
  
  // Handle transaction form submission
  const handleAddTransaction = () => {
    if (!newTransaction.account) {
      toast({
        title: "Error",
        description: "Please select an account",
        variant: "destructive"
      });
      return;
    }
    
    if (!newTransaction.category) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive"
      });
      return;
    }
    
    if (!newTransaction.payment && !newTransaction.deposit) {
      toast({
        title: "Error",
        description: "Please enter either a payment or deposit amount",
        variant: "destructive"
      });
      return;
    }
    
    addTransaction({
      account: newTransaction.account,
      date: newTransaction.date,
      description: newTransaction.description,
      category: newTransaction.category,
      payment: newTransaction.payment,
      deposit: newTransaction.deposit,
      memo: newTransaction.memo,
      cleared: newTransaction.cleared,
      type: newTransaction.type,
    });
    
    // Reset form
    setNewTransaction(initialFormState);
    setIsAddTransactionOpen(false);
    
    toast({
      title: "Success",
      description: "Transaction added successfully",
    });
  };
  
  // Handle transaction update
  const handleUpdateTransaction = () => {
    if (currentTransaction) {
      if (!newTransaction.account || !newTransaction.category) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }
      
      updateTransaction(currentTransaction, {
        account: newTransaction.account,
        date: newTransaction.date,
        description: newTransaction.description,
        category: newTransaction.category,
        payment: newTransaction.payment,
        deposit: newTransaction.deposit,
        memo: newTransaction.memo,
        cleared: newTransaction.cleared,
        type: newTransaction.type,
      });
      
      setIsEditTransactionOpen(false);
      setCurrentTransaction(null);
      
      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
    }
  };
  
  // Open edit transaction dialog
  const openEditTransaction = (transactions: Transaction[], transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction) {
      setNewTransaction({
        account: transaction.account,
        date: transaction.date,
        description: transaction.description,
        category: transaction.category,
        payment: transaction.payment,
        deposit: transaction.deposit,
        memo: transaction.memo || "",
        cleared: transaction.cleared || false,
        type: transaction.type || "payment",
      });
      setCurrentTransaction(transactionId);
      setIsEditTransactionOpen(true);
    }
  };

  return {
    isAddTransactionOpen,
    setIsAddTransactionOpen,
    isEditTransactionOpen,
    setIsEditTransactionOpen,
    currentTransaction,
    setCurrentTransaction,
    newTransaction,
    setNewTransaction,
    handleAddTransaction,
    handleUpdateTransaction,
    openEditTransaction
  };
}
