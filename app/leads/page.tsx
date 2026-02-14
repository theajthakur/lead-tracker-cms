import { getAllLeads } from "@/lib/api/leads";
import { CreateLeadDialog } from "@/components/leads/CreateLeadDialog";
import { LeadWithId } from "@/lib/types/leads";
import Column from "@/components/leads/Column";


export default async function LeadsPage() {
    const result = await getAllLeads();
    const leads = (result.status === "success" && result.data ? result.data : []) as LeadWithId[];

    // Define stages mapping
    const partitions = {
        NEW: leads.filter((l) => l.followUpStage === 1),
        PENDING: leads.filter((l) => l.followUpStage === 2),
        FINISHED: leads.filter((l) => l.followUpStage === 3),
    };

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-100px)]">
            <div className="flex items-center justify-between shrink-0">
                <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
                <CreateLeadDialog />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 h-full md:divide-x md:divide-border">
                {
                    ["NEW", "PENDING", "FINISHED"].map((stage, i) => (
                        <Column partition={partitions[stage as keyof typeof partitions]} title={stage} key={i} />
                    ))
                }
            </div>
        </div>
    );
}


