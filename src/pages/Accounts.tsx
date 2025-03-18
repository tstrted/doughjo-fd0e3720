
import React, { useState } from "react";
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

const AccountsPage = () => {
  const { accounts, addAccount, updateAccount, deleteAccount, formatCurrency } = useFinance();
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: "",
    type: "Checking",
    balance: 0,
    cleared: 0,
  });

  // Calculate total assets, liabilities, and net worth
  const totalAssets = accounts
    .filter(a => a.type !== "Credit")
    .reduce((sum, account) => sum + account.balance, 0);
    
  const totalLiabilities = accounts
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
      balance: newAccount.balance,
      cleared: newAccount.cleared,
    });
    
    setNewAccount({
      name: "",
      type: "Checking",
      balance: 0,
      cleared: 0,
    });
    
    setIsAddAccountOpen(false);
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
              <div className="grid gap-2">
                <Label htmlFor="balance">Current Balance</Label>
                <Input
                  id="balance"
                  type="number"
                  value={newAccount.balance}
                  onChange={(e) => setNewAccount({ ...newAccount, balance: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cleared">Cleared Balance</Label>
                <Input
                  id="cleared"
                  type="number"
                  value={newAccount.cleared}
                  onChange={(e) => setNewAccount({ ...newAccount, cleared: parseFloat(e.target.value) || 0 })}
                />
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
            data={accounts}
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
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => deleteAccount(item.id)}
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
