
import React from "react";
import {
  CreditCard,
  Banknote,
  ArrowDownRight,
  ArrowUpRight,
  Receipt,
  Building,
  Home,
  Car,
  ShoppingCart,
  DollarSign,
  Fuel,
  ArrowRightLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TransactionType = "payment" | "deposit" | "transfer" | "balance" | string;

interface TransactionTypeIconProps {
  type: TransactionType;
  size?: number;
  className?: string;
}

export const TransactionTypeIcon: React.FC<TransactionTypeIconProps> = ({
  type,
  size = 18,
  className,
}) => {
  const getIconByType = () => {
    // For each type, return appropriate icon and background color
    switch (type) {
      case "deposit":
        return {
          icon: <ArrowDownRight size={size} className="text-white" />,
          bgClass: "bg-green-500",
        };
      case "payment":
        return {
          icon: <ArrowUpRight size={size} className="text-white" />,
          bgClass: "bg-red-500",
        };
      case "transfer":
        return {
          icon: <ArrowRightLeft size={size} className="text-white" />,
          bgClass: "bg-blue-500",
        };
      case "balance":
        return {
          icon: <DollarSign size={size} className="text-white" />,
          bgClass: "bg-purple-500",
        };
      case "car":
        return {
          icon: <Car size={size} className="text-white" />,
          bgClass: "bg-slate-500",
        };
      case "house":
        return {
          icon: <Home size={size} className="text-white" />,
          bgClass: "bg-amber-500",
        };
      case "shopping":
        return {
          icon: <ShoppingCart size={size} className="text-white" />,
          bgClass: "bg-pink-500",
        };
      case "fuel":
        return {
          icon: <Fuel size={size} className="text-white" />,
          bgClass: "bg-orange-500",
        };
      case "bank":
        return {
          icon: <Building size={size} className="text-white" />,
          bgClass: "bg-indigo-500",
        };
      case "receipt":
        return {
          icon: <Receipt size={size} className="text-white" />,
          bgClass: "bg-teal-500",
        };
      default:
        // Default case uses payment or deposit icon based on transaction amount
        if (type.includes("deposit")) {
          return {
            icon: <ArrowDownRight size={size} className="text-white" />,
            bgClass: "bg-green-500",
          };
        } else {
          return {
            icon: <CreditCard size={size} className="text-white" />,
            bgClass: "bg-gray-500",
          };
        }
    }
  };

  const { icon, bgClass } = getIconByType();

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full w-8 h-8",
        bgClass,
        className
      )}
    >
      {icon}
    </div>
  );
};
