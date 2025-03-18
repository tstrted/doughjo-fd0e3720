
import React, { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { FinanceCard, FinanceCardHeader, FinanceCardBody } from "@/components/ui/finance-card";
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
  CreditCard,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TransactionsPage = () => {
  const { accounts, categories, transactions, addTransaction, formatCurrency } = useFinance();
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  
  // New transaction form state
  const [newTransaction, setNewTransaction] = useState({
    account: "",
    date: format(new Date(), "yyyy-MM-dd"),
    description: "",
    category: "",
    payment: undefined as number | undefined,
    deposit: undefined as number | undefined,
    memo: "",
  });

  // Filter state
  const [filter, setFilter] = useState({
    account: "",
    category: "",
    startDate: "",
    endDate: "",
  });
  
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
    return format(date, "dd MMM yyyy");
  };
  
  // Handle transaction form submission
  const handleAddTransaction = () => {
    addTransaction({
      account: newTransaction.account,
      date: newTransaction.date,
      description: newTransaction.description,
      category: newTransaction.category,
      payment: newTransaction.payment,
      deposit: newTransaction.deposit,
      memo: newTransaction.memo,
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
    });
    
    setIsAddTransactionOpen(false);
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
        <div className="flex space-x-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filter Transactions</DialogTitle>
                <DialogDescription>
                  Apply filters to view specific transactions.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="filter-account">Account</Label>
                  <Select
                    value={filter.account}
                    onValueChange={(value) => setFilter({ ...filter, account: value })}
                  >
                    <SelectTrigger id="filter-account">
                      <SelectValue placeholder="All Accounts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Accounts</SelectItem>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="filter-category">Category</Label>
                  <Select
                    value={filter.category}
                    onValueChange={(value) => setFilter({ ...filter, category: value })}
                  >
                    <SelectTrigger id="filter-category">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
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
                    <Label htmlFor="filter-start-date">Start Date</Label>
                    <Input
                      id="filter-start-date"
                      type="date"
                      value={filter.startDate}
                      onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="filter-end-date">End Date</Label>
                    <Input
                      id="filter-end-date"
                      type="date"
                      value={filter.endDate}
                      onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={resetFilter}>
                  Reset
                </Button>
                <Button type="submit" onClick={() => {}}>
                  Apply Filters
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Transaction
              </Button>
            </DialogTrigger>
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
          
          <Tabs defaultValue="add">
            <TabsList>
              <TabsTrigger value="add" className="px-3">
                <Plus className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="import" className="px-3">
                <FileUp className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="export" className="px-3">
                <Download className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
            <TabsContent value="add">
              <div className="sr-only">Add Transaction</div>
            </TabsContent>
            <TabsContent value="import">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" /> Import Transactions
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Import Transactions</DialogTitle>
                    <DialogDescription>
                      Upload a CSV or Excel file with your transactions.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="import-file">File</Label>
                      <Input id="import-file" type="file" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="import-account">Account</Label>
                      <Select>
                        <SelectTrigger id="import-account">
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
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Import</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>
            <TabsContent value="export">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Export Transactions
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Export Transactions</DialogTitle>
                    <DialogDescription>
                      Export your transactions to a file.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="export-format">Format</Label>
                      <Select defaultValue="csv">
                        <SelectTrigger id="export-format">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                          <SelectItem value="json">JSON</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="export-start-date">Start Date</Label>
                        <Input id="export-start-date" type="date" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="export-end-date">End Date</Label>
                        <Input id="export-end-date" type="date" />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Export</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Income (Filtered)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-finance-income">
              <CurrencyDisplay amount={totalIncome} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Expenses (Filtered)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-finance-expense">
              <CurrencyDisplay amount={totalExpenses} />
            </div>
          </CardContent>
        </Card>
      </div>

      <FinanceCard>
        <FinanceCardHeader title={`Transactions (${filteredTransactions.length})`} />
        <FinanceCardBody>
          <DataTable
            data={paginatedTransactions}
            columns={[
              {
                header: "Account",
                accessorKey: "account",
                cell: (item) => (
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{getAccountName(item.account)}</span>
                  </div>
                ),
              },
              {
                header: "Date",
                accessorKey: "date",
                cell: (item) => formatDate(item.date),
              },
              {
                header: "Description",
                accessorKey: "description",
                cell: (item) => (
                  <div className="max-w-[200px] truncate" title={item.description}>
                    {item.description}
                  </div>
                ),
              },
              {
                header: "Category",
                accessorKey: "category",
                cell: (item) => (
                  <div className="max-w-[150px] truncate" title={getCategoryName(item.category)}>
                    {getCategoryName(item.category)}
                  </div>
                ),
              },
              {
                header: "Payment",
                accessorKey: "payment",
                cell: (item) => item.payment ? (
                  <div className="flex items-center text-finance-expense">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <CurrencyDisplay amount={item.payment} />
                  </div>
                ) : null,
                className: "text-right",
              },
              {
                header: "Deposit",
                accessorKey: "deposit",
                cell: (item) => item.deposit ? (
                  <div className="flex items-center text-finance-income">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    <CurrencyDisplay amount={item.deposit} />
                  </div>
                ) : null,
                className: "text-right",
              },
              {
                header: "Balance",
                accessorKey: "balance",
                cell: (item) => (
                  <CurrencyDisplay amount={item.balance || 0} colorCode={true} />
                ),
                className: "text-right font-medium",
              },
              {
                header: "Actions",
                accessorKey: "actions",
                cell: (item) => (
                  <div className="flex space-x-2 justify-end">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ),
              },
            ]}
            pagination={{
              pageIndex: currentPage,
              pageSize,
              pageCount,
              onPageChange: setCurrentPage,
            }}
            emptyState={
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground mb-4">No transactions found</p>
                <Button onClick={() => setIsAddTransactionOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Transaction
                </Button>
              </div>
            }
          />
        </FinanceCardBody>
      </FinanceCard>
    </div>
  );
};

export default TransactionsPage;
