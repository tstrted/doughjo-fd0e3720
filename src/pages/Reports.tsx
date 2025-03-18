
import React, { useState } from "react";
import { useFinance, CategoryData, ReportData } from "@/context/FinanceContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, PieChart } from "lucide-react";

// Import refactored components
import { ReportHeader } from "@/components/reports/ReportHeader";
import { StatsSummary } from "@/components/reports/StatsSummary";
import { BudgetSummaryCard } from "@/components/reports/BudgetSummaryCard";
import { VariancesCard } from "@/components/reports/VariancesCard";
import { BudgetActualComparison } from "@/components/reports/BudgetActualComparison";
import { CategoryDetailsTable } from "@/components/reports/CategoryDetailsTable";

interface CategoryDataWithName extends CategoryData {
  category: string;
}

const ReportsPage = () => {
  const { generateReportData } = useFinance();
  const [activeMonth, setActiveMonth] = useState<number>(new Date().getMonth() + 1);
  const [activeYear, setActiveYear] = useState<number>(new Date().getFullYear());
  const [yearToDate, setYearToDate] = useState(false);
  
  // Generate report data based on current selection
  const reportData: ReportData = generateReportData(activeMonth, activeYear, yearToDate);
  
  // Month and year navigation
  const prevMonth = () => {
    if (activeMonth === 1) {
      setActiveMonth(12);
      setActiveYear(activeYear - 1);
    } else {
      setActiveMonth(activeMonth - 1);
    }
  };
  
  const nextMonth = () => {
    if (activeMonth === 12) {
      setActiveMonth(1);
      setActiveYear(activeYear + 1);
    } else {
      setActiveMonth(activeMonth + 1);
    }
  };
  
  // Sort categories by absolute difference (largest variances first)
  const sortedCategories = Object.entries(reportData.categories)
    .sort(([, a], [, b]) => Math.abs(b.difference) - Math.abs(a.difference));
  
  // Calculate positive and negative variances for chart data
  const positiveVariances = sortedCategories
    .filter(([, data]) => data.difference > 0)
    .slice(0, 5);
  
  const negativeVariances = sortedCategories
    .filter(([, data]) => data.difference < 0)
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Report Header with date selection and options */}
      <ReportHeader 
        activeMonth={activeMonth}
        activeYear={activeYear}
        yearToDate={yearToDate}
        setYearToDate={setYearToDate}
        prevMonth={prevMonth}
        nextMonth={nextMonth}
      />

      {/* Key statistics summary */}
      <StatsSummary reportData={reportData} />

      {/* Budget summary and variances cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        <BudgetSummaryCard reportData={reportData} />
        <VariancesCard 
          positiveVariances={positiveVariances} 
          negativeVariances={negativeVariances} 
        />
      </div>

      {/* Tabs for detailed views */}
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value="summary">
            <BarChart3 className="h-4 w-4 mr-2" /> Summary
          </TabsTrigger>
          <TabsTrigger value="categories">
            <PieChart className="h-4 w-4 mr-2" /> Categories
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="mt-4">
          <BudgetActualComparison reportData={reportData} />
        </TabsContent>
        
        <TabsContent value="categories" className="mt-4">
          <CategoryDetailsTable sortedCategories={sortedCategories} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
