"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteUser, resetPassword, enableUser, disableUser } from "@/lib/api/admin"
import { toast } from "sonner"
import { Loader2, Trash2, KeyRound, Copy, Check, Ban, CheckCircle } from "lucide-react"

interface ManageSalesmanViewProps {
    userId: string
    userEmail: string
    currentStatus: string
}

export default function ManageSalesmanView({ userId, userEmail, currentStatus }: ManageSalesmanViewProps) {
    const router = useRouter()
    const [status, setStatus] = useState(currentStatus)
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isResetting, setIsResetting] = useState(false)
    const [newCredentials, setNewCredentials] = useState<{ email: string, password: string } | null>(null)
    const [credModalOpen, setCredModalOpen] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        const res = await deleteUser(userId)

        if (res.error) {
            toast.error(res.error)
            setIsDeleting(false)
        } else {
            toast.success("Salesman deleted successfully")
            router.push("/admin/salesman")
        }
        setDeleteDialogOpen(false)
    }

    const handleResetPassword = async () => {
        setIsResetting(true)
        const res = await resetPassword(userId)

        if (res.error || !res.data) {
            toast.error(res.error || "Failed to reset password")
        } else {
            setNewCredentials({
                email: userEmail,
                password: res.data.password // Ensure API returns { password: "..." }
            })
            setCredModalOpen(true)
            toast.success("Password reset successfully")
        }
        setIsResetting(false)
    }

    const copyToClipboard = () => {
        if (!newCredentials) return
        const text = `Email: ${newCredentials.email}\nPassword: ${newCredentials.password}`
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        toast.success("Credentials copied to clipboard")
    }

    const handleToggleStatus = async () => {
        setIsUpdatingStatus(true)
        if (status === "ACTIVE") {
            const res = await disableUser(userId)
            if (res.error) {
                toast.error(res.error)
            } else {
                setStatus("DISABLED")
                toast.success("User disabled successfully")
                router.refresh()
            }
        } else {
            const res = await enableUser(userId)
            if (res.error) {
                toast.error(res.error)
            } else {
                setStatus("ACTIVE")
                toast.success("User enabled successfully")
                router.refresh()
            }
        }
        setIsUpdatingStatus(false)
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Manage password and authentication settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                            <p className="font-medium">Reset Password</p>
                            <p className="text-sm text-muted-foreground">
                                Generate a new password for this user.
                            </p>
                        </div>
                        <Button variant="outline" onClick={handleResetPassword} disabled={isResetting}>
                            {isResetting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
                            Reset Password
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Account Status</CardTitle>
                    <CardDescription>Enable or disable this user's access to the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <p className="font-medium">Current Status</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status === "ACTIVE"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                    }`}>
                                    {status}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {status === "ACTIVE"
                                    ? "User has full access to the system."
                                    : "User is blocked from accessing the system."}
                            </p>
                        </div>
                        <Button
                            variant={status === "ACTIVE" ? "destructive" : "default"}
                            onClick={handleToggleStatus}
                            disabled={isUpdatingStatus}
                        >
                            {isUpdatingStatus ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : status === "ACTIVE" ? (
                                <Ban className="mr-2 h-4 w-4" />
                            ) : (
                                <CheckCircle className="mr-2 h-4 w-4" />
                            )}
                            {status === "ACTIVE" ? "Disable User" : "Enable User"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>
                        Irreversible actions. Please proceed with caution.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                        <div className="space-y-1">
                            <p className="font-medium text-destructive">Delete User</p>
                            <p className="text-sm text-muted-foreground">
                                Permanently delete this user and all their leads.
                            </p>
                        </div>
                        <Button
                            variant="destructive"
                            onClick={() => setDeleteDialogOpen(true)}
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                            Delete User
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the salesman
                            <span className="font-medium text-foreground"> {userEmail} </span>
                            and remove all their data, including assigned leads.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Delete Salesman"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Credentials Modal */}
            <AlertDialog open={credModalOpen} onOpenChange={setCredModalOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Credentials Updated</AlertDialogTitle>
                        <AlertDialogDescription>
                            The password has been reset successfully. Please copy these details now as the password will not be shown again.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {newCredentials && (
                        <div className="p-4 my-4 bg-muted/50 rounded-lg space-y-3 relative group">
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground uppercase">Email</span>
                                <p className="font-mono text-sm break-all">{newCredentials.email}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground uppercase">New Password</span>
                                <p className="font-mono text-sm break-all tracking-wider font-bold">{newCredentials.password}</p>
                            </div>
                            <Button
                                size="sm"
                                variant="secondary"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={copyToClipboard}
                            >
                                {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                                {copied ? "Copied" : "Copy"}
                            </Button>
                        </div>
                    )}

                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setCredModalOpen(false)}>Done</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
