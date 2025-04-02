
import React from "react";
import { Progress } from "@/components/ui/progress";
import { CalendarClock } from "lucide-react";
import { CurrencyDisplay } from "@/components/ui/currency-display";

interface BudgetCategoryItemProps {
  name: string;
  budgeted: number;
  spent: number;
  dueDate?: string;
}

const BudgetCategoryItem: React.FC<BudgetCategoryItemProps> = ({
  name,
  budgeted,
  spent,
  dueDate,
}) => {
  // Calculate the percentage spent
  const percentSpent = budgeted > 0 ? (spent / budgeted) * 100 : 0;
  const isOverBudget = spent > budgeted;
  const remaining = budgeted - spent;

  // Determine progress bar color based on spending
  const progressBarColor = isOverBudget 
    ? "bg-finance-negative" 
    : "bg-finance-positive";

  return (
    <div className="py-2 border-b last:border-b-0">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          <span className="text-sm font-medium">{name}</span>
          {dueDate && (
            <div className="ml-2 flex items-center text-gray-500 text-xs">
              <CalendarClock className="h-3 w-3 mr-1" />
              Due on the {dueDate}
            </div>
          )}
        </div>
        <div className="text-right">
          <div className={`text-sm font-medium ${isOverBudget ? 'text-finance-negative' : ''}`}>
            <CurrencyDisplay amount={remaining} colorCode={true} />
          </div>
          <div className="text-xs text-gray-500">
            <CurrencyDisplay amount={budgeted} />
          </div>
        </div>
      </div>
      
      <Progress 
        value={Math.min(percentSpent, 100)} 
        className="h-2 bg-gray-200"
        indicatorClassName={progressBarColor}
      />
    </div>
  );
};

export default BudgetCategoryItem;
