
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyDisplay } from "@/components/ui/currency-display";

interface BudgetOverviewProps {
  income: number;
  expenses: number;
  net: number;
  activeMonth: number;
  activeYear: number;
  months: string[];
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  expenseItems: any[];
  getCategoryName: (categoryId: string) => string;
}

const BudgetOverview: React.FC<BudgetOverviewProps> = ({
  income,
  expenses,
  net,
  activeMonth,
  activeYear,
  months,
  onPreviousMonth,
  onNextMonth,
  expenseItems,
  getCategoryName,
}) => {
  return (
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
              <Button variant="outline" size="sm" onClick={onPreviousMonth}>
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={onNextMonth}>
                Next
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
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
  );
};

export default BudgetOverview;
