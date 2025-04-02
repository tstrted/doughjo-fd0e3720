
import React from "react";
import { ArrowLeft, ArrowRight, Undo2, Redo2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface MonthNavigatorProps {
  activeMonth: number;
  activeYear: number;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onAddCategory: () => void;
}

const MonthNavigator: React.FC<MonthNavigatorProps> = ({
  activeMonth,
  activeYear,
  onPreviousMonth,
  onNextMonth,
  onAddCategory,
}) => {
  // Array of month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={onPreviousMonth}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="text-lg font-semibold">
              {monthNames[activeMonth - 1]} {activeYear}
            </div>
            
            <Button variant="ghost" size="icon" onClick={onNextMonth}>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={onAddCategory}>
              <Plus className="h-4 w-4 mr-1" />
              Category
            </Button>
            
            <Button variant="ghost" size="icon">
              <Undo2 className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="icon">
              <Redo2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthNavigator;
