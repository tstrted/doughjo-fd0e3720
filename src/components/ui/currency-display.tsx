
import { useFinance } from "@/context/FinanceContext";
import { cn } from "@/lib/utils";

interface CurrencyDisplayProps {
  amount: number;
  showSign?: boolean;
  colorCode?: boolean;
  className?: string;
}

export function CurrencyDisplay({
  amount,
  showSign = false,
  colorCode = false,
  className,
}: CurrencyDisplayProps) {
  const { formatCurrency } = useFinance();
  
  // Determine the class based on the amount and colorCode prop
  const displayClass = colorCode
    ? amount > 0
      ? "text-finance-income"
      : amount < 0
      ? "text-finance-expense"
      : ""
    : "";

  // Format the number
  const formattedValue = formatCurrency(Math.abs(amount));
  
  // Add sign if needed
  const displayValue = showSign && amount !== 0
    ? amount > 0
      ? `+${formattedValue}`
      : `-${formattedValue}`
    : formattedValue;

  return (
    <span className={cn(displayClass, className)}>
      {displayValue}
    </span>
  );
}
