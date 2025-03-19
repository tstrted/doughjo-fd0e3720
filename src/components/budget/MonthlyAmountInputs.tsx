
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface MonthlyAmountInputsProps {
  months: string[];
  amounts: Record<string, number | string>;
  onChange: (month: string, value: string) => void;
}

const MonthlyAmountInputs: React.FC<MonthlyAmountInputsProps> = ({
  months,
  amounts,
  onChange,
}) => {
  return (
    <div className="grid gap-4">
      <Label>Monthly Amounts</Label>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {months.map((month) => (
          <div key={month} className="flex items-center space-x-2">
            <Label htmlFor={`month-${month}`} className="w-10 flex-shrink-0">
              {month.charAt(0).toUpperCase() + month.slice(1)}
            </Label>
            <Input
              id={`month-${month}`}
              type="number"
              placeholder="0.00"
              value={amounts[month] || ""}
              onChange={(e) => onChange(month, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyAmountInputs;
