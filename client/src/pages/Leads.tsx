import { LeadTable } from "@/components/leads/LeadTable";

export default function Leads() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Lead Management
        </h1>
      </div>
      
      <LeadTable />
    </div>
  );
}
