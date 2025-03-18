
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import { CategoryData } from "@/context/FinanceContext";

interface VariancesCardProps {
  positiveVariances: Array<[string, CategoryData]>;
  negativeVariances: Array<[string, CategoryData]>;
}

export function VariancesCard({ positiveVariances, negativeVariances }: VariancesCardProps) {
  return (
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
  );
}
