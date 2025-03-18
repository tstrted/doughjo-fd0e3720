
import React from "react";
import { StatCard } from "@/components/ui/stat-card";
import { ArrowDownRight, ArrowUpRight, TrendingUp } from "lucide-react";
import { ReportData } from "@/context/FinanceContext";

interface StatsSummaryProps {
  reportData: ReportData;
}

export function StatsSummary({ reportData }: StatsSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="Budget Income"
        value={reportData.budgetSummary.income}
        icon={<ArrowDownRight className="h-8 w-8 text-finance-income" />}
        trend={reportData.difference.income > 0 ? "up" : "down"}
        change={reportData.budgetSummary.income !== 0 
          ? (Math.abs(reportData.difference.income) / reportData.budgetSummary.income) * 100 
          : 0}
        changeLabel={reportData.difference.income > 0 ? "above budget" : "below budget"}
      />
      <StatCard
        title="Budget Expenses"
        value={reportData.budgetSummary.expenses}
        icon={<ArrowUpRight className="h-8 w-8 text-finance-expense" />}
        trend={reportData.difference.expenses < 0 ? "up" : "down"}
        change={reportData.budgetSummary.expenses !== 0 
          ? (Math.abs(reportData.difference.expenses) / reportData.budgetSummary.expenses) * 100 
          : 0}
        changeLabel={reportData.difference.expenses < 0 ? "under budget" : "over budget"}
      />
      <StatCard
        title="Net Difference"
        value={reportData.difference.net}
        icon={<TrendingUp className="h-8 w-8 text-finance-neutral" />}
        trend={reportData.difference.net > 0 ? "up" : "down"}
        change={reportData.budgetSummary.net !== 0 
          ? (Math.abs(reportData.difference.net) / Math.abs(reportData.budgetSummary.net)) * 100 
          : 0}
        changeLabel="vs. budget"
      />
    </div>
  );
}
