export default interface Lead {
    name: string,
    email: string,
    mobile: string,
    description: string,
    source: Source,
    followUpStage: FollowUpStage,
    createdById: string,
}

export interface UpdateLeadFollowUpStage {
    id: string,
    followUpStage: FollowUpStage,
    createdById: string,
}

export type Source = "OTHER" | "FACEBOOK" | "INSTAGRAM" | "GOOGLE" | "TIKTOK" | "WHATSAPP" | "LINKEDIN" | "TWITTER" | "YOUTUBE" | "OTHER"

export type FollowUpStage = 1 | 2 | 3 