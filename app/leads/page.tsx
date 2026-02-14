import { getAllLeads } from "@/lib/api/leads";
import { CreateLeadDialog } from "@/components/leads/CreateLeadDialog";
import Lead, { LeadWithId } from "@/lib/types/leads";
import LeadsView from "@/components/leads/LeadsView";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function LeadsPage() {
    const session = await getServerSession(authOptions);
    let labels = ["NEW", "PENDING", "FINISHED"];

    if (session?.user?.id) {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { labels: true }
        });
        if (user?.labels && user.labels.length === 3) {
            labels = user.labels;
        }
    }

    const result = await getAllLeads();
    const leads = (result.status === "success" && result.data ? result.data : []) as LeadWithId[];

    // Define stages mapping using dynamic labels
    const partitions = {
        [labels[0]]: leads.filter((l) => l.followUpStage === 1),
        [labels[1]]: leads.filter((l) => l.followUpStage === 2),
        [labels[2]]: leads.filter((l) => l.followUpStage === 3),
    };

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-100px)]">
            <div className="flex items-center justify-between shrink-0">
                <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
                <CreateLeadDialog />
            </div>

            <LeadsView partitions={partitions} labels={labels} />
        </div>
    );
}


