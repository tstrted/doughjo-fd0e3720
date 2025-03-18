
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import { ReportData } from "@/context/FinanceContext";

interface BudgetSummaryCardProps {
  reportData: ReportData;
}

export function BudgetSummaryCard({ reportData }: BudgetSummaryCardProps) {
  return (
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
  );
}
