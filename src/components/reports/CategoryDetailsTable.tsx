
import React from "react";
import { FinanceCard, FinanceCardHeader, FinanceCardBody } from "@/components/ui/finance-card";
import { DataTable } from "@/components/ui/data-table";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import { CategoryData } from "@/context/FinanceContext";

interface CategoryDetailsTableProps {
  sortedCategories: Array<[string, CategoryData]>;
}

export function CategoryDetailsTable({ sortedCategories }: CategoryDetailsTableProps) {
  return (
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
  );
}
