import React, { useState, useEffect } from "react";
import { useFinance } from "@/context/FinanceContext";
import { DataTable } from "@/components/ui/data-table";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Download,
  Upload,
  FileUp,
  Edit,
  Trash2,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  CreditCard,
  Banknote,
  Building,
  Receipt,
  Home,
  Car,
  ShoppingCart,
  DollarSign,
  Fuel,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { TransactionTypeIcon } from "@/components/transactions/TransactionTypeIcon";

const TransactionsPage = () => {
  const { 
    accounts, 
    categories, 
    transactions, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction,
    formatCurrency 
  } = useFinance();
  const { toast } = useToast();
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
    type: "payment" as "payment" | "deposit" | "transfer" | "balance",
  });

  // Filter state
  const [filter, setFilter] = useState({
    account: "",
    category: "",
    startDate: "",
    endDate: "",
  });
  
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
  
  // Get filtered transactions
  const filteredTransactions = transactions
    .filter(transaction => {
      if (filter.account && transaction.account !== filter.account) return false;
      if (filter.category && transaction.category !== filter.category) return false;
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
  
  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };
  
  // Get account name by ID
  const getAccountName = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    return account ? account.name : accountId;
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MM/dd/yy");
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
  
  // Reset the filter
  const resetFilter = () => {
    setFilter({
      account: "",
      category: "",
      startDate: "",
      endDate: "",
    });
  };

  // Determine transaction type for icon
  const getTransactionType = (transaction: any) => {
    if (transaction.type) {
      return transaction.type;
    }
    if (transaction.deposit) return "deposit";
    if (transaction.payment) return "payment";
    return "payment";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
        <div className="flex space-x-3">
          <Button variant="outline" size="icon" className="border-none">
            <Filter className="mr-0 h-5 w-5" />
          </Button>
          
          <Button className="gap-2 bg-primary text-white">
            <Plus className="h-5 w-5" /> Add Transaction
          </Button>

          <Button variant="outline" size="icon" className="border-none">
            <Plus className="mr-0 h-5 w-5" />
          </Button>
          
          <Button variant="outline" size="icon" className="border-none">
            <Download className="mr-0 h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border rounded-lg overflow-hidden">
          <CardHeader className="pb-2 bg-slate-50 dark:bg-slate-800 border-b">
            <CardTitle className="text-base font-semibold">
              Income (Filtered)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-finance-income">
              <CurrencyDisplay amount={totalIncome} />
            </div>
          </CardContent>
        </Card>
        <Card className="border rounded-lg overflow-hidden">
          <CardHeader className="pb-2 bg-slate-50 dark:bg-slate-800 border-b">
            <CardTitle className="text-base font-semibold">
              Expenses (Filtered)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-finance-expense">
              <CurrencyDisplay amount={totalExpenses} />
            </div>
          </CardContent>
        </Card>
      </div>

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
              {paginatedTransactions.length === 0 ? (
                <tr className="border-b">
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-muted-foreground mb-4">No transactions found</p>
                      <Button onClick={() => setIsAddTransactionOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Transaction
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((transaction) => (
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
                            toggleTransactionCleared(transaction.id, checked as boolean)
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
                          onClick={() => openEditTransaction(transaction.id)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {paginatedTransactions.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-muted-foreground">
              Page {currentPage + 1} of {pageCount}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(0)}
                disabled={currentPage === 0}
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">First page</span>
                <div className="flex">«</div>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 0}
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">Previous page</span>
                <div className="flex">‹</div>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === pageCount - 1}
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">Next page</span>
                <div className="flex">›</div>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(pageCount - 1)}
                disabled={currentPage === pageCount - 1}
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">Last page</span>
                <div className="flex">»</div>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add Transaction Dialog */}
      <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
            <DialogDescription>
              Enter the details for your new transaction.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="account">Account</Label>
              <Select
                value={newTransaction.account}
                onValueChange={(value) => setNewTransaction({ ...newTransaction, account: value })}
              >
                <SelectTrigger id="account">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                placeholder="e.g., Groceries at SuperMarket"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newTransaction.category}
                onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="payment">Payment Amount</Label>
                <Input
                  id="payment"
                  type="number"
                  value={newTransaction.payment === undefined ? "" : newTransaction.payment}
                  onChange={(e) => {
                    const value = e.target.value ? parseFloat(e.target.value) : undefined;
                    setNewTransaction({ 
                      ...newTransaction, 
                      payment: value,
                      deposit: value !== undefined ? undefined : newTransaction.deposit 
                    });
                  }}
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deposit">Deposit Amount</Label>
                <Input
                  id="deposit"
                  type="number"
                  value={newTransaction.deposit === undefined ? "" : newTransaction.deposit}
                  onChange={(e) => {
                    const value = e.target.value ? parseFloat(e.target.value) : undefined;
                    setNewTransaction({ 
                      ...newTransaction, 
                      deposit: value,
                      payment: value !== undefined ? undefined : newTransaction.payment 
                    });
                  }}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="memo">Memo (Optional)</Label>
              <Input
                id="memo"
                value={newTransaction.memo}
                onChange={(e) => setNewTransaction({ ...newTransaction, memo: e.target.value })}
                placeholder="Additional notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTransactionOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTransaction}>Add Transaction</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Transaction Dialog */}
      <Dialog open={isEditTransactionOpen} onOpenChange={setIsEditTransactionOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>
              Update the transaction details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-account">Account</Label>
              <Select
                value={newTransaction.account}
                onValueChange={(value) => setNewTransaction({ ...newTransaction, account: value })}
              >
                <SelectTrigger id="edit-account">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={newTransaction.category}
                onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}
              >
                <SelectTrigger id="edit-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-payment">Payment Amount</Label>
                <Input
                  id="edit-payment"
                  type="number"
                  value={newTransaction.payment === undefined ? "" : newTransaction.payment}
                  onChange={(e) => {
                    const value = e.target.value ? parseFloat(e.target.value) : undefined;
                    setNewTransaction({ 
                      ...newTransaction, 
                      payment: value,
                      deposit: value !== undefined ? undefined : newTransaction.deposit 
                    });
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-deposit">Deposit Amount</Label>
                <Input
                  id="edit-deposit"
                  type="number"
                  value={newTransaction.deposit === undefined ? "" : newTransaction.deposit}
                  onChange={(e) => {
                    const value = e.target.value ? parseFloat(e.target.value) : undefined;
                    setNewTransaction({ 
                      ...newTransaction, 
                      deposit: value,
                      payment: value !== undefined ? undefined : newTransaction.payment 
                    });
                  }}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-memo">Memo (Optional)</Label>
              <Input
                id="edit-memo"
                value={newTransaction.memo}
                onChange={(e) => setNewTransaction({ ...newTransaction, memo: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditTransactionOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTransaction}>Update Transaction</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionsPage;
