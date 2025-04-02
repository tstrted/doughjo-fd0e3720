
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import { useFinance } from "@/context/FinanceContext";

interface BalanceCardProps {
  title: string;
  amount: number;
  percentOfExpenses?: number;
  isNegative?: boolean;
}

const BalanceCard: React.FC<BalanceCardProps> = ({
  title,
  amount,
  percentOfExpenses,
  isNegative = false,
}) => {
  const { settings } = useFinance();

  return (
    <Card className="shadow-sm h-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <TrendingUp className={`h-4 w-4 ${isNegative ? 'text-red-500' : 'text-blue-500'}`} />
        </div>
        
        <div className="text-2xl font-bold mb-1">
          <CurrencyDisplay amount={amount} colorCode={true} />
        </div>
        
        {percentOfExpenses !== undefined && (
          <div className="text-xs text-muted-foreground">
            {isNegative ? '-' : '+'}{Math.abs(percentOfExpenses).toFixed(1)}% of expenses
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BalanceCard;
