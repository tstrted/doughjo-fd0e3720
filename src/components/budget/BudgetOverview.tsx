
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
  getCategoryName
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-finance-income">
            <CurrencyDisplay amount={income} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-finance-expense">
            <CurrencyDisplay amount={expenses} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <CurrencyDisplay amount={net} colorCode={true} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetOverview;
