"use client"

import { format } from "date-fns"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { LeadWithId } from "@/lib/types/leads"
import { Mail, Phone, Calendar, Hash, Globe } from "lucide-react"

interface LeadDetailDialogProps {
    lead: LeadWithId | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function LeadDetailDialog({ lead, open, onOpenChange }: LeadDetailDialogProps) {
    if (!lead) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden gap-0">
                <div className="px-6 pt-6 pb-4 bg-muted/30 border-b">
                    <DialogHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex flex-col gap-1">
                                <DialogTitle className="text-2xl font-bold">{lead.name}</DialogTitle>
                                <DialogDescription className="flex items-center gap-2">
                                    <Calendar className="h-3.5 w-3.5" />
                                    Created on {lead.createdAt ? format(new Date(lead.createdAt), "PPP") : "Unknown date"}
                                </DialogDescription>
                            </div>
                            <Badge
                                variant={lead.followUpStage === 3 ? "default" : lead.followUpStage === 2 ? "secondary" : "outline"}
                                className="px-3 py-1 text-sm capitalize"
                            >
                                {lead.followUpStage === 1 && "New"}
                                {lead.followUpStage === 2 && "Pending"}
                                {lead.followUpStage === 3 && "Finished"}
                            </Badge>
                        </div>
                    </DialogHeader>
                </div>

                <div className="p-6 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Mail className="h-4 w-4" /> Email
                            </span>
                            <span className="text-base font-medium truncate" title={lead.email}>{lead.email}</span>
                        </div>

                        <div className="flex flex-col gap-1.5 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Phone className="h-4 w-4" /> Mobile
                            </span>
                            <span className="text-base font-medium">{lead.mobile}</span>
                        </div>

                        <div className="flex flex-col gap-1.5 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Globe className="h-4 w-4" /> Source
                            </span>
                            <div className="flex">
                                <Badge variant="outline" className="font-normal">
                                    {lead.source}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Hash className="h-4 w-4" /> Lead ID
                            </span>
                            <span className="text-xs font-mono text-muted-foreground truncate" title={lead.id}>
                                {lead.id}
                            </span>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex flex-col gap-3">
                        <span className="text-sm font-medium text-muted-foreground">Description</span>
                        <div className="bg-muted/30 p-4 rounded-lg border text-sm leading-relaxed whitespace-pre-wrap min-h-[100px]">
                            {lead.description || <span className="text-muted-foreground italic">No description provided.</span>}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
