"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateLeadLabels } from "@/lib/api/leads"

interface LabelsManagerProps {
    initialLabels: string[]
}

export function LabelsManager({ initialLabels }: LabelsManagerProps) {
    const router = useRouter()
    const [labels, setLabels] = useState<string[]>(initialLabels.length === 3 ? initialLabels : ["NEW", "PENDING", "FINISHED"])
    const [isSaving, setIsSaving] = useState(false)

    const handleLabelChange = (index: number, value: string) => {
        const newLabels = [...labels]
        newLabels[index] = value
        setLabels(newLabels)
    }

    const onSave = async () => {
        if (labels.some(l => !l.trim())) {
            toast.error("All labels must be filled")
            return
        }

        setIsSaving(true)
        const result = await updateLeadLabels(labels.map(l => ({ label: l })))
        setIsSaving(false)

        if (result.status === "success") {
            toast.success(result.message)
            router.refresh()
        } else {
            toast.error(result.message)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Board Labels</CardTitle>
                <CardDescription>
                    Customize the column headers for your leads Kanban board.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="label1">Stage 1 (Default: NEW)</Label>
                        <Input
                            id="label1"
                            value={labels[0]}
                            onChange={(e) => handleLabelChange(0, e.target.value)}
                            placeholder="e.g. New Leads"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="label2">Stage 2 (Default: PENDING)</Label>
                        <Input
                            id="label2"
                            value={labels[1]}
                            onChange={(e) => handleLabelChange(1, e.target.value)}
                            placeholder="e.g. In Progress"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="label3">Stage 3 (Default: FINISHED)</Label>
                        <Input
                            id="label3"
                            value={labels[2]}
                            onChange={(e) => handleLabelChange(2, e.target.value)}
                            placeholder="e.g. Closed"
                        />
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button onClick={onSave} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
