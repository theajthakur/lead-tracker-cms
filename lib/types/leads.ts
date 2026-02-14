export default interface Lead {
    id?: string,
    name: string,
    email: string,
    mobile: string,
    description: string,
    source: string,
    followUpStage: FollowUpStage,
    label: string | null,
    createdById?: string,
}

export interface UpdateLeadFollowUpStage {
    id: string,
    followUpStage: FollowUpStage,
    createdById?: string,
}


export type FollowUpStage = 1 | 2 | 3 | 4 | 5 | 6

export const LEAD_STAGES = [
    "New",
    "Follow-Up",
    "Meeting",
    "Quote",
    "Won",
    "Lost"
] as const;


export interface LeadWithId extends Lead {
    id: string;
    createdAt: Date;
}

export interface LeadsAnalytics {
    totalLeads: number;
    stage1: number;
    stage2: number;
    stage3: number;
    stage4: number;
    stage5: number;
    stage6: number;
}
