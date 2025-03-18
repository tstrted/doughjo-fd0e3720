
import React, { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { FinanceCard, FinanceCardHeader, FinanceCardBody } from "@/components/ui/finance-card";
import { StatCard } from "@/components/ui/stat-card";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import { Button } from "@/components/ui/button";
import { 
  LineChart, 
  TrendingUp, 
  Download, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";

const YearlyReportsPage = () => {
  const { generateYearlyReportData, formatCurrency } = useFinance();
  const [activeYear, setActiveYear] = useState<number>(new Date().getFullYear());
  
  // Generate yearly report data
  const yearlyData = generateYearlyReportData(activeYear);
  
  // Year navigation
  const prevYear = () => setActiveYear(activeYear - 1);
  const nextYear = () => setActiveYear(activeYear + 1);
  
  // Calculate YTD figures (up to current month if in current year)
  const isCurrentYear = activeYear === new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-11
  
  const ytdIncome = isCurrentYear
    ? yearlyData.monthlyData.slice(0, currentMonth + 1).reduce((sum, month) => sum + month.income, 0)
    : yearlyData.totals.income;
    
  const ytdExpenses = isCurrentYear
    ? yearlyData.monthlyData.slice(0, currentMonth + 1).reduce((sum, month) => sum + month.expenses, 0)
    : yearlyData.totals.expenses;
    
  const ytdNet = ytdIncome - ytdExpenses;
  
  // Sort categories by total
  const sortedIncomeCategories = Object.entries(yearlyData.categoryBreakdown)
    .filter(([category]) => ["JD Salary", "Interest", "Miscellaneous Income"].includes(category))
    .sort(([, a], [, b]) => b.total - a.total);
    
  const sortedExpenseCategories = Object.entries(yearlyData.categoryBreakdown)
    .filter(([category]) => !["JD Salary", "Interest", "Miscellaneous Income", "Beginning Balance", "Transfer"].includes(category))
    .sort(([, a], [, b]) => b.total - a.total);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Yearly Report</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={prevYear}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-[100px] text-center font-medium">
              {activeYear}
            </span>
            <Button variant="outline" size="icon" onClick={nextYear}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Year-to-Date Income"
          value={ytdIncome}
          icon={<ArrowDownRight className="h-8 w-8 text-finance-income" />}
          trend="up"
          change={isCurrentYear ? (ytdIncome / (yearlyData.averages.income * (currentMonth + 1)) - 1) * 100 : 0}
          changeLabel="vs. average"
        />
        <StatCard
          title="Year-to-Date Expenses"
          value={ytdExpenses}
          icon={<ArrowUpRight className="h-8 w-8 text-finance-expense" />}
          trend="down"
          change={isCurrentYear ? (ytdExpenses / (yearlyData.averages.expenses * (currentMonth + 1)) - 1) * 100 : 0}
          changeLabel="vs. average"
        />
        <StatCard
          title="Year-to-Date Net"
          value={ytdNet}
          icon={<TrendingUp className="h-8 w-8 text-finance-neutral" />}
          trend={ytdNet > 0 ? "up" : "down"}
          change={isCurrentYear && yearlyData.averages.net !== 0 
            ? (ytdNet / Math.abs(yearlyData.averages.net * (currentMonth + 1)) - 1) * 100 
            : 0}
          changeLabel="vs. average"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Income & Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-end justify-between px-4">
            {yearlyData.monthlyData.map((month, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="text-xs mb-1">{month.monthName}</div>
                <div className="flex space-x-1">
                  <div 
                    className="w-5 bg-finance-income opacity-80" 
                    style={{ 
                      height: `${Math.max(1, (month.income / (yearlyData.averages.income * 2)) * 200)}px` 
                    }}
                  />
                  <div 
                    className="w-5 bg-finance-expense opacity-80" 
                    style={{ 
                      height: `${Math.max(1, (month.expenses / (yearlyData.averages.expenses * 2)) * 200)}px` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-finance-income opacity-80 mr-2" />
              <span className="text-sm">Income</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-finance-expense opacity-80 mr-2" />
              <span className="text-sm">Expenses</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value="monthly">
            <Calendar className="h-4 w-4 mr-2" /> Monthly
          </TabsTrigger>
          <TabsTrigger value="categories">
            <BarChart3 className="h-4 w-4 mr-2" /> Categories
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="monthly" className="mt-4">
          <FinanceCard>
            <FinanceCardHeader title="Monthly Breakdown" />
            <FinanceCardBody>
              <DataTable
                data={yearlyData.monthlyData}
                columns={[
                  {
                    header: "Month",
                    accessorKey: "monthName",
                  },
                  {
                    header: "Income",
                    accessorKey: "income",
                    cell: (item) => <CurrencyDisplay amount={item.income} />,
                    className: "text-right",
                  },
                  {
                    header: "Expenses",
                    accessorKey: "expenses",
                    cell: (item) => <CurrencyDisplay amount={item.expenses} />,
                    className: "text-right",
                  },
                  {
                    header: "Net",
                    accessorKey: "net",
                    cell: (item) => <CurrencyDisplay amount={item.net} colorCode={true} />,
                    className: "text-right font-medium",
                  },
                  {
                    header: "% of Income",
                    accessorKey: "percentOfIncome",
                    cell: (item) => {
                      const percent = item.income !== 0 
                        ? (item.expenses / item.income) * 100 
                        : 0;
                      
                      return (
                        <div className="flex items-center justify-end">
                          <span className={percent > 100 ? "text-finance-expense" : "text-finance-income"}>
                            {percent.toFixed(1)}%
                          </span>
                        </div>
                      );
                    },
                    className: "text-right",
                  },
                ]}
                emptyState={
                  <div className="flex flex-col items-center justify-center py-8">
                    <p className="text-muted-foreground">No monthly data available</p>
                  </div>
                }
              />
            </FinanceCardBody>
          </FinanceCard>
        </TabsContent>
        
        <TabsContent value="categories" className="mt-4">
          <div className="grid gap-6">
            <FinanceCard>
              <FinanceCardHeader title="Income Categories" />
              <FinanceCardBody>
                <DataTable
                  data={sortedIncomeCategories.map(([category, data]) => ({
                    category,
                    ...data,
                  }))}
                  columns={[
                    {
                      header: "Category",
                      accessorKey: "category",
                    },
                    {
                      header: "Total",
                      accessorKey: "total",
                      cell: (item) => <CurrencyDisplay amount={item.total} />,
                      className: "text-right",
                    },
                    {
                      header: "Monthly Average",
                      accessorKey: "average",
                      cell: (item) => <CurrencyDisplay amount={item.average} />,
                      className: "text-right",
                    },
                    {
                      header: "% of Income",
                      accessorKey: "percentOfIncome",
                      cell: (item) => {
                        const percent = yearlyData.totals.income !== 0 
                          ? (item.total / yearlyData.totals.income) * 100 
                          : 0;
                        
                        return (
                          <div className="flex items-center justify-end">
                            <span>{percent.toFixed(1)}%</span>
                          </div>
                        );
                      },
                      className: "text-right",
                    },
                  ]}
                  emptyState={
                    <div className="flex flex-col items-center justify-center py-8">
                      <p className="text-muted-foreground">No income categories found</p>
                    </div>
                  }
                />
              </FinanceCardBody>
            </FinanceCard>
            
            <FinanceCard>
              <FinanceCardHeader title="Expense Categories" />
              <FinanceCardBody>
                <DataTable
                  data={sortedExpenseCategories.map(([category, data]) => ({
                    category,
                    ...data,
                  }))}
                  columns={[
                    {
                      header: "Category",
                      accessorKey: "category",
                    },
                    {
                      header: "Total",
                      accessorKey: "total",
                      cell: (item) => <CurrencyDisplay amount={item.total} />,
                      className: "text-right",
                    },
                    {
                      header: "Monthly Average",
                      accessorKey: "average",
                      cell: (item) => <CurrencyDisplay amount={item.average} />,
                      className: "text-right",
                    },
                    {
                      header: "% of Expenses",
                      accessorKey: "percentOfExpenses",
                      cell: (item) => {
                        const percent = yearlyData.totals.expenses !== 0 
                          ? (item.total / yearlyData.totals.expenses) * 100 
                          : 0;
                        
                        return (
                          <div className="flex items-center justify-end">
                            <span>{percent.toFixed(1)}%</span>
                          </div>
                        );
                      },
                      className: "text-right",
                    },
                  ]}
                  emptyState={
                    <div className="flex flex-col items-center justify-center py-8">
                      <p className="text-muted-foreground">No expense categories found</p>
                    </div>
                  }
                />
              </FinanceCardBody>
            </FinanceCard>
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Annual Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Total Income</h4>
                <p className="text-2xl font-bold text-finance-income">
                  <CurrencyDisplay amount={yearlyData.totals.income} />
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Monthly Average</h4>
                <p className="text-lg font-medium">
                  <CurrencyDisplay amount={yearlyData.averages.income} />
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Total Expenses</h4>
                <p className="text-2xl font-bold text-finance-expense">
                  <CurrencyDisplay amount={yearlyData.totals.expenses} />
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Monthly Average</h4>
                <p className="text-lg font-medium">
                  <CurrencyDisplay amount={yearlyData.averages.expenses} />
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Net Balance</h4>
                <p className="text-2xl font-bold">
                  <CurrencyDisplay amount={yearlyData.totals.net} colorCode={true} />
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Expense Ratio</h4>
                <p className="text-lg font-medium">
                  {yearlyData.totals.income !== 0 
                    ? ((yearlyData.totals.expenses / yearlyData.totals.income) * 100).toFixed(1) 
                    : "0"}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default YearlyReportsPage;
