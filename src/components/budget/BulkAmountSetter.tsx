
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface BulkAmountSetterProps {
  months: string[];
  selectedMonths: Record<string, boolean>;
  bulkAmount: string;
  setBulkAmount: (value: string) => void;
  toggleMonth: (month: string) => void;
  selectAllMonths: () => void;
  clearMonthSelections: () => void;
  applyBulkAmount: () => void;
  formatCurrency: (amount: number) => string;
}

const BulkAmountSetter: React.FC<BulkAmountSetterProps> = ({
  months,
  selectedMonths,
  bulkAmount,
  setBulkAmount,
  toggleMonth,
  selectAllMonths,
  clearMonthSelections,
  applyBulkAmount,
  formatCurrency,
}) => {
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <Label>Bulk Amount Setting</Label>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={selectAllMonths}>
            Select All
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={clearMonthSelections}>
            Clear
          </Button>
        </div>
      </div>
      <div className="flex space-x-2">
        <Input
          type="number"
          placeholder="0.00"
          value={bulkAmount}
          onChange={(e) => setBulkAmount(e.target.value)}
        />
        <Button type="button" onClick={applyBulkAmount}>
          Apply
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {months.map((month) => (
          <div key={month} className="flex items-center space-x-2">
            <Checkbox
              id={`select-${month}`}
              checked={selectedMonths[month] || false}
              onCheckedChange={() => toggleMonth(month)}
            />
            <Label
              htmlFor={`select-${month}`}
              className="text-sm cursor-pointer"
            >
              {month.charAt(0).toUpperCase() + month.slice(1)}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BulkAmountSetter;
