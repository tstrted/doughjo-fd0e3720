
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
  
  // Apply the new useTransactionBalances hook
  useTransactionBalances(transactions, updateTransaction);
  
  // UI state
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isEditTransactionOpen, setIsEditTransactionOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  
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

  // Enhanced filter state
  const [filter, setFilter] = useState({
    account: "",
    category: "",
    startDate: "",
    endDate: "",
    searchTerm: "",
  });
  
  // Get filtered transactions
  const filteredTransactions = transactions
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
  
  // Get paginated transactions
  const paginatedTransactions = filteredTransactions.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );
  
  // Calculate page count
  const pageCount = Math.ceil(filteredTransactions.length / pageSize);
  
  // Calculate total income and expenses for the current filtered view
  const totalIncome = filteredTransactions.reduce(
    (sum, transaction) => sum + (transaction.deposit || 0),
    0
  );
  
  const totalExpenses = filteredTransactions.reduce(
    (sum, transaction) => sum + (transaction.payment || 0),
    0
  );
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MM/dd/yy");
  };
  
  // Handle filter changes
  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter);
    setCurrentPage(0); // Reset to first page when filter changes
  };
  
  // Reset all filters
  const handleResetFilters = () => {
    setFilter({
      account: "",
      category: "",
      startDate: "",
      endDate: "",
      searchTerm: "",
    });
    setCurrentPage(0);
  };
  
  // Export transactions to CSV
  const handleExportTransactions = () => {
    if (filteredTransactions.length === 0) {
      toast({
        title: "No transactions to export",
        variant: "destructive"
      });
      return;
    }
    
    // Create CSV header
    const header = ["Date", "Description", "Category", "Account", "Payment", "Deposit", "Memo"];
    
    // Create CSV rows
    const rows = filteredTransactions.map(transaction => [
      transaction.date,
      transaction.description,
      categories.find(c => c.id === transaction.category)?.name || transaction.category,
      accounts.find(a => a.id === transaction.account)?.name || transaction.account,
      transaction.payment || "",
      transaction.deposit || "",
      transaction.memo || ""
    ]);
    
    // Combine header and rows
    const csvContent = [header, ...rows].map(row => row.join(",")).join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transactions-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    
    toast({
      title: "Success",
      description: `${filteredTransactions.length} transactions exported`,
    });
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
      />
      
      <TransactionSummary totalIncome={totalIncome} totalExpenses={totalExpenses} />

      <TransactionTable 
        transactions={paginatedTransactions}
        categories={categories}
        accounts={accounts}
        currentPage={currentPage}
        pageSize={pageSize}
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
    </div>
  );
};

export default TransactionsPage;
