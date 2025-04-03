
import React, { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Transaction } from "@/types/finance";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { TransactionSummary } from "@/components/transactions/TransactionSummary";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionForm } from "@/components/transactions/TransactionForm";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const TransactionsPage = () => {
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

  // Import transactions from CSV/Excel
  const handleImportTransactions = async (file: File) => {
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
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
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
      // Validate minimum required mapping
      if (!importMapping.date || !importMapping.description) {
        toast({
          title: "Import failed",
          description: "Date and Description mappings are required",
          variant: "destructive"
        });
        return;
      }
      
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
      <TransactionFilters 
        onAddTransaction={() => setIsAddTransactionOpen(true)} 
        onFilterChange={handleFilterChange}
        filter={filter}
        accounts={accounts}
        categories={categories}
        onResetFilters={handleResetFilters}
        onExportTransactions={handleExportTransactions}
        onImportTransactions={handleImportTransactions}
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
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Import Transactions</DialogTitle>
            <DialogDescription>
              Map columns from your file to transaction fields
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="date-mapping" className="text-right">
                Date <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={importMapping.date} 
                onValueChange={(value) => handleMappingChange('date', value)}
              >
                <SelectTrigger id="date-mapping">
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">-- Select --</SelectItem>
                  {importHeaders.map(header => (
                    <SelectItem key={header} value={header}>{header}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description-mapping" className="text-right">
                Description <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={importMapping.description} 
                onValueChange={(value) => handleMappingChange('description', value)}
              >
                <SelectTrigger id="description-mapping">
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">-- Select --</SelectItem>
                  {importHeaders.map(header => (
                    <SelectItem key={header} value={header}>{header}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category-mapping" className="text-right">
                Category
              </Label>
              <Select 
                value={importMapping.category || ''} 
                onValueChange={(value) => handleMappingChange('category', value)}
              >
                <SelectTrigger id="category-mapping">
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">-- None --</SelectItem>
                  {importHeaders.map(header => (
                    <SelectItem key={header} value={header}>{header}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="account-mapping" className="text-right">
                Account
              </Label>
              <Select 
                value={importMapping.account || ''} 
                onValueChange={(value) => handleMappingChange('account', value)}
              >
                <SelectTrigger id="account-mapping">
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">-- None --</SelectItem>
                  {importHeaders.map(header => (
                    <SelectItem key={header} value={header}>{header}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount-mapping" className="text-right">
                Amount (single column)
              </Label>
              <Select 
                value={importMapping.amount || ''} 
                onValueChange={(value) => handleMappingChange('amount', value)}
              >
                <SelectTrigger id="amount-mapping">
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">-- None --</SelectItem>
                  {importHeaders.map(header => (
                    <SelectItem key={header} value={header}>{header}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-2 flex justify-center items-center">
              <span className="text-sm text-gray-500">- OR -</span>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payment-mapping" className="text-right">
                Payment (expenses)
              </Label>
              <Select 
                value={importMapping.payment || ''} 
                onValueChange={(value) => handleMappingChange('payment', value)}
              >
                <SelectTrigger id="payment-mapping">
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">-- None --</SelectItem>
                  {importHeaders.map(header => (
                    <SelectItem key={header} value={header}>{header}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deposit-mapping" className="text-right">
                Deposit (income)
              </Label>
              <Select 
                value={importMapping.deposit || ''} 
                onValueChange={(value) => handleMappingChange('deposit', value)}
              >
                <SelectTrigger id="deposit-mapping">
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">-- None --</SelectItem>
                  {importHeaders.map(header => (
                    <SelectItem key={header} value={header}>{header}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="memo-mapping" className="text-right">
                Memo
              </Label>
              <Select 
                value={importMapping.memo || ''} 
                onValueChange={(value) => handleMappingChange('memo', value)}
              >
                <SelectTrigger id="memo-mapping">
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">-- None --</SelectItem>
                  {importHeaders.map(header => (
                    <SelectItem key={header} value={header}>{header}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {importPreview.length > 0 && (
            <div className="border rounded-md p-3 my-4 max-h-48 overflow-auto">
              <h3 className="font-medium mb-2">Preview (first {importPreview.length} records)</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-1">Date</th>
                    <th className="text-left p-1">Description</th>
                    <th className="text-right p-1">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {importPreview.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="p-1">{item.date}</td>
                      <td className="p-1">{item.description}</td>
                      <td className="text-right p-1">
                        {item.payment ? `-${item.payment}` : ''}
                        {item.deposit ? `+${item.deposit}` : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImportConfirm}>
              Import Transactions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionsPage;
