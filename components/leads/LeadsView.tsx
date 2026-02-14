"use client";

import React, { useState } from "react";
import Column from "./Column";
import LeadDetailDialog from "./LeadDetailDialog";
import { LeadWithId } from "@/lib/types/leads";

interface LeadsViewProps {
    partitions: {
        NEW: LeadWithId[];
        PENDING: LeadWithId[];
        FINISHED: LeadWithId[];
    };
}

export default function LeadsView({ partitions }: LeadsViewProps) {
    const [selectedLead, setSelectedLead] = useState<LeadWithId | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleLeadClick = (lead: LeadWithId) => {
        setSelectedLead(lead);
        setIsDialogOpen(true);
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 h-full md:divide-x md:divide-border">
                {["NEW", "PENDING", "FINISHED"].map((stage, i) => (
                    <Column
                        key={i}
                        title={stage}
                        partition={partitions[stage as keyof typeof partitions]}
                        onLeadClick={handleLeadClick}
                    />
                ))}
            </div>
            <LeadDetailDialog
                lead={selectedLead}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />
        </>
    );
}
