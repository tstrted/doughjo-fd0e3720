
import React from "react";
import { cn } from "@/lib/utils";

interface FinanceCardProps {
  className?: string;
  children: React.ReactNode;
}

const FinanceCard: React.FC<FinanceCardProps> = ({ className, children }) => {
  return (
    <div className={cn("finance-card", className)}>
      {children}
    </div>
  );
};

interface FinanceCardHeaderProps {
  className?: string;
  title: string;
  action?: React.ReactNode;
}

const FinanceCardHeader: React.FC<FinanceCardHeaderProps> = ({
  className,
  title,
  action,
}) => {
  return (
    <div className={cn("finance-card-header flex items-center justify-between", className)}>
      <h3 className="text-lg font-semibold">{title}</h3>
      {action && <div>{action}</div>}
    </div>
  );
};

interface FinanceCardBodyProps {
  className?: string;
  children: React.ReactNode;
}

const FinanceCardBody: React.FC<FinanceCardBodyProps> = ({
  className,
  children,
}) => {
  return (
    <div className={cn("finance-card-body", className)}>
      {children}
    </div>
  );
};

interface FinanceCardFooterProps {
  className?: string;
  children: React.ReactNode;
}

const FinanceCardFooter: React.FC<FinanceCardFooterProps> = ({
  className,
  children,
}) => {
  return (
    <div className={cn("px-4 py-3 border-t border-gray-100", className)}>
      {children}
    </div>
  );
};

export { FinanceCard, FinanceCardHeader, FinanceCardBody, FinanceCardFooter };
