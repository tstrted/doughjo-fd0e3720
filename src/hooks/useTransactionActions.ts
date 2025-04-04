
import { useToast } from "@/hooks/use-toast";
import { Transaction } from "@/types/finance";

export function useTransactionActions(
  deleteTransaction: (id: string) => void,
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void
) {
  const { toast } = useToast();
  
  // Handle transaction deletion
  const handleDeleteTransaction = (transactionId: string) => {
    deleteTransaction(transactionId);
    toast({
      title: "Success",
      description: "Transaction deleted successfully",
    });
  };
  
  // Toggle transaction cleared status
  const toggleTransactionCleared = (transactionId: string, isCleared: boolean) => {
    updateTransaction(transactionId, { cleared: isCleared });
    toast({
      title: "Status Updated",
      description: isCleared ? "Transaction marked as cleared" : "Transaction marked as uncleared",
    });
  };

  return {
    handleDeleteTransaction,
    toggleTransactionCleared
  };
}
