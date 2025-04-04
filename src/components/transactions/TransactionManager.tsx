
import React, { useState, useRef } from "react";
import { useFinance } from "@/context/FinanceContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Transaction } from "@/types/finance";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { TransactionSummary } from "@/components/transactions/TransactionSummary";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { TransactionImportDialog } from "@/components/transactions/TransactionImportDialog";
import { useTransactionBalances } from "@/hooks/useTransactionBalances";
import { useTransactionFilters } from "@/hooks/useTransactionFilters";
import { 
  exportToCsv, 
  CsvColumn, 
  formatDateForExport,
  parseImportFile,
  mapImportedTransactions,
  ImportColumnMapping
} from "@/utils/csvExport";

export const TransactionManager: React.FC = () => {
  const { 
    accounts, 
    categories, 
    transactions, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction,
  } = useFinance();
  const { toast } = useToast();
  
  // Apply the transaction balances hook
  useTransactionBalances(transactions, updateTransaction);
  
  // Apply the transaction filters hook
  const {
    filter,
    paginatedTransactions,
    currentPage,
    pageCount,
    totalIncome,
    totalExpenses,
    handleFilterChange,
    handleResetFilters,
    setCurrentPage
  } = useTransactionFilters(transactions);
  
  // UI state
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isEditTransactionOpen, setIsEditTransactionOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<string | null>(null);
  
  // Import dialog state
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importData, setImportData] = useState<Record<string, string>[]>([]);
  const [importMapping, setImportMapping] = useState<ImportColumnMapping>({
    date: '',
    description: '',
    category: '',
    account: '',
    payment: '',
    deposit: '',
    memo: '',
  });
  const [importHeaders, setImportHeaders] = useState<string[]>([]);
  const [importPreview, setImportPreview] = useState<Array<any>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Transaction form state
  const [newTransaction, setNewTransaction] = useState({
    account: "",
    date: format(new Date(), "yyyy-MM-dd"),
    description: "",
    category: "",
    payment: undefined as number | undefined,
    deposit: undefined as number | undefined,
    memo: "",
    cleared: false,
    type: "payment" as "payment" | "deposit" | "transfer" | "balance" | string,
  });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MM/dd/yy");
  };
  
  // Export transactions to CSV
  const handleExportTransactions = () => {
    if (paginatedTransactions.length === 0) {
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
        paginatedTransactions, 
        columns, 
        `transactions-${format(new Date(), "yyyy-MM-dd")}`
      );
      
      toast({
        title: "Success",
        description: `${paginatedTransactions.length} transactions exported`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  // Handle file upload
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await parseImportFile(file);
      
      if (data.length === 0) {
        toast({
          title: "Import failed",
          description: "No data found in file",
          variant: "destructive"
        });
        return;
      }
      
      setImportData(data);
      setImportHeaders(Object.keys(data[0]));
      
      // Set default mappings based on common header names
      const defaultMapping: ImportColumnMapping = {
        date: '',
        description: '',
        category: '',
        account: '',
        payment: '',
        deposit: '',
        amount: '',
        memo: '',
      };
      
      // Try to guess mappings from headers
      const headers = Object.keys(data[0]).map(h => h.toLowerCase());
      
      headers.forEach(header => {
        if (/date|trans(action)?date/.test(header)) defaultMapping.date = header;
        if (/desc|description|payee|merchant|transaction|title/.test(header)) defaultMapping.description = header;
        if (/category|cat|type|group/.test(header)) defaultMapping.category = header;
        if (/account|acct|source/.test(header)) defaultMapping.account = header;
        if (/payment|expense|debit|paid|withdrawal|withdraw/.test(header)) defaultMapping.payment = header;
        if (/deposit|income|credit|received|deposit/.test(header)) defaultMapping.deposit = header;
        if (/amount|sum|total|value/.test(header)) defaultMapping.amount = header;
        if (/memo|note|notes|comment|description2/.test(header)) defaultMapping.memo = header;
      });
      
      setImportMapping(defaultMapping);
      
      // Generate preview
      if (defaultMapping.date && defaultMapping.description) {
        try {
          const preview = mapImportedTransactions(data.slice(0, 5), defaultMapping);
          setImportPreview(preview);
        } catch (e) {
          console.error("Preview generation error:", e);
        }
      }
      
      setIsImportOpen(true);
      
      // Reset the input so the same file can be selected again
      e.target.value = '';
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      
      // Reset the input so the same file can be selected again
      e.target.value = '';
    }
  };
  
  // Update mapping and regenerate preview
  const handleMappingChange = (field: keyof ImportColumnMapping, value: string) => {
    const newMapping = { ...importMapping, [field]: value };
    setImportMapping(newMapping);
    
    // Update preview if we have the minimum required fields
    if (newMapping.date && newMapping.description) {
      try {
        const preview = mapImportedTransactions(importData.slice(0, 5), newMapping);
        setImportPreview(preview);
      } catch (e) {
        console.error("Preview generation error:", e);
      }
    }
  };
  
  // Process the imported data
  const handleImportConfirm = () => {
    try {
      // Map the data
      const mappedData = mapImportedTransactions(importData, importMapping);
      
      // Check if data needs category/account matching
      const needsCategoryMapping = mappedData.some(item => 
        item.category && !categories.some(c => c.id === item.category || c.name === item.category)
      );
      
      const needsAccountMapping = mappedData.some(item => 
        item.account && !accounts.some(a => a.id === item.account || a.name === item.account)
      );
      
      if (needsCategoryMapping) {
        toast({
          title: "Warning",
          description: "Some categories don't match existing ones. They will be imported as-is.",
        });
      }
      
      if (needsAccountMapping) {
        toast({
          title: "Warning",
          description: "Some accounts don't match existing ones. Please select an account to use for all transactions.",
        });
      }
      
      // Add transactions
      let successCount = 0;
      let errorCount = 0;
      
      mappedData.forEach(transaction => {
        try {
          // Find category by name if it's not an ID
          let categoryId = transaction.category;
          if (categoryId && !categories.some(c => c.id === categoryId)) {
            const matchingCategory = categories.find(c => c.name === categoryId);
            if (matchingCategory) {
              categoryId = matchingCategory.id;
            }
          }
          
          // Find account by name if it's not an ID
          let accountId = transaction.account;
          if (accountId && !accounts.some(a => a.id === accountId)) {
            const matchingAccount = accounts.find(a => a.name === accountId);
            if (matchingAccount) {
              accountId = matchingAccount.id;
            }
          }
          
          // If no account found, use the first account
          if (!accountId && accounts.length > 0) {
            accountId = accounts[0].id;
          }
          
          addTransaction({
            date: transaction.date,
            description: transaction.description,
            category: categoryId || (categories.length > 0 ? categories[0].id : ''),
            account: accountId || '',
            payment: transaction.payment,
            deposit: transaction.deposit,
            memo: transaction.memo,
            type: transaction.type,
            cleared: false,
          });
          
          successCount++;
        } catch (e) {
          console.error("Error adding transaction:", e);
          errorCount++;
        }
      });
      
      setIsImportOpen(false);
      
      toast({
        title: "Import completed",
        description: `${successCount} transactions imported successfully. ${errorCount} failed.`,
        variant: errorCount > 0 ? "destructive" : "default"
      });
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };
  
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
    setNewTransaction({
      account: "",
      date: format(new Date(), "yyyy-MM-dd"),
      description: "",
      category: "",
      payment: undefined,
      deposit: undefined,
      memo: "",
      cleared: false,
      type: "payment",
    });
    
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
  const openEditTransaction = (transactionId: string) => {
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
  
  // Determine transaction type for icon
  const getTransactionType = (transaction: Transaction) => {
    if (transaction.type) {
      return transaction.type;
    }
    if (transaction.deposit) return "deposit";
    if (transaction.payment) return "payment";
    return "payment";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv,.xlsx,.xls"
        className="hidden"
      />
      
      <TransactionFilters 
        onAddTransaction={() => setIsAddTransactionOpen(true)} 
        onFilterChange={handleFilterChange}
        filter={filter}
        accounts={accounts}
        categories={categories}
        onResetFilters={handleResetFilters}
        onExportTransactions={handleExportTransactions}
        onImportTransactions={handleFileUpload}
      />
      
      <TransactionSummary totalIncome={totalIncome} totalExpenses={totalExpenses} />

      <TransactionTable 
        transactions={paginatedTransactions}
        categories={categories}
        accounts={accounts}
        currentPage={currentPage}
        pageSize={10}
        pageCount={pageCount}
        onPageChange={setCurrentPage}
        onEdit={openEditTransaction}
        onDelete={handleDeleteTransaction}
        onToggleCleared={toggleTransactionCleared}
        formatDate={formatDate}
        getTransactionType={getTransactionType}
      />

      {/* Add Transaction Form */}
      <TransactionForm 
        isOpen={isAddTransactionOpen}
        onOpenChange={setIsAddTransactionOpen}
        formData={newTransaction}
        setFormData={setNewTransaction}
        onSubmit={handleAddTransaction}
        accounts={accounts}
        categories={categories}
        title="Add New Transaction"
        description="Enter the details for your new transaction."
        submitLabel="Add Transaction"
      />
      
      {/* Edit Transaction Form */}
      <TransactionForm 
        isOpen={isEditTransactionOpen}
        onOpenChange={setIsEditTransactionOpen}
        formData={newTransaction}
        setFormData={setNewTransaction}
        onSubmit={handleUpdateTransaction}
        accounts={accounts}
        categories={categories}
        title="Edit Transaction"
        description="Update the transaction details."
        submitLabel="Update Transaction"
      />
      
      {/* Import CSV Mapping Dialog */}
      <TransactionImportDialog
        isOpen={isImportOpen}
        onOpenChange={setIsImportOpen}
        importData={importData}
        importHeaders={importHeaders}
        importMapping={importMapping}
        importPreview={importPreview}
        onMappingChange={handleMappingChange}
        onImportConfirm={handleImportConfirm}
      />
    </div>
  );
};
