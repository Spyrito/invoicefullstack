import { useEffect, useState } from "react";
import { apiGet } from "../utils/api";

const InvoiceStatistics = () => {
    const [invoiceStats, setInvoiceStats] = useState(null);
  
    useEffect(() => {
      apiGet("/api/invoices/statistics").then((data) => setInvoiceStats(data));
    }, []);
  
    if (!invoiceStats) return <p>Načítání statistik faktur...</p>;
  
    return (
      <div className="p-4 border rounded shadow bg-dark text-light">
        <h2 className="text-xl font-semibold mb-2">Obecné statistiky faktur</h2>
        <p><strong>Součet za letošní rok:</strong> {invoiceStats.currentYearSum} Kč</p>
        <p><strong>Celkový součet:</strong> {invoiceStats.allTimeSum} Kč</p>
        <p><strong>Počet faktur:</strong> {invoiceStats.invoicesCount}</p>
      </div>
    );
  };
export default InvoiceStatistics;