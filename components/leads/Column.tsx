import React from 'react'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableLead from './SortableLead';

import { LeadWithId } from "@/lib/types/leads";

export default function Column({
    partition,
    title,
    onLeadClick,
    id,
}: {
    partition: LeadWithId[];
    title: string;
    onLeadClick: (lead: LeadWithId) => void;
    id: string;
}) {
    const { setNodeRef } = useDroppable({
        id: id,
    });
    return (
        <div ref={setNodeRef} className="flex flex-col gap-4 h-auto md:h-full bg-muted/30 p-2 rounded-lg">
            <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg pt-2 pl-2">{title}</h2>
                <Badge variant="secondary">{partition.length}</Badge>
            </div>
            <Separator />
            <div className="flex flex-col gap-3 overflow-y-auto pr-2 pb-4 flex-1">
                <SortableContext items={partition.map(l => l.id)} strategy={verticalListSortingStrategy}>
                    {partition.map((lead) => (
                        <SortableLead key={lead.id} lead={lead} onClick={() => onLeadClick(lead)} />
                    ))}
                </SortableContext>
                {partition.length === 0 && (
                    <div className="text-center text-muted-foreground text-sm py-4">No {title.toLocaleLowerCase()} leads</div>
                )}
            </div>
        </div>)
}
