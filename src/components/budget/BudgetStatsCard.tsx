
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import { TrendingUp, TrendingDown } from "lucide-react";

interface BudgetStatsCardProps {
  title: string;
  amount: number;
  trendPercentage?: number;
  trendDirection?: 'up' | 'down';
  trendLabel?: string;
}

const BudgetStatsCard: React.FC<BudgetStatsCardProps> = ({
  title,
  amount,
  trendPercentage,
  trendDirection = 'up',
  trendLabel = 'from previous period',
}) => {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
        
        <div className="text-2xl font-bold mb-1">
          <CurrencyDisplay amount={amount} colorCode={false} />
        </div>
        
        {trendPercentage !== undefined && (
          <div className="flex items-center text-xs">
            <span className={`
              flex items-center mr-1 px-1.5 py-0.5 rounded-sm font-medium
              ${trendDirection === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
            `}>
              {trendDirection === 'up' ? '+' : ''}
              {trendPercentage.toFixed(1)}%
              {trendDirection === 'up' 
                ? <TrendingUp className="h-3 w-3 ml-1" /> 
                : <TrendingDown className="h-3 w-3 ml-1" />
              }
            </span>
            <span className="text-muted-foreground">{trendLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetStatsCard;
