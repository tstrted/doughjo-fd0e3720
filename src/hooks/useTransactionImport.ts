
import { useState, useRef } from "react";
import { Transaction } from "@/types/finance";
import { useToast } from "@/hooks/use-toast";
import {
  parseImportFile,
  mapImportedTransactions,
  ImportColumnMapping
} from "@/utils/csvExport";

export function useTransactionImport(
  accounts: { id: string; name: string }[],
  categories: { id: string; name: string }[],
  addTransaction: (transaction: Omit<Transaction, "id">) => void
) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Import dialog state
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importData, setImportData] = useState<Record<string, string>[]>([]);
  const [importMapping, setImportMapping] = useState<ImportColumnMapping>({
    date: '',
    description: '',
    category: '',
    account: '',
    payment: '',
    deposit: '',
    amount: '',
    memo: '',
  });
  const [importHeaders, setImportHeaders] = useState<string[]>([]);
  const [importPreview, setImportPreview] = useState<Array<any>>([]);

  // Handle file upload
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await parseImportFile(file);
      
      if (data.length === 0) {
        toast({
          title: "Import failed",
          description: "No data found in file",
          variant: "destructive"
        });
        return;
      }
      
      setImportData(data);
      setImportHeaders(Object.keys(data[0]));
      
      // Set default mappings based on common header names
      const defaultMapping: ImportColumnMapping = {
        date: '',
        description: '',
        category: '',
        account: '',
        payment: '',
        deposit: '',
        amount: '',
        memo: '',
      };
      
      // Try to guess mappings from headers
      const headers = Object.keys(data[0]).map(h => h.toLowerCase());
      
      headers.forEach(header => {
        if (/date|trans(action)?date/.test(header)) defaultMapping.date = header;
        if (/desc|description|payee|merchant|transaction|title/.test(header)) defaultMapping.description = header;
        if (/category|cat|type|group/.test(header)) defaultMapping.category = header;
        if (/account|acct|source/.test(header)) defaultMapping.account = header;
        if (/payment|expense|debit|paid|withdrawal|withdraw/.test(header)) defaultMapping.payment = header;
        if (/deposit|income|credit|received|deposit/.test(header)) defaultMapping.deposit = header;
        if (/amount|sum|total|value/.test(header)) defaultMapping.amount = header;
        if (/memo|note|notes|comment|description2/.test(header)) defaultMapping.memo = header;
      });
      
      setImportMapping(defaultMapping);
      
      // Generate preview
      if (defaultMapping.date && defaultMapping.description) {
        try {
          const preview = mapImportedTransactions(data.slice(0, 5), defaultMapping);
          setImportPreview(preview);
        } catch (e) {
          console.error("Preview generation error:", e);
        }
      }
      
      setIsImportOpen(true);
      
      // Reset the input so the same file can be selected again
      e.target.value = '';
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      
      // Reset the input so the same file can be selected again
      e.target.value = '';
    }
  };
  
  // Update mapping and regenerate preview
  const handleMappingChange = (field: keyof ImportColumnMapping, value: string) => {
    const newMapping = { ...importMapping, [field]: value };
    setImportMapping(newMapping);
    
    // Update preview if we have the minimum required fields
    if (newMapping.date && newMapping.description) {
      try {
        const preview = mapImportedTransactions(importData.slice(0, 5), newMapping);
        setImportPreview(preview);
      } catch (e) {
        console.error("Preview generation error:", e);
      }
    }
  };
  
  // Process the imported data
  const handleImportConfirm = () => {
    try {
      // Map the data
      const mappedData = mapImportedTransactions(importData, importMapping);
      
      // Check if data needs category/account matching
      const needsCategoryMapping = mappedData.some(item => 
        item.category && !categories.some(c => c.id === item.category || c.name === item.category)
      );
      
      const needsAccountMapping = mappedData.some(item => 
        item.account && !accounts.some(a => a.id === item.account || a.name === item.account)
      );
      
      if (needsCategoryMapping) {
        toast({
          title: "Warning",
          description: "Some categories don't match existing ones. They will be imported as-is.",
        });
      }
      
      if (needsAccountMapping) {
        toast({
          title: "Warning",
          description: "Some accounts don't match existing ones. Please select an account to use for all transactions.",
        });
      }
      
      // Add transactions
      let successCount = 0;
      let errorCount = 0;
      
      mappedData.forEach(transaction => {
        try {
          // Find category by name if it's not an ID
          let categoryId = transaction.category;
          if (categoryId && !categories.some(c => c.id === categoryId)) {
            const matchingCategory = categories.find(c => c.name === categoryId);
            if (matchingCategory) {
              categoryId = matchingCategory.id;
            }
          }
          
          // Find account by name if it's not an ID
          let accountId = transaction.account;
          if (accountId && !accounts.some(a => a.id === accountId)) {
            const matchingAccount = accounts.find(a => a.name === accountId);
            if (matchingAccount) {
              accountId = matchingAccount.id;
            }
          }
          
          // If no account found, use the first account
          if (!accountId && accounts.length > 0) {
            accountId = accounts[0].id;
          }
          
          addTransaction({
            date: transaction.date,
            description: transaction.description,
            category: categoryId || (categories.length > 0 ? categories[0].id : ''),
            account: accountId || '',
            payment: transaction.payment,
            deposit: transaction.deposit,
            memo: transaction.memo,
            type: transaction.type,
            cleared: false,
          });
          
          successCount++;
        } catch (e) {
          console.error("Error adding transaction:", e);
          errorCount++;
        }
      });
      
      setIsImportOpen(false);
      
      toast({
        title: "Import completed",
        description: `${successCount} transactions imported successfully. ${errorCount} failed.`,
        variant: errorCount > 0 ? "destructive" : "default"
      });
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  return {
    fileInputRef,
    isImportOpen,
    setIsImportOpen,
    importData,
    importHeaders,
    importMapping,
    importPreview,
    handleFileUpload,
    handleFileChange,
    handleMappingChange,
    handleImportConfirm
  };
}
