import React from 'react'
import { Badge } from '../ui/badge'
import LeadCard from './Lead'
import { Separator } from '../ui/separator'

export default function Column({ partition, title }: { partition: any, title: string }) {
    return (
        <div className="flex flex-col gap-4 h-full bg-muted/30 p-2">
            <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg pt-2 pl-2">{title}</h2>
                <Badge variant="secondary">{partition.length}</Badge>
            </div>
            <Separator />
            <div className="flex flex-col gap-3 overflow-y-auto pr-2">
                {partition.map((lead: any) => (
                    <LeadCard key={lead.id} lead={lead} />
                ))}
                {partition.length === 0 && (
                    <div className="text-center text-muted-foreground text-sm py-4">No {title.toLocaleLowerCase()} leads</div>
                )}
            </div>
        </div>)
}
