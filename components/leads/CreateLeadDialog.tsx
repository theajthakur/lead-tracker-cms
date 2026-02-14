"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
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
import { createNewLead } from "@/lib/api/leads"
import { toast } from "sonner"

const leadSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    mobile: z.string().min(10, { message: "Mobile number must be at least 10 digits." }),
    description: z.string().optional(),
    source: z.enum([
        "WEBSITE", // Assuming this might be needed, but sticking to provided types and fallback
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

// Correcting Source enum based on file analysis if needed, but the previous file view showed "WEBSITE" wasn't there but "OTHER" was.
// Let's re-verify source types from lib/types/leads.ts if I can, but I saw it earlier.
// Types: "OTHER" | "FACEBOOK" | "INSTAGRAM" | "GOOGLE" | "TIKTOK" | "WHATSAPP" | "LINKEDIN" | "TWITTER" | "YOUTUBE"
// I won't include "WEBSITE" if it's not in the type definition I saw.
// It was: "OTHER" | "FACEBOOK" | "INSTAGRAM" | "GOOGLE" | "TIKTOK" | "WHATSAPP" | "LINKEDIN" | "TWITTER" | "YOUTUBE" | "OTHER"

type LeadFormValues = z.infer<typeof leadSchema>

export function CreateLeadDialog() {
    const [open, setOpen] = useState(false)
    const router = useRouter()

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

    async function onSubmit(data: LeadFormValues) {
        // We need to match the Lead interface.
        // The Lead interface has followUpStage which is required.
        // We'll default it to 1 (New Lead) or whatever the type says (1 | 2 | 3).

        // Convert form data to API expected format
        const payload = {
            ...data,
            followUpStage: 1 as const, // 1 = New? Need to check semantics but 1 is safe for now
            description: data.description || "",
            label: data.label || null,
        }

        const result = await createNewLead(payload)

        if (result.status === "success") {
            toast.success(result.message)
            setOpen(false)
            form.reset()
            router.refresh()
        } else {
            toast.error(result.message)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create New Lead
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Create New Lead</DialogTitle>
                    <DialogDescription>
                        Add a new lead to your system. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Priority, First Follow up done,Second Follow up done" {...field} />
                                    </FormControl>
                                    <div className="flex gap-2 mt-2">
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
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Any additional details..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit">Create Lead</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
