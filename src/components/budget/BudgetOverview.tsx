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
  return;
};
export default BudgetOverview;