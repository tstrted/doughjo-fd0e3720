
import React from "react";
import { FinanceCard, FinanceCardHeader, FinanceCardBody } from "@/components/ui/finance-card";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import { ReportData } from "@/context/FinanceContext";

interface BudgetActualComparisonProps {
  reportData: ReportData;
}

export function BudgetActualComparison({ reportData }: BudgetActualComparisonProps) {
  return (
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
  );
}
