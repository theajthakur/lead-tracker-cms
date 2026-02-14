import { LeadWithId } from "@/lib/types/leads"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
export default function LeadCard({ lead, onClick }: { lead: LeadWithId; onClick: () => void }) {
    return (
        <Card
            className="hover:shadow-md py-0 transition-shadow overflow-hidden cursor-pointer"
            onClick={onClick}
        >
            <CardContent className="p-4 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                    <span className="font-medium line-clamp-1">{lead.name}</span>
                    <Badge variant="outline" className="text-[10px] shrink-0">{lead.source}</Badge>
                </div>
                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <span>{lead.email}</span>
                    <span>{lead.mobile}</span>
                </div>
                {lead.description && (
                    <p className="text-xs text-muted-foreground mt-1 border-t pt-2 truncate">
                        {lead.description}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}