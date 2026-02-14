import { LeadWithId } from "@/lib/types/leads"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { Mail, Phone } from "lucide-react"

export default function LeadCard({ lead, onClick }: { lead: LeadWithId; onClick: () => void }) {
    return (
        <Card
            className="hover:shadow-md py-0 transition-shadow overflow-hidden cursor-pointer group"
            onClick={onClick}
        >
            <CardContent className="p-3 flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-sm truncate" title={lead.name}>{lead.name}</span>
                        {lead.source && (
                            <Badge variant="secondary" className="text-[10px] px-1 py-0 h-5 shrink-0">
                                {lead.source.slice(0, 1) + lead.source.slice(1).toLowerCase()}
                            </Badge>
                        )}
                    </div>
                    {lead.email && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground" title={lead.email}>
                            <Mail className="h-3 w-3 shrink-0" />
                            <span className="truncate">{lead.email}</span>
                        </div>
                    )}
                    {lead.mobile && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground" title={lead.mobile}>
                            <Phone className="h-3 w-3 shrink-0" />
                            <span className="truncate">{lead.mobile}</span>
                        </div>
                    )}
                </div>

                {lead.description && (
                    <div className="border-t pt-2 mt-1">
                        <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed">
                            {lead.description}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}