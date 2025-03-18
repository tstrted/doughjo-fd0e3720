
import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { format } from "date-fns";

interface ReportHeaderProps {
  activeMonth: number;
  activeYear: number;
  yearToDate: boolean;
  setYearToDate: (value: boolean) => void;
  prevMonth: () => void;
  nextMonth: () => void;
}

export function ReportHeader({
  activeMonth,
  activeYear,
  yearToDate,
  setYearToDate,
  prevMonth,
  nextMonth,
}: ReportHeaderProps) {
  // Format month for display
  const formatMonth = (month: number, year: number) => {
    const date = new Date(year, month - 1, 1);
    return format(date, "MMMM yyyy");
  };

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Switch 
            id="ytd" 
            checked={yearToDate} 
            onCheckedChange={setYearToDate} 
          />
          <Label htmlFor="ytd">Year to Date</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[150px] text-center font-medium">
            {formatMonth(activeMonth, activeYear)}
          </span>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
      </div>
    </div>
  );
}
