import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import LeadCard from './Lead';
import { LeadWithId } from '@/lib/types/leads';

interface SortableLeadProps {
    lead: LeadWithId;
    onClick: () => void;
}

export default function SortableLead({ lead, onClick }: SortableLeadProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: lead.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <LeadCard lead={lead} onClick={onClick} />
        </div>
    );
}
