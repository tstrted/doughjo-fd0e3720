
import React, { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { FinanceCard, FinanceCardHeader, FinanceCardBody } from "@/components/ui/finance-card";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  Plus,
  Edit,
  Trash2,
  ArrowRight,
  PiggyBank,
  Target,
  Percent,
  Copy,
  PieChart,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

const SubAccountsPage = () => {
  const {
    accounts,
    subAccounts,
    subAccountTransactions,
    addSubAccount,
    updateSubAccount,
    deleteSubAccount,
    addSubAccountTransaction,
    formatCurrency,
  } = useFinance();
  
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState<string | null>(null);
  
  // New sub-account form state
  const [newSubAccount, setNewSubAccount] = useState({
    fund: "",
    location: "",
    goal: 0,
    percentage: 0,
    balance: 0,
  });
  
  // New transaction form state
  const [newTransaction, setNewTransaction] = useState({
    fund: "",
    date: format(new Date(), "yyyy-MM-dd"),
    number: "",
    description: "",
    memo: "",
    payment: undefined as number | undefined,
    deposit: undefined as number | undefined,
  });
  
  // Calculate total balance of all sub-accounts
  const totalBalance = subAccounts.reduce((sum, account) => sum + account.balance, 0);
  
  // Get transactions for selected fund
  const fundTransactions = selectedFund
    ? subAccountTransactions
        .filter(transaction => transaction.fund === selectedFund)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd MMM yyyy");
  };
  
  // Handle sub-account form submission
  const handleAddSubAccount = () => {
    addSubAccount({
      fund: newSubAccount.fund,
      location: newSubAccount.location,
      goal: newSubAccount.goal,
      percentage: newSubAccount.percentage,
      balance: newSubAccount.balance,
    });
    
    // Reset form
    setNewSubAccount({
      fund: "",
      location: "",
      goal: 0,
      percentage: 0,
      balance: 0,
    });
    
    setIsAddAccountOpen(false);
  };
  
  // Handle transaction form submission
  const handleAddTransaction = () => {
    addSubAccountTransaction({
      fund: newTransaction.fund,
      date: newTransaction.date,
      number: newTransaction.number,
      description: newTransaction.description,
      memo: newTransaction.memo,
      payment: newTransaction.payment,
      deposit: newTransaction.deposit,
    });
    
    // Update sub-account balance
    const subAccount = subAccounts.find(acc => acc.id === newTransaction.fund);
    if (subAccount) {
      const newBalance = subAccount.balance +
        (newTransaction.deposit || 0) -
        (newTransaction.payment || 0);
      
      updateSubAccount(subAccount.id, { balance: newBalance });
    }
    
    // Reset form
    setNewTransaction({
      fund: "",
      date: format(new Date(), "yyyy-MM-dd"),
      number: "",
      description: "",
      memo: "",
      payment: undefined,
      deposit: undefined,
    });
    
    setIsAddTransactionOpen(false);
  };
  
  // Calculate progress percentage
  const getProgressPercentage = (current: number, goal: number) => {
    if (!goal) return 0;
    return Math.min(100, (current / goal) * 100);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Sub-Accounts</h2>
        <div className="flex space-x-3">
          <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <ArrowRight className="mr-2 h-4 w-4" /> Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
                <DialogDescription>
                  Enter the details for your new sub-account transaction.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="fund">Fund</Label>
                  <Select
                    value={newTransaction.fund}
                    onValueChange={(value) => setNewTransaction({ ...newTransaction, fund: value })}
                  >
                    <SelectTrigger id="fund">
                      <SelectValue placeholder="Select fund" />
                    </SelectTrigger>
                    <SelectContent>
                      {subAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.fund}
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
                  <Label htmlFor="number">Number (Optional)</Label>
                  <Input
                    id="number"
                    value={newTransaction.number}
                    onChange={(e) => setNewTransaction({ ...newTransaction, number: e.target.value })}
                    placeholder="e.g., Check number"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                    placeholder="e.g., Monthly contribution"
                  />
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
          
          <Dialog open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Sub-Account
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Sub-Account</DialogTitle>
                <DialogDescription>
                  Create a new fund to track within your accounts.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="fund">Fund Name</Label>
                  <Input
                    id="fund"
                    value={newSubAccount.fund}
                    onChange={(e) => setNewSubAccount({ ...newSubAccount, fund: e.target.value })}
                    placeholder="e.g., Emergency Fund"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Select
                    value={newSubAccount.location}
                    onValueChange={(value) => setNewSubAccount({ ...newSubAccount, location: value })}
                  >
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.name}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="goal">Goal Amount</Label>
                  <Input
                    id="goal"
                    type="number"
                    value={newSubAccount.goal}
                    onChange={(e) => setNewSubAccount({ ...newSubAccount, goal: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="percentage">Target Percentage</Label>
                  <Input
                    id="percentage"
                    type="number"
                    value={newSubAccount.percentage}
                    onChange={(e) => setNewSubAccount({ ...newSubAccount, percentage: parseFloat(e.target.value) || 0 })}
                    placeholder="e.g., 20"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="balance">Starting Balance</Label>
                  <Input
                    id="balance"
                    type="number"
                    value={newSubAccount.balance}
                    onChange={(e) => setNewSubAccount({ ...newSubAccount, balance: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddAccountOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSubAccount}>Add Sub-Account</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sub-Accounts Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Total Balance</h3>
            <span className="text-2xl font-bold">
              <CurrencyDisplay amount={totalBalance} />
            </span>
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {subAccounts.slice(0, 4).map((account, index) => (
              <div
                key={index}
                className="rounded-lg border bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium truncate" title={account.fund}>
                    {account.fund}
                  </div>
                  <PiggyBank className="h-5 w-5 text-finance-neutral" />
                </div>
                <div className="text-lg font-bold mb-1">
                  <CurrencyDisplay amount={account.balance} />
                </div>
                {account.goal ? (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {getProgressPercentage(account.balance, account.goal).toFixed(0)}%
                      </span>
                      <span>
                        Goal: <CurrencyDisplay amount={account.goal} />
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-finance-neutral rounded-full"
                        style={{
                          width: `${getProgressPercentage(
                            account.balance,
                            account.goal
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">No goal set</div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="funds" className="w-full">
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value="funds">
            <PiggyBank className="h-4 w-4 mr-2" /> Funds
          </TabsTrigger>
          <TabsTrigger value="transactions">
            <Copy className="h-4 w-4 mr-2" /> Transactions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="funds" className="mt-4">
          <FinanceCard>
            <FinanceCardHeader title="Sub-Accounts" />
            <FinanceCardBody>
              <DataTable
                data={subAccounts}
                columns={[
                  {
                    header: "Fund",
                    accessorKey: "fund",
                    cell: (item) => (
                      <div className="flex items-center">
                        <PiggyBank className="h-4 w-4 mr-2 text-finance-neutral" />
                        <span>{item.fund}</span>
                      </div>
                    ),
                  },
                  {
                    header: "Location",
                    accessorKey: "location",
                  },
                  {
                    header: "Goal",
                    accessorKey: "goal",
                    cell: (item) => item.goal ? (
                      <div className="flex items-center">
                        <Target className="h-4 w-4 mr-2 text-muted-foreground" />
                        <CurrencyDisplay amount={item.goal} />
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    ),
                  },
                  {
                    header: "Percentage",
                    accessorKey: "percentage",
                    cell: (item) => item.percentage ? (
                      <div className="flex items-center">
                        <Percent className="h-4 w-4 mr-2 text-muted-foreground" />
                        {item.percentage}%
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    ),
                  },
                  {
                    header: "Progress",
                    accessorKey: "progress",
                    cell: (item) => item.goal ? (
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-finance-neutral rounded-full"
                          style={{
                            width: `${getProgressPercentage(item.balance, item.goal)}%`,
                          }}
                        />
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No goal</span>
                    ),
                  },
                  {
                    header: "Balance",
                    accessorKey: "balance",
                    cell: (item) => <CurrencyDisplay amount={item.balance} />,
                    className: "text-right font-medium",
                  },
                  {
                    header: "Actions",
                    accessorKey: "actions",
                    cell: (item) => (
                      <div className="flex space-x-2 justify-end">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setSelectedFund(item.id)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteSubAccount(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ),
                  },
                ]}
                onRowClick={(item) => setSelectedFund(item.id)}
                emptyState={
                  <div className="flex flex-col items-center justify-center py-8">
                    <p className="text-muted-foreground mb-4">No sub-accounts found</p>
                    <Button onClick={() => setIsAddAccountOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Add Sub-Account
                    </Button>
                  </div>
                }
              />
            </FinanceCardBody>
          </FinanceCard>
        </TabsContent>
        
        <TabsContent value="transactions" className="mt-4">
          <FinanceCard>
            <FinanceCardHeader 
              title={
                selectedFund 
                  ? `Transactions: ${subAccounts.find(a => a.id === selectedFund)?.fund || 'Selected Fund'}`
                  : "Select a fund to view transactions"
              } 
              action={
                selectedFund && (
                  <Button size="sm" onClick={() => setIsAddTransactionOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add
                  </Button>
                )
              }
            />
            <FinanceCardBody>
              {selectedFund ? (
                <DataTable
                  data={fundTransactions}
                  columns={[
                    {
                      header: "Date",
                      accessorKey: "date",
                      cell: (item) => formatDate(item.date),
                    },
                    {
                      header: "Number",
                      accessorKey: "number",
                      cell: (item) => item.number || "—",
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
                      header: "Memo",
                      accessorKey: "memo",
                      cell: (item) => item.memo ? (
                        <div className="max-w-[200px] truncate" title={item.memo}>
                          {item.memo}
                        </div>
                      ) : "—",
                    },
                    {
                      header: "Payment",
                      accessorKey: "payment",
                      cell: (item) => item.payment ? (
                        <CurrencyDisplay amount={item.payment} />
                      ) : null,
                      className: "text-right",
                    },
                    {
                      header: "Deposit",
                      accessorKey: "deposit",
                      cell: (item) => item.deposit ? (
                        <CurrencyDisplay amount={item.deposit} />
                      ) : null,
                      className: "text-right",
                    },
                    {
                      header: "Balance",
                      accessorKey: "fundBalance",
                      cell: (item) => item.fundBalance ? (
                        <CurrencyDisplay amount={item.fundBalance} />
                      ) : "—",
                      className: "text-right font-medium",
                    },
                  ]}
                  emptyState={
                    <div className="flex flex-col items-center justify-center py-8">
                      <p className="text-muted-foreground mb-4">No transactions found</p>
                      <Button onClick={() => setIsAddTransactionOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Transaction
                      </Button>
                    </div>
                  }
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <PieChart className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                  <p className="text-muted-foreground mb-2">Select a fund to view its transactions</p>
                  <p className="text-sm text-muted-foreground">
                    Click on any sub-account in the Funds tab
                  </p>
                </div>
              )}
            </FinanceCardBody>
          </FinanceCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubAccountsPage;
