
import React, { useState } from "react";
import { useFinance, CategoryData, ReportData } from "@/context/FinanceContext";
import { FinanceCard, FinanceCardHeader, FinanceCardBody } from "@/components/ui/finance-card";
import { StatCard } from "@/components/ui/stat-card";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  PieChart,
  ArrowDownRight,
  ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface CategoryDataWithName extends CategoryData {
  category: string;
}

const ReportsPage = () => {
  const { generateReportData, calculateMonthlyBudget, calculateActualSpending, formatCurrency } = useFinance();
  const [activeMonth, setActiveMonth] = useState<number>(new Date().getMonth() + 1);
  const [activeYear, setActiveYear] = useState<number>(new Date().getFullYear());
  const [yearToDate, setYearToDate] = useState(false);
  
  // Generate report data based on current selection
  const reportData: ReportData = generateReportData(activeMonth, activeYear, yearToDate);
  
  // Month and year navigation
  const prevMonth = () => {
    if (activeMonth === 1) {
      setActiveMonth(12);
      setActiveYear(activeYear - 1);
    } else {
      setActiveMonth(activeMonth - 1);
    }
  };
  
  const nextMonth = () => {
    if (activeMonth === 12) {
      setActiveMonth(1);
      setActiveYear(activeYear + 1);
    } else {
      setActiveMonth(activeMonth + 1);
    }
  };
  
  // Format month for display
  const formatMonth = (month: number, year: number) => {
    const date = new Date(year, month - 1, 1);
    return format(date, "MMMM yyyy");
  };
  
  // Sort categories by absolute difference (largest variances first)
  const sortedCategories = Object.entries(reportData.categories)
    .sort(([, a], [, b]) => Math.abs(b.difference) - Math.abs(a.difference));
  
  // Calculate positive and negative variances for chart data
  const positiveVariances = sortedCategories
    .filter(([, data]) => data.difference > 0)
    .slice(0, 5);
  
  const negativeVariances = sortedCategories
    .filter(([, data]) => data.difference < 0)
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="ytd" 
              checked={yearToDate} 
              onCheckedChange={setYearToDate} 
            />
            <Label htmlFor="ytd">Year to Date</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-[150px] text-center font-medium">
              {formatMonth(activeMonth, activeYear)}
            </span>
            <Button variant="outline" size="icon" onClick={nextMonth}>
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
          title="Budget Income"
          value={reportData.budgetSummary.income}
          icon={<ArrowDownRight className="h-8 w-8 text-finance-income" />}
          trend={reportData.difference.income > 0 ? "up" : "down"}
          change={reportData.budgetSummary.income !== 0 
            ? (Math.abs(reportData.difference.income) / reportData.budgetSummary.income) * 100 
            : 0}
          changeLabel={reportData.difference.income > 0 ? "above budget" : "below budget"}
        />
        <StatCard
          title="Budget Expenses"
          value={reportData.budgetSummary.expenses}
          icon={<ArrowUpRight className="h-8 w-8 text-finance-expense" />}
          trend={reportData.difference.expenses < 0 ? "up" : "down"}
          change={reportData.budgetSummary.expenses !== 0 
            ? (Math.abs(reportData.difference.expenses) / reportData.budgetSummary.expenses) * 100 
            : 0}
          changeLabel={reportData.difference.expenses < 0 ? "under budget" : "over budget"}
        />
        <StatCard
          title="Net Difference"
          value={reportData.difference.net}
          icon={<TrendingUp className="h-8 w-8 text-finance-neutral" />}
          trend={reportData.difference.net > 0 ? "up" : "down"}
          change={reportData.budgetSummary.net !== 0 
            ? (Math.abs(reportData.difference.net) / Math.abs(reportData.budgetSummary.net)) * 100 
            : 0}
          changeLabel="vs. budget"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Budget Summary</CardTitle>
          </CardHeader>
          <CardContent className="px-6">
            <div className="grid gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Income</span>
                  <span className="text-sm text-muted-foreground">
                    <CurrencyDisplay amount={reportData.actualSummary.income} /> of{" "}
                    <CurrencyDisplay amount={reportData.budgetSummary.income} />
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-finance-income rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (reportData.actualSummary.income / reportData.budgetSummary.income) * 100 || 0
                      )}%`
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Expenses</span>
                  <span className="text-sm text-muted-foreground">
                    <CurrencyDisplay amount={reportData.actualSummary.expenses} /> of{" "}
                    <CurrencyDisplay amount={reportData.budgetSummary.expenses} />
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-finance-expense rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (reportData.actualSummary.expenses / reportData.budgetSummary.expenses) * 100 || 0
                      )}%`
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Net</span>
                  <span className="text-sm text-muted-foreground">
                    <CurrencyDisplay amount={reportData.actualSummary.net} colorCode={true} /> of{" "}
                    <CurrencyDisplay amount={reportData.budgetSummary.net} colorCode={true} />
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full ${
                      reportData.actualSummary.net >= 0 ? "bg-finance-income" : "bg-finance-expense"
                    } rounded-full`}
                    style={{
                      width: `${Math.min(
                        100,
                        (Math.abs(reportData.actualSummary.net) / Math.abs(reportData.budgetSummary.net)) * 100 || 0
                      )}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Variances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-finance-expense mb-2">Over Budget</h4>
                {negativeVariances.length > 0 ? (
                  <div className="space-y-2">
                    {negativeVariances.map(([category, data], index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{
                              backgroundColor: `hsl(0, ${70 + index * 5}%, ${50 - index * 3}%)`
                            }}
                          />
                          <span className="text-sm truncate max-w-[180px]" title={category}>
                            {category}
                          </span>
                        </div>
                        <CurrencyDisplay amount={data.difference} colorCode={true} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No over budget categories</p>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium text-finance-income mb-2">Under Budget</h4>
                {positiveVariances.length > 0 ? (
                  <div className="space-y-2">
                    {positiveVariances.map(([category, data], index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{
                              backgroundColor: `hsl(120, ${70 + index * 5}%, ${50 - index * 3}%)`
                            }}
                          />
                          <span className="text-sm truncate max-w-[180px]" title={category}>
                            {category}
                          </span>
                        </div>
                        <CurrencyDisplay amount={data.difference} colorCode={true} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No under budget categories</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value="summary">
            <BarChart3 className="h-4 w-4 mr-2" /> Summary
          </TabsTrigger>
          <TabsTrigger value="categories">
            <PieChart className="h-4 w-4 mr-2" /> Categories
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="mt-4">
          <FinanceCard>
            <FinanceCardHeader title="Budget vs. Actual" />
            <FinanceCardBody>
              <div className="grid gap-6">
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-4 md:col-span-1">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Income</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Budget</p>
                            <p className="text-sm font-medium">
                              <CurrencyDisplay amount={reportData.budgetSummary.income} />
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Actual</p>
                            <p className="text-sm font-medium">
                              <CurrencyDisplay amount={reportData.actualSummary.income} />
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Expenses</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Budget</p>
                            <p className="text-sm font-medium">
                              <CurrencyDisplay amount={reportData.budgetSummary.expenses} />
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Actual</p>
                            <p className="text-sm font-medium">
                              <CurrencyDisplay amount={reportData.actualSummary.expenses} />
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Net</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Budget</p>
                            <p className="text-sm font-medium">
                              <CurrencyDisplay amount={reportData.budgetSummary.net} colorCode={true} />
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Actual</p>
                            <p className="text-sm font-medium">
                              <CurrencyDisplay amount={reportData.actualSummary.net} colorCode={true} />
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-4 md:col-span-3 min-h-[200px] flex items-center justify-center">
                    {/* Placeholder for chart */}
                    <div className="w-full h-[200px] flex items-end justify-center gap-8">
                      <div className="flex flex-col items-center">
                        <div className="text-xs mb-2">Budget</div>
                        <div className="relative w-24">
                          <div 
                            className="w-full bg-blue-200" 
                            style={{ height: `${Math.max(1, 150 * (reportData.budgetSummary.income / 5000))}px` }}
                          >
                            <div className="absolute top-0 left-0 w-full text-center text-xs -mt-5">
                              Income
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-xs mb-2">Actual</div>
                        <div className="relative w-24">
                          <div 
                            className="w-full bg-blue-500" 
                            style={{ height: `${Math.max(1, 150 * (reportData.actualSummary.income / 5000))}px` }}
                          >
                            <div className="absolute top-0 left-0 w-full text-center text-xs -mt-5">
                              Income
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-xs mb-2">Budget</div>
                        <div className="relative w-24">
                          <div 
                            className="w-full bg-red-200" 
                            style={{ height: `${Math.max(1, 150 * (reportData.budgetSummary.expenses / 5000))}px` }}
                          >
                            <div className="absolute top-0 left-0 w-full text-center text-xs -mt-5">
                              Expenses
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-xs mb-2">Actual</div>
                        <div className="relative w-24">
                          <div 
                            className="w-full bg-red-500" 
                            style={{ height: `${Math.max(1, 150 * (reportData.actualSummary.expenses / 5000))}px` }}
                          >
                            <div className="absolute top-0 left-0 w-full text-center text-xs -mt-5">
                              Expenses
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FinanceCardBody>
          </FinanceCard>
        </TabsContent>
        
        <TabsContent value="categories" className="mt-4">
          <FinanceCard>
            <FinanceCardHeader title="Category Details" />
            <FinanceCardBody>
              <DataTable
                data={sortedCategories.map(([category, data]) => ({
                  category,
                  budget: data.budget,
                  actual: data.actual,
                  difference: data.difference
                }))}
                columns={[
                  {
                    header: "Category",
                    accessorKey: "category",
                  },
                  {
                    header: "Budget",
                    accessorKey: "budget",
                    cell: (item) => <CurrencyDisplay amount={item.budget} />,
                    className: "text-right",
                  },
                  {
                    header: "Actual",
                    accessorKey: "actual",
                    cell: (item) => <CurrencyDisplay amount={item.actual} />,
                    className: "text-right",
                  },
                  {
                    header: "Difference",
                    accessorKey: "difference",
                    cell: (item) => <CurrencyDisplay amount={item.difference} colorCode={true} />,
                    className: "text-right font-medium",
                  },
                  {
                    header: "% of Budget",
                    accessorKey: "percentOfBudget",
                    cell: (item) => {
                      const percent = item.budget !== 0 
                        ? (item.actual / item.budget) * 100 
                        : item.actual > 0 ? 100 : 0;
                      
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
                    <p className="text-muted-foreground">No category data available</p>
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

export default ReportsPage;
