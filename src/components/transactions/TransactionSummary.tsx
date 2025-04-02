
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CurrencyDisplay } from "@/components/ui/currency-display";

interface TransactionSummaryProps {
  totalIncome: number;
  totalExpenses: number;
}

export const TransactionSummary: React.FC<TransactionSummaryProps> = ({
  totalIncome,
  totalExpenses,
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="border rounded-lg overflow-hidden">
        <CardHeader className="pb-2 bg-slate-50 dark:bg-slate-800 border-b">
          <CardTitle className="text-base font-semibold">
            Income (Filtered)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-finance-income">
            <CurrencyDisplay amount={totalIncome} />
          </div>
        </CardContent>
      </Card>
      <Card className="border rounded-lg overflow-hidden">
        <CardHeader className="pb-2 bg-slate-50 dark:bg-slate-800 border-b">
          <CardTitle className="text-base font-semibold">
            Expenses (Filtered)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-finance-expense">
            <CurrencyDisplay amount={totalExpenses} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
