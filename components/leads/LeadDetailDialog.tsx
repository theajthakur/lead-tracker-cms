"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import {
    X,
    Mail,
    Phone,
    Calendar,
    Hash,
    Globe,
    Trash2,
    Pencil,
    Save,
    Undo,
    Loader2
} from "lucide-react"

import { LeadWithId } from "@/lib/types/leads"
import { deleteLead, updateLeadContent } from "@/lib/api/leads"

const leadSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    mobile: z.string().min(10, { message: "Mobile number must be at least 10 digits." }),
    description: z.string().optional(),
    source: z.enum([
        "FACEBOOK",
        "INSTAGRAM",
        "GOOGLE",
        "TIKTOK",
        "WHATSAPP",
        "LINKEDIN",
        "TWITTER",
        "YOUTUBE",
        "OTHER"
    ], {
        required_error: "Please select a source.",
    }),
    label: z.string().optional(),
})

type LeadFormValues = z.infer<typeof leadSchema>

interface LeadDetailDialogProps {
    lead: LeadWithId | null
    open: boolean
    onOpenChange: (open: boolean) => void
    readonly?: boolean
}

export default function LeadDetailDialog({
    lead,
    open,
    onOpenChange,
    readonly = false,
}: LeadDetailDialogProps) {
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    // Reset editing state when dialog closes or lead changes
    useEffect(() => {
        if (!open) {
            setIsEditing(false)
        }
    }, [open])

    const form = useForm<LeadFormValues>({
        resolver: zodResolver(leadSchema),
        defaultValues: {
            name: "",
            email: "",
            mobile: "",
            description: "",
            source: "OTHER",
            label: "",
        },
    })

    // Update form values when lead changes
    useEffect(() => {
        if (lead) {
            form.reset({
                name: lead.name,
                email: lead.email,
                mobile: lead.mobile,
                description: lead.description || "",
                // @ts-ignore - Assuming source matches enum, fallback to OTHER if not
                source: lead.source as any || "OTHER",
                label: lead.label || "",
            })
        }
    }, [lead, form])

    if (!lead) return null

    const stageMap = {
        1: { label: "New", color: "bg-primary/10 text-primary" },
        2: { label: "Pending", color: "bg-yellow-500/10 text-yellow-600" },
        3: { label: "Finished", color: "bg-green-500/10 text-green-600" },
    }

    const stage = stageMap[lead.followUpStage as 1 | 2 | 3]

    const handleDelete = async () => {
        setIsDeleting(true)
        const result = await deleteLead(lead.id)
        setIsDeleting(false)

        if (result.status === "success") {
            toast.success(result.message)
            onOpenChange(false)
            router.refresh()
        } else {
            toast.error(result.message)
        }
    }

    const onSave = async (data: LeadFormValues) => {
        setIsLoading(true)
        const payload = {
            ...lead, // Keep existing ID and stage
            ...data,
            description: data.description || "",
        }

        const result = await updateLeadContent(payload)
        setIsLoading(false)

        if (result.status === "success") {
            toast.success(result.message)
            setIsEditing(false)
            router.refresh()
        } else {
            toast.error(result.message)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] max-w-xl p-0 overflow-hidden rounded-2xl" showCloseButton={false}>

                {/* Header */}
                {/* Header */}
                <div className="p-4 sm:p-6 border-b bg-linear-to-b from-muted/40 to-background relative">
                    <DialogHeader className="md:pr-0">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-xl md:text-2xl font-semibold tracking-tight truncate">
                                {isEditing ? "Edit Lead" : lead.name}
                            </DialogTitle>
                        </div>

                        {!isEditing && (
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-3.5 w-3.5" />
                                    Created{" "}
                                    {lead.createdAt
                                        ? format(new Date(lead.createdAt), "PPP")
                                        : "Unknown"}
                                </div>

                                <div className="flex items-center gap-2">
                                    {!readonly && (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 gap-2"
                                                onClick={() => setIsEditing(true)}
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                                <span className="hidden sm:inline">Edit</span>
                                            </Button>

                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                        <span className="hidden sm:inline">Delete</span>
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-60" align="end">
                                                    <div className="grid gap-4">
                                                        <div className="space-y-2">
                                                            <h4 className="font-medium leading-none">Delete Lead?</h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                This action cannot be undone.
                                                            </p>
                                                        </div>
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={handleDelete}
                                                                disabled={isDeleting}
                                                            >
                                                                {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Delete"}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </>
                                    )}

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full"
                                        onClick={() => onOpenChange(false)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {isEditing && (
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 gap-2"
                                    onClick={() => setIsEditing(false)}
                                >
                                    <Undo className="h-3.5 w-3.5" />
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </DialogHeader>
                </div>

                {/* Body */}
                <div className="px-4 sm:px-8 py-6 max-h-[60vh] overflow-y-auto">
                    {isEditing ? (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="John Doe" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="john@example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="mobile"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mobile</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="+1234567890" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="source"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Source</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a source" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="FACEBOOK">Facebook</SelectItem>
                                                        <SelectItem value="INSTAGRAM">Instagram</SelectItem>
                                                        <SelectItem value="GOOGLE">Google</SelectItem>
                                                        <SelectItem value="TIKTOK">TikTok</SelectItem>
                                                        <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                                                        <SelectItem value="LINKEDIN">LinkedIn</SelectItem>
                                                        <SelectItem value="TWITTER">Twitter</SelectItem>
                                                        <SelectItem value="YOUTUBE">YouTube</SelectItem>
                                                        <SelectItem value="OTHER">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="label"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Label</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Hot, Warm" {...field} />
                                                </FormControl>
                                                <div className="flex gap-2 mt-2 flex-wrap">
                                                    {["Priority", "First Follow up done", "Second Follow up done"].map((label) => (
                                                        <span
                                                            key={label}
                                                            className="cursor-pointer text-xs px-2 py-1 bg-secondary rounded-md hover:bg-secondary/80 transition-colors"
                                                            onClick={() => field.onChange(label)}
                                                        >
                                                            {label}
                                                        </span>
                                                    ))}
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Any additional details..." {...field} className="min-h-[100px]" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-end pt-4">
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="mr-2 h-4 w-4" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    ) : (
                        <div className="space-y-8">
                            {/* Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <InfoCard icon={<Mail className="w-4 h-4" />} label="Email" value={lead.email} />
                                <InfoCard icon={<Phone className="w-4 h-4" />} label="Mobile" value={lead.mobile} />
                                <InfoCard icon={<Globe className="w-4 h-4" />} label="Source" value={lead.source} />
                                <InfoCard icon={<Hash className="w-4 h-4" />} label="Label" value={lead.label} />
                                <InfoCard icon={<Hash className="w-4 h-4" />} label="Lead ID" value={lead.id} className="col-span-2" />
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
                    )}
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
    className
}: {
    icon: React.ReactNode
    label: string
    value?: string | null
    mono?: boolean
    className?: string
}) {
    return (
        <div className={`rounded-xl flex flex-col border bg-background p-4 shadow-sm hover:shadow-md transition ${className}`}>
            <div className="flex items-center gap-2">
                {icon}
                <p className="text-xs">{label}</p>
            </div>

            <div
                className={`text-xs mt-2  font-medium break-all ${mono ? "font-mono text-xs" : ""
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
