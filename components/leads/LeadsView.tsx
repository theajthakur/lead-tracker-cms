"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import Column from "./Column";
import LeadDetailDialog from "./LeadDetailDialog";
import { LeadWithId } from "@/lib/types/leads";



import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
    DropAnimation,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import { updateLeadFollowUpStage } from "@/lib/api/leads";
import LeadCard from "./Lead";

interface LeadsViewProps {
    partitions: Record<string, LeadWithId[]>;
    labels: string[];
}

const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: "0.5",
            },
        },
    }),
};

export default function LeadsView({ partitions, labels }: { partitions: Record<string, LeadWithId[]>, labels: string[] }) {
    const [leads, setLeads] = useState(partitions);
    const [selectedLead, setSelectedLead] = useState<LeadWithId | null>(null);

    React.useEffect(() => {
        setLeads(partitions);
        if (selectedLead) {
            const allLeads = Object.values(partitions).flat();
            const updated = allLeads.find((l) => l.id === selectedLead.id);
            if (updated) {
                setSelectedLead(updated);
            }
        }
    }, [partitions, selectedLead]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [activeLead, setActiveLead] = useState<LeadWithId | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleLeadClick = (lead: LeadWithId) => {
        setSelectedLead(lead);
        setIsDialogOpen(true);
    };

    const findContainer = (id: string) => {
        if (id in leads) {
            return id;
        }
        const container = Object.keys(leads).find((key) =>
            leads[key as keyof typeof leads].find((item) => item.id === id)
        );
        return container;
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const id = active.id as string;
        const container = findContainer(id);
        if (container) {
            const item = leads[container as keyof typeof leads].find((i) => i.id === id);
            setActiveLead(item || null);
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        const overId = over?.id;

        if (!overId || active.id === overId) {
            return;
        }

        const activeContainer = findContainer(active.id as string);
        const overContainer = findContainer(overId as string);

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

        setLeads((prev) => {
            const activeItems = prev[activeContainer as keyof typeof prev];
            const overItems = prev[overContainer as keyof typeof prev];
            const activeIndex = activeItems.findIndex((i) => i.id === active.id);
            const overIndex = overItems.findIndex((i) => i.id === overId);

            let newIndex;
            if (overId in prev) {
                newIndex = overItems.length + 1;
            } else {
                const isBelowOverItem =
                    over &&
                    active.rect.current.translated &&
                    active.rect.current.translated.top >
                    over.rect.top + over.rect.height;

                const modifier = isBelowOverItem ? 1 : 0;
                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            return {
                ...prev,
                [activeContainer]: [
                    ...prev[activeContainer as keyof typeof prev].filter(
                        (item) => item.id !== active.id
                    ),
                ],
                [overContainer]: [
                    ...prev[overContainer as keyof typeof prev].slice(0, newIndex),
                    activeItems[activeIndex],
                    ...prev[overContainer as keyof typeof prev].slice(
                        newIndex,
                        prev[overContainer as keyof typeof prev].length
                    ),
                ],
            };
        });
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        const activeContainer = findContainer(active.id as string);
        const overContainer = over ? findContainer(over.id as string) : null;

        if (
            !activeContainer ||
            !overContainer
        ) {
            setActiveLead(null);
            return;
        }

        const activeIndex = leads[activeContainer as keyof typeof leads].findIndex(
            (i) => i.id === active.id
        );
        const overIndex = leads[overContainer as keyof typeof leads].findIndex(
            (i) => i.id === over?.id
        );

        if (activeIndex !== overIndex) {
            setLeads((prev) => ({
                ...prev,
                [activeContainer]: arrayMove(
                    prev[activeContainer as keyof typeof prev],
                    activeIndex,
                    overIndex
                ),
            }));
        }

        const stageIndex = labels.indexOf(overContainer as string);
        const stage = (stageIndex >= 0 ? stageIndex + 1 : 1) as 1 | 2 | 3;

        const result = await updateLeadFollowUpStage({
            id: active.id as string,
            followUpStage: stage,
        })

        if (result.status === "success") {
            toast.success(result.message)
        } else {
            toast.error(result.message)
        }

        setActiveLead(null);
    };

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col h-auto md:h-full md:grid md:grid-cols-3 md:divide-x md:divide-border gap-4 md:gap-0 pb-4 md:pb-0 md:px-0">
                {labels.map((stage, i) => (
                    <Column
                        key={stage}
                        id={stage}
                        title={stage}
                        partition={leads[stage as keyof typeof leads] || []}
                        onLeadClick={handleLeadClick}
                    />
                ))}
            </div>
            <DragOverlay dropAnimation={dropAnimation}>
                {activeLead ? <LeadCard lead={activeLead} onClick={() => { }} /> : null}
            </DragOverlay>
            <LeadDetailDialog
                lead={selectedLead}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />
        </DndContext>
    );
}
