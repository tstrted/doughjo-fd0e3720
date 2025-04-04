
import React from "react";
import { useFinance } from "@/context/FinanceContext";
import { Transaction } from "@/types/finance";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { TransactionSummary } from "@/components/transactions/TransactionSummary";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { TransactionImportDialog } from "@/components/transactions/TransactionImportDialog";
import { TransactionToolbar } from "@/components/transactions/TransactionToolbar";
import { useTransactionBalances } from "@/hooks/useTransactionBalances";
import { useTransactionFilters } from "@/hooks/useTransactionFilters";
import { useTransactionForm } from "@/hooks/useTransactionForm";
import { useTransactionImport } from "@/hooks/useTransactionImport";
import { useTransactionExport } from "@/hooks/useTransactionExport";
import { useTransactionActions } from "@/hooks/useTransactionActions";
import { format } from "date-fns";

export const TransactionManager: React.FC = () => {
  const { 
    accounts, 
    categories, 
    transactions, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction,
  } = useFinance();
  
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
  
  // Use the transaction form hook
  const {
    isAddTransactionOpen,
    setIsAddTransactionOpen,
    isEditTransactionOpen,
    setIsEditTransactionOpen,
    newTransaction,
    setNewTransaction,
    handleAddTransaction,
    handleUpdateTransaction,
    openEditTransaction
  } = useTransactionForm(addTransaction, updateTransaction);
  
  // Use the transaction import hook
  const {
    fileInputRef,
    isImportOpen,
    setIsImportOpen,
    importData,
    importHeaders,
    importMapping,
    importPreview,
    handleFileUpload,
    handleFileChange,
    handleMappingChange,
    handleImportConfirm
  } = useTransactionImport(accounts, categories, addTransaction);
  
  // Use the transaction export hook
  const { handleExportTransactions } = useTransactionExport(
    paginatedTransactions,
    categories,
    accounts
  );
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MM/dd/yy");
  };
  
  // Handle transaction deletion and clearing status
  const { handleDeleteTransaction, toggleTransactionCleared } = useTransactionActions(deleteTransaction, updateTransaction);
  
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
      
      <TransactionToolbar
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
        onEdit={(id) => openEditTransaction(transactions, id)}
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
