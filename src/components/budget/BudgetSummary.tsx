
import React from "react";
import { StatCard } from "@/components/ui/stat-card";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { BudgetSummary as BudgetSummaryType } from "@/types/finance";

interface BudgetSummaryProps {
  summary: BudgetSummaryType;
}

const BudgetSummary: React.FC<BudgetSummaryProps> = ({ summary }) => {
  const { income, expenses, net } = summary;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="Monthly Income"
        value={income}
        icon={<Wallet className="h-8 w-8 text-finance-income" />}
        trend="up"
        change={5.2}
      />
      <StatCard
        title="Monthly Expenses"
        value={expenses}
        icon={<TrendingDown className="h-8 w-8 text-finance-expense" />}
        trend="down"
        change={2.1}
      />
      <StatCard
        title="Net Balance"
        value={net}
        icon={<TrendingUp className="h-8 w-8 text-finance-neutral" />}
        trend={net > 0 ? "up" : "down"}
        change={Math.abs(net / expenses) * 10}
        changeLabel="of expenses"
      />
    </div>
  );
};

export default BudgetSummary;
