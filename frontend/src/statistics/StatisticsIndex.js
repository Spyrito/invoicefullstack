import InvoiceStatistics from "./InvoiceStatistics";
import PersonStatistics from "./PersonStatistics";

export default function StatisticsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Statistiky</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InvoiceStatistics />
        <hr />
        <PersonStatistics />
      </div>
    </div>
  );
}
