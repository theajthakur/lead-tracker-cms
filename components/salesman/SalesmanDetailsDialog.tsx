"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Mail, Phone, Calendar, User, Loader2, Search, MoreVertical, Ban, CheckCircle, Trash2, KeyRound } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"

import { fetchUserDetail, listUserLeads, enableUser, disableUser, deleteUser, resetPassword } from "@/lib/api/admin"
import { LeadWithId } from "@/lib/types/leads"
import LeadDetailDialog from "@/components/leads/LeadDetailDialog"
import UserCredentialsDialog from "./UserCredentialsDialog"

interface SalesmanDetailsDialogProps {
    userId: string | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function SalesmanDetailsDialog({
    userId,
    open,
    onOpenChange,
}: SalesmanDetailsDialogProps) {
    const [user, setUser] = useState<any>(null)
    const [leads, setLeads] = useState<LeadWithId[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedLead, setSelectedLead] = useState<LeadWithId | null>(null)
    const [isLeadDetailOpen, setIsLeadDetailOpen] = useState(false)
    const [showCredentials, setShowCredentials] = useState(false)
    const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null)

    const loadData = async () => {
        if (!userId) return

        setIsLoading(true)
        try {
            const [userRes, leadsRes] = await Promise.all([
                fetchUserDetail(userId),
                listUserLeads(userId),
            ])

            if (userRes.success) setUser(userRes.data)
            if (leadsRes.success) setLeads(leadsRes.data as LeadWithId[])
        } catch (error) {
            console.error("Failed to load details", error)
            toast.error("Failed to load salesman details")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (open) {
            loadData()
        }
    }, [userId, open])

    const handleStatusToggle = async () => {
        if (!user) return
        const action = user.status === "ACTIVE" ? disableUser : enableUser
        const result = await action(user.id)
        if (result.success) {
            toast.success(`User ${user.status === "ACTIVE" ? "disabled" : "enabled"} successfully`)
            setUser(result.data)
        } else {
            toast.error(result.error)
        }
    }

    const handleDelete = async () => {
        if (!user || !confirm("Are you sure you want to delete this salesman? This action cannot be undone.")) return
        const result = await deleteUser(user.id)
        if (result.success) {
            toast.success("User deleted successfully")
            onOpenChange(false)
        } else {
            toast.error(result.error)
        }
    }

    const handleResetPassword = async () => {
        if (!user || !confirm("Are you sure you want to reset the password for this user?")) return
        const result = await resetPassword(user.id)
        if (result.success && result.data) {
            toast.success("Password reset successfully")
            setCredentials({ email: user.email, password: result.data.password })
            setShowCredentials(true)
        } else {
            toast.error(result.error)
        }
    }

    const filteredLeads = leads.filter(
        (lead) =>
            lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.mobile?.includes(searchQuery)
    )

    const handleLeadClick = (lead: LeadWithId) => {
        setSelectedLead(lead)
        setIsLeadDetailOpen(true)
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="w-[95vw] max-w-4xl p-0 overflow-hidden rounded-2xl h-[80vh] flex flex-col">
                    {isLoading || !user ? (
                        <div className="flex flex-1 items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="flex flex-1 flex-col overflow-hidden">
                            {/* Header / User Info */}
                            <div className="px-6 py-4 border-b flex items-center justify-between bg-muted/20">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold flex items-center gap-2">
                                            {user.name}
                                            <Badge variant={user.status === "ACTIVE" ? "default" : "secondary"}>
                                                {user.status}
                                            </Badge>
                                        </h2>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Mail className="h-3 w-3" /> {user.email}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" /> Joined {format(new Date(user.createdAt), "PP")}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={handleStatusToggle}>
                                            {user.status === "ACTIVE" ? (
                                                <>
                                                    <Ban className="mr-2 h-4 w-4 text-orange-500" />
                                                    Disable Account
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                                    Enable Account
                                                </>
                                            )}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleResetPassword}>
                                            <KeyRound className="mr-2 h-4 w-4" />
                                            Reset Password
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete Account
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Leads List Section */}
                            <div className="flex flex-col flex-1 overflow-hidden">
                                <div className="px-6 py-4 flex items-center justify-between border-b bg-background z-10">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        Assigned Leads
                                        <Badge variant="secondary" className="rounded-full">
                                            {leads.length}
                                        </Badge>
                                    </h3>
                                    <div className="relative w-64">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search leads..."
                                            className="pl-8 h-9"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="pl-6">Lead Name</TableHead>
                                                <TableHead>Contact</TableHead>
                                                <TableHead>Source</TableHead>
                                                <TableHead>Stage</TableHead>
                                                <TableHead className="text-right pr-6">Date</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredLeads.length > 0 ? (
                                                filteredLeads.map((lead) => (
                                                    <TableRow
                                                        key={lead.id}
                                                        className="cursor-pointer hover:bg-muted/50"
                                                        onClick={() => handleLeadClick(lead)}
                                                    >
                                                        <TableCell className="font-medium pl-6">
                                                            {lead.name}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-col text-sm">
                                                                <span className="text-muted-foreground text-xs">
                                                                    {lead.email}
                                                                </span>
                                                                <span>{lead.mobile}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{lead.source}</TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline">
                                                                {lead.followUpStage === 1 && "New"}
                                                                {lead.followUpStage === 2 && "Pending"}
                                                                {lead.followUpStage === 3 && "Finished"}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right text-muted-foreground pr-6">
                                                            {format(new Date(lead.createdAt), "PP")}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="h-24 text-center">
                                                        No leads found.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {selectedLead && (
                <LeadDetailDialog
                    lead={selectedLead}
                    open={isLeadDetailOpen}
                    onOpenChange={setIsLeadDetailOpen}
                    readonly={true}
                />
            )}

            {credentials && (
                <UserCredentialsDialog
                    open={showCredentials}
                    onOpenChange={setShowCredentials}
                    credentials={credentials}
                />
            )}
        </>
    )
}
