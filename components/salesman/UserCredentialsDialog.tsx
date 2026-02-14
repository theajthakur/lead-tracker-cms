"use client"

import { useState } from "react"
import { Copy, Check, Eye, EyeOff } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface UserCredentialsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    credentials: {
        email: string
        password?: string
    } | null
}

export default function UserCredentialsDialog({
    open,
    onOpenChange,
    credentials,
}: UserCredentialsDialogProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [copied, setCopied] = useState(false)

    if (!credentials) return null

    const handleCopy = () => {
        const text = `Email: ${credentials.email}\nPassword: ${credentials.password}`
        navigator.clipboard.writeText(text)
        setCopied(true)
        toast.success("Credentials copied to clipboard")
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Salesman Created Successfully</DialogTitle>
                    <DialogDescription>
                        Please copy these credentials and share them with the user. The password will not be shown again.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="email" className="sr-only">
                            Email
                        </Label>
                        <Input
                            id="email"
                            defaultValue={credentials.email}
                            readOnly
                        />
                        <div className="relative">
                            <Label htmlFor="password" className="sr-only">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                defaultValue={credentials.password}
                                readOnly
                                className="pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span className="sr-only">
                                    {showPassword ? "Hide password" : "Show password"}
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
                <DialogFooter className="sm:justify-start">
                    <Button
                        type="button"
                        variant="secondary"
                        className="w-full"
                        onClick={handleCopy}
                    >
                        {copied ? (
                            <Check className="mr-2 h-4 w-4" />
                        ) : (
                            <Copy className="mr-2 h-4 w-4" />
                        )}
                        Copy Credentials
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
