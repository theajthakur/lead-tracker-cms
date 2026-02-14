"use client"

import { format } from "date-fns"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { LeadWithId } from "@/lib/types/leads"
import { Mail, Phone, Calendar, Hash, Globe } from "lucide-react"

interface LeadDetailDialogProps {
    lead: LeadWithId | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function LeadDetailDialog({
    lead,
    open,
    onOpenChange,
}: LeadDetailDialogProps) {
    if (!lead) return null

    const stageMap = {
        1: { label: "New", color: "bg-primary/10 text-primary" },
        2: { label: "Pending", color: "bg-yellow-500/10 text-yellow-600" },
        3: { label: "Finished", color: "bg-green-500/10 text-green-600" },
    }

    const stage = stageMap[lead.followUpStage as 1 | 2 | 3]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] max-w-xl p-0 overflow-hidden rounded-2xl" showCloseButton={false}>

                {/* Header */}
                <div className="px-8 py-6 border-b bg-gradient-to-b from-muted/40 to-background relative">
                    <DialogClose className="absolute top-1 right-1 opacity-70 hover:opacity-100 transition-opacity" asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <X className="h-4 w-4" />
                        </Button>
                    </DialogClose>
                    <DialogHeader className="space-y-3">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-2xl font-semibold tracking-tight">
                                {lead.name}
                            </DialogTitle>

                            <Badge className={`px-3 py-1 text-xs font-medium ${stage.color}`}>
                                {stage.label}
                            </Badge>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            Created{" "}
                            {lead.createdAt
                                ? format(new Date(lead.createdAt), "PPP")
                                : "Unknown"}
                        </div>
                    </DialogHeader>
                </div>

                {/* Body */}
                <div className="px-8 py-6 space-y-8 max-h-[60vh] overflow-y-auto">

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <InfoCard icon={<Mail />} label="Email" value={lead.email} />
                        <InfoCard icon={<Phone />} label="Mobile" value={lead.mobile} />
                        <InfoCard icon={<Globe />} label="Source" value={lead.source} />
                        <InfoCard icon={<Hash />} label="Lead ID" value={lead.id} mono />

                    </div>

                    <Separator />

                    {/* Description */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            Description
                        </h3>

                        <div className="rounded-xl border bg-muted/30 p-5 text-sm leading-relaxed whitespace-pre-wrap min-h-[120px] break-all">
                            {lead.description || (
                                <span className="italic text-muted-foreground">
                                    No description provided.
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

/* Reusable Info Card */
function InfoCard({
    icon,
    label,
    value,
    mono,
}: {
    icon: React.ReactNode
    label: string
    value?: string | null
    mono?: boolean
}) {
    return (
        <div className="rounded-xl border bg-background p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground mb-2">
                <span className="h-4 w-4">{icon}</span>
                {label}
            </div>

            <div
                className={`text-sm font-medium break-all ${mono ? "font-mono text-xs" : ""
                    }`}
            >
                {value || (
                    <span className="italic text-muted-foreground">
                        Not provided
                    </span>
                )}
            </div>
        </div>
    )
}
