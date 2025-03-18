
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
  
  // Ensure amount is a number before proceeding
  const numericAmount = typeof amount === 'number' ? amount : 0;
  
  // Determine the class based on the amount and colorCode prop
  const displayClass = colorCode
    ? numericAmount > 0
      ? "text-finance-income"
      : numericAmount < 0
      ? "text-finance-expense"
      : ""
    : "";

  // Format the number
  const formattedValue = formatCurrency(Math.abs(numericAmount));
  
  // Add sign if needed
  const displayValue = showSign && numericAmount !== 0
    ? numericAmount > 0
      ? `+${formattedValue}`
      : `-${formattedValue}`
    : formattedValue;

  return (
    <span className={cn(displayClass, className)}>
      {displayValue}
    </span>
  );
}
