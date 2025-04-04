
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImportColumnMapping } from "@/utils/csvExport";
import { useToast } from "@/hooks/use-toast";

interface TransactionImportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  importData: Record<string, string>[];
  importHeaders: string[];
  importMapping: ImportColumnMapping;
  importPreview: Array<any>;
  onMappingChange: (field: keyof ImportColumnMapping, value: string) => void;
  onImportConfirm: () => void;
}

export const TransactionImportDialog: React.FC<TransactionImportDialogProps> = ({
  isOpen,
  onOpenChange,
  importData,
  importHeaders,
  importMapping,
  importPreview,
  onMappingChange,
  onImportConfirm,
}) => {
  const { toast } = useToast();

  const handleImportConfirm = () => {
    try {
      // Validate minimum required mapping
      if (!importMapping.date || !importMapping.description) {
        toast({
          title: "Import failed",
          description: "Date and Description mappings are required",
          variant: "destructive"
        });
        return;
      }
      
      onImportConfirm();
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Import Transactions</DialogTitle>
          <DialogDescription>
            Map columns from your file to transaction fields
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="date-mapping" className="text-right">
              Date <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={importMapping.date} 
              onValueChange={(value) => onMappingChange('date', value)}
            >
              <SelectTrigger id="date-mapping">
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">-- Select --</SelectItem>
                {importHeaders.map(header => (
                  <SelectItem key={header} value={header}>{header}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description-mapping" className="text-right">
              Description <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={importMapping.description} 
              onValueChange={(value) => onMappingChange('description', value)}
            >
              <SelectTrigger id="description-mapping">
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">-- Select --</SelectItem>
                {importHeaders.map(header => (
                  <SelectItem key={header} value={header}>{header}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category-mapping" className="text-right">
              Category
            </Label>
            <Select 
              value={importMapping.category || ''} 
              onValueChange={(value) => onMappingChange('category', value)}
            >
              <SelectTrigger id="category-mapping">
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">-- None --</SelectItem>
                {importHeaders.map(header => (
                  <SelectItem key={header} value={header}>{header}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="account-mapping" className="text-right">
              Account
            </Label>
            <Select 
              value={importMapping.account || ''} 
              onValueChange={(value) => onMappingChange('account', value)}
            >
              <SelectTrigger id="account-mapping">
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">-- None --</SelectItem>
                {importHeaders.map(header => (
                  <SelectItem key={header} value={header}>{header}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount-mapping" className="text-right">
              Amount (single column)
            </Label>
            <Select 
              value={importMapping.amount || ''} 
              onValueChange={(value) => onMappingChange('amount', value)}
            >
              <SelectTrigger id="amount-mapping">
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">-- None --</SelectItem>
                {importHeaders.map(header => (
                  <SelectItem key={header} value={header}>{header}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="col-span-2 flex justify-center items-center">
            <span className="text-sm text-gray-500">- OR -</span>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="payment-mapping" className="text-right">
              Payment (expenses)
            </Label>
            <Select 
              value={importMapping.payment || ''} 
              onValueChange={(value) => onMappingChange('payment', value)}
            >
              <SelectTrigger id="payment-mapping">
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">-- None --</SelectItem>
                {importHeaders.map(header => (
                  <SelectItem key={header} value={header}>{header}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deposit-mapping" className="text-right">
              Deposit (income)
            </Label>
            <Select 
              value={importMapping.deposit || ''} 
              onValueChange={(value) => onMappingChange('deposit', value)}
            >
              <SelectTrigger id="deposit-mapping">
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">-- None --</SelectItem>
                {importHeaders.map(header => (
                  <SelectItem key={header} value={header}>{header}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="memo-mapping" className="text-right">
              Memo
            </Label>
            <Select 
              value={importMapping.memo || ''} 
              onValueChange={(value) => onMappingChange('memo', value)}
            >
              <SelectTrigger id="memo-mapping">
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">-- None --</SelectItem>
                {importHeaders.map(header => (
                  <SelectItem key={header} value={header}>{header}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {importPreview.length > 0 && (
          <div className="border rounded-md p-3 my-4 max-h-48 overflow-auto">
            <h3 className="font-medium mb-2">Preview (first {importPreview.length} records)</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-1">Date</th>
                  <th className="text-left p-1">Description</th>
                  <th className="text-right p-1">Amount</th>
                </tr>
              </thead>
              <tbody>
                {importPreview.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="p-1">{item.date}</td>
                    <td className="p-1">{item.description}</td>
                    <td className="text-right p-1">
                      {item.payment ? `-${item.payment}` : ''}
                      {item.deposit ? `+${item.deposit}` : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleImportConfirm}>
            Import Transactions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
