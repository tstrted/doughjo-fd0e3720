
import { cn } from "@/lib/utils";
import { CurrencyDisplay } from "./currency-display";
import { Percent } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  isCurrency?: boolean;
  isPercentage?: boolean;
  icon?: React.ReactNode;
  change?: number;
  changeLabel?: string;
  className?: string;
  trend?: "up" | "down" | "neutral";
}

export function StatCard({
  title,
  value,
  isCurrency = true,
  isPercentage = false,
  icon,
  change,
  changeLabel,
  className,
  trend = "neutral",
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-white shadow-sm p-6 transition-all duration-200 hover:shadow-md",
        className
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-bold tracking-tight">
            {isCurrency ? (
              <CurrencyDisplay amount={value} colorCode={false} />
            ) : isPercentage ? (
              <span className="flex items-center">
                {value.toFixed(1)}
                <Percent className="h-4 w-4 ml-1" />
              </span>
            ) : (
              value.toLocaleString()
            )}
          </h3>
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>

      {typeof change !== "undefined" && (
        <div className="mt-4 flex items-center text-sm">
          <span
            className={cn(
              "mr-1 rounded-md px-1.5 py-0.5 font-medium",
              trend === "up" && "bg-green-100 text-green-800",
              trend === "down" && "bg-red-100 text-red-800",
              trend === "neutral" && "bg-gray-100 text-gray-800"
            )}
          >
            {change > 0 && "+"}
            {change.toFixed(1)}%
          </span>
          <span className="text-muted-foreground">{changeLabel || "from previous period"}</span>
        </div>
      )}
    </div>
  );
}
