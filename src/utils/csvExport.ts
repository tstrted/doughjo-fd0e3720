
import { formatCurrency } from "./financeCalculations";

/**
 * Interface for defining column configuration for CSV export
 */
export interface CsvColumn {
  header: string;
  accessor: (item: any) => string | number;
}

/**
 * Exports data to a CSV file
 * @param data Array of data objects to export
 * @param columns Configuration for CSV columns
 * @param fileName Name of the file to download (without extension)
 * @returns void
 */
export function exportToCsv<T>(
  data: T[],
  columns: CsvColumn[],
  fileName: string
): void {
  if (data.length === 0) {
    throw new Error("No data to export");
  }

  // Create CSV header row
  const header = columns.map(column => column.header);
  
  // Create CSV data rows
  const rows = data.map(item => 
    columns.map(column => {
      const value = column.accessor(item);
      // Wrap strings with commas in quotes
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value}"`;
      }
      return value;
    })
  );
  
  // Combine header and rows
  const csvContent = [header, ...rows].map(row => row.join(",")).join("\n");
  
  // Create and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Format a date for display or export
 * @param dateString ISO date string
 * @param format Format to use - 'display' for MM/dd/yy or 'export' for yyyy-MM-dd
 * @returns Formatted date string
 */
export function formatDateForExport(dateString: string, format: 'display' | 'export' = 'export'): string {
  const date = new Date(dateString);
  
  if (format === 'display') {
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear().toString().substring(2)}`;
  }
  
  return date.toISOString().split('T')[0]; // yyyy-MM-dd format
}

/**
 * Represents the expected column mapping for importing transactions
 */
export interface ImportColumnMapping {
  date: string;
  description: string;
  category?: string;
  account?: string;
  payment?: string;
  deposit?: string;
  amount?: string; // Alternative to payment/deposit
  memo?: string;
  type?: string;
}

/**
 * Parse CSV string content into an array of objects
 * @param content CSV content as string
 * @returns Array of objects with headers as keys
 */
export function parseCsvContent(content: string): Record<string, string>[] {
  try {
    // Split content into lines
    const lines = content.split(/\r\n|\n/);
    if (lines.length < 2) throw new Error("CSV file must contain headers and at least one data row");
    
    // Parse headers
    const headers = parseCSVLine(lines[0]);
    
    // Parse data rows
    const result: Record<string, string>[] = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue; // Skip empty lines
      
      const values = parseCSVLine(lines[i]);
      if (values.length !== headers.length) {
        console.warn(`Line ${i + 1} has ${values.length} columns, expected ${headers.length}. Skipping.`);
        continue;
      }
      
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      
      result.push(row);
    }
    
    return result;
  } catch (error) {
    console.error("Error parsing CSV content:", error);
    throw new Error("Failed to parse CSV content. Please check the file format.");
  }
}

/**
 * Parse a CSV line, handling quoted values with commas
 */
function parseCSVLine(line: string): string[] {
  try {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    // Add the last field
    result.push(current);
    
    return result;
  } catch (error) {
    console.error("Error parsing CSV line:", error);
    throw new Error("Failed to parse CSV line. Please check the file format.");
  }
}

/**
 * Parse Excel/CSV file content
 * @param file The file object to parse
 * @returns Promise that resolves to array of row objects
 */
export function parseImportFile(file: File): Promise<Record<string, string>[]> {
  return new Promise((resolve, reject) => {
    try {
      // Basic validation
      if (!file) {
        reject(new Error("No file selected"));
        return;
      }
      
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension !== 'csv' && fileExtension !== 'xlsx' && fileExtension !== 'xls') {
        reject(new Error("Please select a CSV or Excel file"));
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          if (!e.target || !e.target.result) {
            reject(new Error("Error reading file - no content found"));
            return;
          }
          
          const content = e.target.result as string;
          
          if (fileExtension === 'csv') {
            // Parse CSV directly
            const data = parseCsvContent(content);
            resolve(data);
          } else {
            // For Excel files, we need to inform the user we can only process CSV
            reject(new Error("Excel import is not supported. Please export as CSV and try again."));
          }
        } catch (error) {
          console.error("File parsing error:", error);
          reject(error);
        }
      };
      
      reader.onerror = (event) => {
        console.error("FileReader error:", event);
        reject(new Error("Error reading file"));
      };
      
      if (fileExtension === 'csv') {
        reader.readAsText(file);
      } else {
        reject(new Error("Excel import is not supported. Please export as CSV and try again."));
      }
    } catch (error) {
      console.error("Error in parseImportFile:", error);
      reject(error);
    }
  });
}

/**
 * Maps CSV data to transaction objects using the provided column mapping
 * @param data Parsed CSV data rows
 * @param mapping Column mapping configuration
 * @returns Array of mapped transaction objects
 */
export function mapImportedTransactions(
  data: Record<string, string>[],
  mapping: ImportColumnMapping
): Array<{
  date: string;
  description: string;
  category: string;
  account: string;
  payment?: number;
  deposit?: number;
  memo?: string;
  type?: string;
}> {
  return data.map(row => {
    // Handle date format - assume MM/DD/YYYY or YYYY-MM-DD
    let formattedDate = row[mapping.date];
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(formattedDate)) {
      // Convert MM/DD/YYYY to YYYY-MM-DD
      const [month, day, year] = formattedDate.split('/');
      formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } else if (/^\d{1,2}\/\d{1,2}\/\d{2}$/.test(formattedDate)) {
      // Convert MM/DD/YY to YYYY-MM-DD
      const [month, day, shortYear] = formattedDate.split('/');
      const year = parseInt(shortYear) > 50 ? `19${shortYear}` : `20${shortYear}`;
      formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    // Determine if payment or deposit
    let payment: number | undefined;
    let deposit: number | undefined;
    let type = row[mapping.type || ''] || undefined;
    
    if (mapping.payment && mapping.deposit) {
      // Separate columns for payment and deposit
      if (row[mapping.payment] && row[mapping.payment] !== '0') {
        payment = parseFloat(row[mapping.payment]);
        type = type || 'payment';
      }
      
      if (row[mapping.deposit] && row[mapping.deposit] !== '0') {
        deposit = parseFloat(row[mapping.deposit]);
        type = type || 'deposit';
      }
    } else if (mapping.amount) {
      // Single amount column - negative is payment, positive is deposit
      const amount = parseFloat(row[mapping.amount]);
      if (!isNaN(amount)) {
        if (amount < 0) {
          payment = Math.abs(amount);
          type = type || 'payment';
        } else {
          deposit = amount;
          type = type || 'deposit';
        }
      }
    }
    
    return {
      date: formattedDate,
      description: row[mapping.description],
      category: row[mapping.category || ''] || '',
      account: row[mapping.account || ''] || '',
      payment,
      deposit,
      memo: row[mapping.memo || ''] || undefined,
      type
    };
  });
}
