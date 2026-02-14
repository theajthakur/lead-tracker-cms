import { getLeadsByUserId } from "@/lib/api/leads";
import LeadsView from "@/components/leads/LeadsView";
import { LEAD_STAGES, LeadWithId } from "@/lib/types/leads";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{
        userId: string
    }>
}

export default async function SalesmanLeadsPage({ params }: PageProps) {
    const { userId } = await params;

    const { data: leads, error } = await getLeadsByUserId(userId);

    if (error || !leads) {
        if (error === "User not found") return notFound(); // Or handle gracefully
        // If just fetch error, maybe show empty or error message
        // For now, let's assume if fails, we show empty or basic error
    }

    const safeLeads = leads || [];

    // Partition leads by stage
    const partitions: Record<string, LeadWithId[]> = {};
    LEAD_STAGES.forEach(stage => {
        partitions[stage] = [];
    });

    safeLeads.forEach((lead) => {
        // Lead stages are 1-indexed in DB but mapped to LEAD_STAGES array which is 0-indexed
        // 1 -> New -> LEAD_STAGES[0]
        const stageIndex = (lead.followUpStage as number) - 1;
        if (stageIndex >= 0 && stageIndex < LEAD_STAGES.length) {
            partitions[LEAD_STAGES[stageIndex]].push(lead as LeadWithId);
        }
    });

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            <div className="flex items-center justify-between pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
                    <p className="text-muted-foreground">Viewing user's leads (Read-only)</p>
                </div>
            </div>
            <div className="flex-1 overflow-hidden">
                <LeadsView partitions={partitions} labels={LEAD_STAGES} readOnly={true} />
            </div>
        </div>
    );
}
