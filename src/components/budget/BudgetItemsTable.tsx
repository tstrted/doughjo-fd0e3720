
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinanceCard, FinanceCardHeader, FinanceCardBody } from "@/components/ui/finance-card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import { Edit, Trash2, Plus } from "lucide-react";
import { BudgetItem } from "@/types/finance";

interface BudgetItemsTableProps {
  incomeItems: BudgetItem[];
  expenseItems: BudgetItem[];
  months: string[];
  activeMonth: number;
  getCategoryName: (categoryId: string) => string;
  onEditBudgetItem: (item: BudgetItem) => void;
  onDeleteBudgetItem: (id: string) => void;
  onAddIncome: () => void;
  onAddExpense: () => void;
}

const BudgetItemsTable: React.FC<BudgetItemsTableProps> = ({
  incomeItems,
  expenseItems,
  months,
  activeMonth,
  getCategoryName,
  onEditBudgetItem,
  onDeleteBudgetItem,
  onAddIncome,
  onAddExpense
}) => {
  return (
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
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onEditBudgetItem(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onDeleteBudgetItem(item.id)}
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
                  <Button onClick={onAddIncome}>
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
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onEditBudgetItem(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onDeleteBudgetItem(item.id)}
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
                  <Button onClick={onAddExpense}>
                    <Plus className="mr-2 h-4 w-4" /> Add Expense Category
                  </Button>
                </div>
              }
            />
          </FinanceCardBody>
        </FinanceCard>
      </TabsContent>
    </Tabs>
  );
};

export default BudgetItemsTable;
