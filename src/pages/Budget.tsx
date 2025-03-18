
import React, { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { FinanceCard, FinanceCardHeader, FinanceCardBody } from "@/components/ui/finance-card";
import { StatCard } from "@/components/ui/stat-card";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import { Wallet, TrendingUp, TrendingDown, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Budget = () => {
  const { 
    budgetItems, 
    categories, 
    addBudgetItem, 
    updateBudgetItem, 
    deleteBudgetItem,
    calculateMonthlyBudget,
    formatCurrency
  } = useFinance();
  
  const { toast } = useToast();
  const [activeMonth, setActiveMonth] = useState<number>(new Date().getMonth() + 1);
  const [activeYear, setActiveYear] = useState<number>(new Date().getFullYear());
  const [isAddBudgetItemOpen, setIsAddBudgetItemOpen] = useState(false);
  
  // New budget item state
  const [newBudgetItem, setNewBudgetItem] = useState({
    category: "",
    type: "expense" as "income" | "expense",
    amounts: {} as Record<string, number>
  });
  
  // Calculate budget summary for the active month
  const { income, expenses, net } = calculateMonthlyBudget(activeMonth, activeYear);
  
  // Month names for display
  const months = [
    'jan', 'feb', 'mar', 'apr', 'may', 'jun', 
    'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
  ];
  
  // Filter budget items by type
  const incomeItems = budgetItems.filter(item => item.type === 'income');
  const expenseItems = budgetItems.filter(item => item.type === 'expense');

  // Get category name for display
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  // Handler for adding a new budget item
  const handleAddBudgetItem = () => {
    if (!newBudgetItem.category) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive"
      });
      return;
    }

    addBudgetItem(newBudgetItem);
    
    setNewBudgetItem({
      category: "",
      type: "expense",
      amounts: {}
    });
    
    setIsAddBudgetItemOpen(false);
    
    toast({
      title: "Success",
      description: "Budget item added successfully",
    });
  };

  // Handler for deleting a budget item
  const handleDeleteBudgetItem = (id: string) => {
    deleteBudgetItem(id);
    toast({
      title: "Success",
      description: "Budget item deleted successfully",
    });
  };

  // Handler for setting a monthly amount
  const handleSetMonthlyAmount = (month: string, value: string) => {
    const amount = parseFloat(value) || 0;
    setNewBudgetItem({
      ...newBudgetItem,
      amounts: {
        ...newBudgetItem.amounts,
        [month.toLowerCase()]: amount
      }
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Budget Planning</h2>
        <Dialog open={isAddBudgetItemOpen} onOpenChange={setIsAddBudgetItemOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Budget Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Budget Item</DialogTitle>
              <DialogDescription>
                Create a new budget item and set monthly amounts.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={newBudgetItem.type}
                  onValueChange={(value: "income" | "expense") => 
                    setNewBudgetItem({ ...newBudgetItem, type: value })
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newBudgetItem.category}
                  onValueChange={(value) => 
                    setNewBudgetItem({ ...newBudgetItem, category: value })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter(c => {
                        // Filter categories based on the selected type
                        if (newBudgetItem.type === "income") {
                          return ["JD Salary", "Interest", "Miscellaneous Income"].includes(c.name);
                        } else {
                          return !["JD Salary", "Interest", "Miscellaneous Income", "Beginning Balance", "Transfer"].includes(c.name);
                        }
                      })
                      .map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4">
                <Label>Monthly Amounts</Label>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {months.map((month, index) => (
                    <div key={month} className="flex items-center space-x-2">
                      <Label htmlFor={`month-${month}`} className="w-10 flex-shrink-0">
                        {month.charAt(0).toUpperCase() + month.slice(1)}
                      </Label>
                      <Input
                        id={`month-${month}`}
                        type="number"
                        placeholder="0.00"
                        value={newBudgetItem.amounts[month] || ""}
                        onChange={(e) => handleSetMonthlyAmount(month, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddBudgetItemOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddBudgetItem}>Add Budget Item</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Monthly Income"
          value={income}
          icon={<Wallet className="h-8 w-8 text-finance-income" />}
          trend="up"
          change={5.2}
        />
        <StatCard
          title="Monthly Expenses"
          value={expenses}
          icon={<TrendingDown className="h-8 w-8 text-finance-expense" />}
          trend="down"
          change={2.1}
        />
        <StatCard
          title="Net Balance"
          value={net}
          icon={<TrendingUp className="h-8 w-8 text-finance-neutral" />}
          trend={net > 0 ? "up" : "down"}
          change={Math.abs(net / expenses) * 10}
          changeLabel="of expenses"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Monthly Budget Overview</CardTitle>
                <CardDescription>
                  Income vs. expenses for {months[activeMonth - 1]} {activeYear}
                </CardDescription>
              </div>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => setActiveMonth(activeMonth > 1 ? activeMonth - 1 : 12)}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => setActiveMonth(activeMonth < 12 ? activeMonth + 1 : 1)}>
                  Next
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              {/* Placeholder for chart - to be implemented */}
              <div className="text-center p-4 space-y-4">
                <div className="w-full h-8 bg-blue-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-finance-neutral rounded-full" 
                    style={{ width: `${Math.min(100, (income / (expenses || 1)) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span>Income: <CurrencyDisplay amount={income} /></span>
                  <span>Expenses: <CurrencyDisplay amount={expenses} /></span>
                </div>
                <p className="text-xl font-medium">
                  Net: <CurrencyDisplay amount={net} colorCode={true} />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Budget Distribution</CardTitle>
            <CardDescription>
              Allocation of budget across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              {/* Placeholder for pie chart - to be implemented */}
              <div className="grid grid-cols-2 gap-4 w-full">
                {expenseItems.slice(0, 6).map((item, index) => {
                  const monthKey = months[activeMonth - 1].toLowerCase();
                  const amount = item.amounts[monthKey] || 0;
                  const percentage = Math.round((amount / (expenses || 1)) * 100);
                  
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ 
                            backgroundColor: `hsl(${index * 30}, 70%, 50%)` 
                          }}
                        />
                        <span className="text-sm truncate max-w-[120px]">
                          {getCategoryName(item.category)}
                        </span>
                      </div>
                      <span className="text-sm font-medium">{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="income" className="w-full">
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>
        
        <TabsContent value="income" className="mt-4">
          <FinanceCard>
            <FinanceCardHeader title="Income Categories" />
            <FinanceCardBody>
              <DataTable
                data={incomeItems}
                columns={[
                  {
                    header: "Category",
                    accessorKey: "category",
                    cell: (item) => getCategoryName(item.category),
                  },
                  ...months.map((month, index) => ({
                    header: month.charAt(0).toUpperCase() + month.slice(1),
                    accessorKey: `amounts.${month}`,
                    cell: (item) => {
                      const monthKey = month.toLowerCase();
                      return <CurrencyDisplay amount={item.amounts[monthKey] || 0} />;
                    },
                    className: activeMonth === index + 1 ? "bg-blue-50" : "",
                  })),
                  {
                    header: "Actions",
                    accessorKey: "actions",
                    cell: (item) => (
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => {
                          // Edit functionality to be implemented
                          toast({
                            title: "Edit",
                            description: `Edit budget item ${getCategoryName(item.category)}`,
                          });
                        }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteBudgetItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ),
                  },
                ]}
                emptyState={
                  <div className="flex flex-col items-center justify-center py-8">
                    <p className="text-muted-foreground mb-4">No income categories defined</p>
                    <Button onClick={() => {
                      setNewBudgetItem({...newBudgetItem, type: "income"});
                      setIsAddBudgetItemOpen(true);
                    }}>
                      <Plus className="mr-2 h-4 w-4" /> Add Income Category
                    </Button>
                  </div>
                }
              />
            </FinanceCardBody>
          </FinanceCard>
        </TabsContent>
        
        <TabsContent value="expenses" className="mt-4">
          <FinanceCard>
            <FinanceCardHeader title="Expense Categories" />
            <FinanceCardBody>
              <DataTable
                data={expenseItems}
                columns={[
                  {
                    header: "Category",
                    accessorKey: "category",
                    cell: (item) => getCategoryName(item.category),
                  },
                  ...months.map((month, index) => ({
                    header: month.charAt(0).toUpperCase() + month.slice(1),
                    accessorKey: `amounts.${month}`,
                    cell: (item) => {
                      const monthKey = month.toLowerCase();
                      return <CurrencyDisplay amount={item.amounts[monthKey] || 0} />;
                    },
                    className: activeMonth === index + 1 ? "bg-blue-50" : "",
                  })),
                  {
                    header: "Actions",
                    accessorKey: "actions",
                    cell: (item) => (
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => {
                          // Edit functionality to be implemented
                          toast({
                            title: "Edit",
                            description: `Edit budget item ${getCategoryName(item.category)}`,
                          });
                        }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteBudgetItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ),
                  },
                ]}
                emptyState={
                  <div className="flex flex-col items-center justify-center py-8">
                    <p className="text-muted-foreground mb-4">No expense categories defined</p>
                    <Button onClick={() => {
                      setNewBudgetItem({...newBudgetItem, type: "expense"});
                      setIsAddBudgetItemOpen(true);
                    }}>
                      <Plus className="mr-2 h-4 w-4" /> Add Expense Category
                    </Button>
                  </div>
                }
              />
            </FinanceCardBody>
          </FinanceCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Budget;
