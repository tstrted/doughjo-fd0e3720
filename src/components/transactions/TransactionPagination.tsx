
import React from "react";
import { Button } from "@/components/ui/button";

interface TransactionPaginationProps {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export const TransactionPagination: React.FC<TransactionPaginationProps> = ({
  currentPage,
  pageCount,
  onPageChange,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t">
      <div className="text-sm text-muted-foreground">
        Page {currentPage + 1} of {pageCount}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(0)}
          disabled={currentPage === 0}
          className="h-8 w-8 p-0"
        >
          <span className="sr-only">First page</span>
          <div className="flex">«</div>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="h-8 w-8 p-0"
        >
          <span className="sr-only">Previous page</span>
          <div className="flex">‹</div>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === pageCount - 1}
          className="h-8 w-8 p-0"
        >
          <span className="sr-only">Next page</span>
          <div className="flex">›</div>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pageCount - 1)}
          disabled={currentPage === pageCount - 1}
          className="h-8 w-8 p-0"
        >
          <span className="sr-only">Last page</span>
          <div className="flex">»</div>
        </Button>
      </div>
    </div>
  );
};
