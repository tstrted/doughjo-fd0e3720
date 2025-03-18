
import React, { useState, useMemo } from "react";
import { useFinance } from "@/context/FinanceContext";
import { FinanceCard, FinanceCardHeader, FinanceCardBody } from "@/components/ui/finance-card";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, RefreshCw, CreditCard, Wallet, PiggyBank, Landmark } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const AccountsPage = () => {
  const { accounts, transactions, addAccount, updateAccount, deleteAccount, formatCurrency } = useFinance();
  const { toast } = useToast();
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isEditAccountOpen, setIsEditAccountOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [newAccount, setNewAccount] = useState({
    name: "",
    type: "Checking",
    balance: 0,
    cleared: 0,
  });

  // Calculate account balances from transactions
  const accountsWithBalances = useMemo(() => {
    return accounts.map(account => {
      // Filter transactions for this account
      const accountTransactions = transactions.filter(t => t.account === account.id);
      
      // Calculate balance
      let balance = 0;
      let cleared = 0;
      
      accountTransactions.forEach(transaction => {
        // Add deposits, subtract payments
        if (transaction.deposit) {
          balance += transaction.deposit;
          if (transaction.clearedBalance !== undefined) {
            cleared += transaction.deposit;
          }
        }
        if (transaction.payment) {
          balance -= transaction.payment;
          if (transaction.clearedBalance !== undefined) {
            cleared -= transaction.payment;
          }
        }
      });
      
      return {
        ...account,
        balance: balance,
        cleared: cleared
      };
    });
  }, [accounts, transactions]);

  // Calculate total assets, liabilities, and net worth
  const totalAssets = accountsWithBalances
    .filter(a => a.type !== "Credit")
    .reduce((sum, account) => sum + account.balance, 0);
    
  const totalLiabilities = accountsWithBalances
    .filter(a => a.type === "Credit")
    .reduce((sum, account) => sum + account.balance, 0);
    
  const netWorth = totalAssets - totalLiabilities;

  // Function to get account type icon
  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case "Checking":
        return <CreditCard className="h-4 w-4" />;
      case "Savings":
        return <Wallet className="h-4 w-4" />;
      case "Investment":
        return <Landmark className="h-4 w-4" />;
      case "Credit":
        return <CreditCard className="h-4 w-4 text-finance-expense" />;
      default:
        return <PiggyBank className="h-4 w-4" />;
    }
  };

  // Handle account form submission
  const handleAddAccount = () => {
    addAccount({
      name: newAccount.name,
      type: newAccount.type,
      balance: 0, // Initial balance is 0, it will be calculated from transactions
      cleared: 0,
    });
    
    setNewAccount({
      name: "",
      type: "Checking",
      balance: 0,
      cleared: 0,
    });
    
    setIsAddAccountOpen(false);
    toast({
      title: "Success",
      description: "Account added successfully",
    });
  };

  // Handle account editing
  const handleEditAccount = () => {
    if (currentAccount) {
      const account = accounts.find(a => a.id === currentAccount);
      if (account) {
        updateAccount(currentAccount, {
          name: newAccount.name,
          type: newAccount.type,
        });
        
        setIsEditAccountOpen(false);
        setCurrentAccount(null);
        toast({
          title: "Success",
          description: "Account updated successfully",
        });
      }
    }
  };

  // Open edit account dialog
  const openEditAccount = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    if (account) {
      setNewAccount({
        name: account.name,
        type: account.type,
        balance: account.balance,
        cleared: account.cleared || 0,
      });
      setCurrentAccount(accountId);
      setIsEditAccountOpen(true);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = (accountId: string) => {
    deleteAccount(accountId);
    toast({
      title: "Success",
      description: "Account deleted successfully",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Accounts</h2>
        <Dialog open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Account</DialogTitle>
              <DialogDescription>
                Enter the details for your new financial account.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Account Name</Label>
                <Input
                  id="name"
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                  placeholder="e.g., Checking Account"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Account Type</Label>
                <Select
                  value={newAccount.type}
                  onValueChange={(value) => setNewAccount({ ...newAccount, type: value })}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Checking">Checking</SelectItem>
                    <SelectItem value="Savings">Savings</SelectItem>
                    <SelectItem value="Investment">Investment</SelectItem>
                    <SelectItem value="Credit">Credit Card</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddAccountOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAccount}>Add Account</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Account Dialog */}
        <Dialog open={isEditAccountOpen} onOpenChange={setIsEditAccountOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Account</DialogTitle>
              <DialogDescription>
                Update your account details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Account Name</Label>
                <Input
                  id="edit-name"
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-type">Account Type</Label>
                <Select
                  value={newAccount.type}
                  onValueChange={(value) => setNewAccount({ ...newAccount, type: value })}
                >
                  <SelectTrigger id="edit-type">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Checking">Checking</SelectItem>
                    <SelectItem value="Savings">Savings</SelectItem>
                    <SelectItem value="Investment">Investment</SelectItem>
                    <SelectItem value="Credit">Credit Card</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditAccountOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditAccount}>Update Account</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <CurrencyDisplay amount={totalAssets} />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Liabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <CurrencyDisplay amount={totalLiabilities} />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Net Worth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <CurrencyDisplay amount={netWorth} colorCode={true} />
            </div>
          </CardContent>
        </Card>
      </div>

      <FinanceCard>
        <FinanceCardHeader title="Accounts List" action={
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh Balances
          </Button>
        } />
        <FinanceCardBody>
          <DataTable
            data={accountsWithBalances}
            columns={[
              {
                header: "Account",
                accessorKey: "name",
                cell: (item) => (
                  <div className="flex items-center">
                    <div className="mr-2">{getAccountTypeIcon(item.type)}</div>
                    <span>{item.name}</span>
                  </div>
                ),
              },
              {
                header: "Type",
                accessorKey: "type",
              },
              {
                header: "Goal",
                accessorKey: "goal",
                cell: (item) => item.goal ? <CurrencyDisplay amount={item.goal} /> : "n/a",
              },
              {
                header: "Cleared",
                accessorKey: "cleared",
                cell: (item) => <CurrencyDisplay amount={item.cleared} />,
              },
              {
                header: "Balance",
                accessorKey: "balance",
                cell: (item) => <CurrencyDisplay amount={item.balance} colorCode={true} />,
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
                      onClick={() => openEditAccount(item.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteAccount(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ),
              },
            ]}
            emptyState={
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground mb-4">No accounts found</p>
                <Button onClick={() => setIsAddAccountOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Account
                </Button>
              </div>
            }
          />
        </FinanceCardBody>
      </FinanceCard>
    </div>
  );
};

export default AccountsPage;
