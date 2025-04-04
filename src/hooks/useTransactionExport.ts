
import { Transaction } from "@/types/finance";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { exportToCsv, CsvColumn, formatDateForExport } from "@/utils/csvExport";

export function useTransactionExport(
  transactions: Transaction[],
  categories: { id: string; name: string }[],
  accounts: { id: string; name: string }[]
) {
  const { toast } = useToast();

  // Export transactions to CSV
  const handleExportTransactions = () => {
    if (transactions.length === 0) {
      toast({
        title: "No transactions to export",
        variant: "destructive"
      });
      return;
    }
    
    // Define CSV columns configuration
    const columns: CsvColumn[] = [
      { 
        header: "Date", 
        accessor: (transaction: Transaction) => formatDateForExport(transaction.date)
      },
      { 
        header: "Description", 
        accessor: (transaction: Transaction) => transaction.description 
      },
      { 
        header: "Category", 
        accessor: (transaction: Transaction) => 
          categories.find(c => c.id === transaction.category)?.name || transaction.category
      },
      { 
        header: "Account", 
        accessor: (transaction: Transaction) => 
          accounts.find(a => a.id === transaction.account)?.name || transaction.account
      },
      { 
        header: "Payment", 
        accessor: (transaction: Transaction) => transaction.payment || ""
      },
      { 
        header: "Deposit", 
        accessor: (transaction: Transaction) => transaction.deposit || ""
      },
      { 
        header: "Memo", 
        accessor: (transaction: Transaction) => transaction.memo || ""
      }
    ];
    
    try {
      // Use the utility function to export data
      exportToCsv(
        transactions, 
        columns, 
        `transactions-${format(new Date(), "yyyy-MM-dd")}`
      );
      
      toast({
        title: "Success",
        description: `${transactions.length} transactions exported`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  return { handleExportTransactions };
}
