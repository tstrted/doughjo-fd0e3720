
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BudgetCategoryItem from "./BudgetCategoryItem";
import { ChevronDown, ChevronRight } from "lucide-react";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import { cn } from "@/lib/utils";

interface CategoryGroup {
  name: string;
  total: number;
  expanded: boolean;
  categories: {
    id: string;
    name: string;
    budgeted: number;
    spent: number;
    dueDate?: string;
  }[];
}

interface BudgetCategoryListProps {
  categoryGroups: CategoryGroup[];
  onToggleGroup: (groupName: string) => void;
}

const BudgetCategoryList: React.FC<BudgetCategoryListProps> = ({
  categoryGroups,
  onToggleGroup,
}) => {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-0">
        {categoryGroups.map((group) => (
          <div key={group.name} className="border-b last:border-b-0">
            <div 
              className="p-3 flex items-center justify-between bg-gray-50 cursor-pointer hover:bg-gray-100"
              onClick={() => onToggleGroup(group.name)}
            >
              <div className="flex items-center">
                {group.expanded ? (
                  <ChevronDown className="h-4 w-4 mr-2 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-2 text-gray-500" />
                )}
                <span className="font-medium">{group.name}</span>
              </div>
              <div className={cn("font-medium", group.total < 0 ? "text-finance-negative" : "")}>
                <CurrencyDisplay amount={group.total} colorCode={true} />
              </div>
            </div>
            
            {group.expanded && (
              <div className="p-3">
                {group.categories.map((category) => (
                  <BudgetCategoryItem
                    key={category.id}
                    name={category.name}
                    budgeted={category.budgeted}
                    spent={category.spent}
                    dueDate={category.dueDate}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default BudgetCategoryList;
