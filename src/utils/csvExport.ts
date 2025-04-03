
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
