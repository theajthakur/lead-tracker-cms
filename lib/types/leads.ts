export default interface Lead {
    id?: string,
    name: string,
    email: string,
    mobile: string,
    description: string,
    source: string,
    followUpStage: FollowUpStage,
    createdById?: string,
}

export interface UpdateLeadFollowUpStage {
    id: string,
    followUpStage: FollowUpStage,
    createdById?: string,
}


export type FollowUpStage = 1 | 2 | 3

export interface LeadWithId extends Lead {
    id: string;
    createdAt: Date;
}