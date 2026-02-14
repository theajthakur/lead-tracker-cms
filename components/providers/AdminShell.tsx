"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import {
    LayoutDashboard,
    LogOut,
    Menu,
    Users,
    X,
    Settings,
    ChevronsUpDown,
    User,
    Briefcase,
    ChevronLeft,
    ChevronRight
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface AdminShellProps {
    children: React.ReactNode
}

const userNavItems = [
    {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Leads",
        href: "/leads",
        icon: Users,
    },
]

const adminNavItems = [
    {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Salesman",
        href: "/admin/salesman",
        icon: Briefcase,
    },
]

export function AdminShell({ children }: AdminShellProps) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const pathname = usePathname()
    const [open, setOpen] = useState(false)
    const [isAdminPanel, setIsAdminPanel] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(false)

    React.useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        }
    }, [status, router])

    if (status === "loading") {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        )
    }

    if (status === "unauthenticated") {
        return null // Will redirect via useEffect
    }

    const currentNavItems = isAdminPanel ? adminNavItems : userNavItems

    return (
        <TooltipProvider delayDuration={0}>
            <div className={cn(
                "grid h-screen w-full transition-all duration-300 ease-in-out overflow-hidden",
                isCollapsed
                    ? "md:grid-cols-[60px_1fr]"
                    : "md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]"
            )}>
                <div className="hidden border-r bg-muted/40 md:block overflow-hidden transition-all duration-300">
                    <SidebarContent
                        pathname={pathname}
                        user={session?.user}
                        navItems={currentNavItems}
                        isAdminPanel={isAdminPanel}
                        setIsAdminPanel={setIsAdminPanel}
                        isCollapsed={isCollapsed}
                        toggleCollapse={() => setIsCollapsed(!isCollapsed)}
                    />
                </div>
                <div className="flex flex-col h-full overflow-hidden">
                    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden shrink-0">
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="shrink-0 md:hidden"
                                >
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle navigation menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="flex flex-col p-0 w-64">
                                <SidebarContent
                                    pathname={pathname}
                                    setOpen={setOpen}
                                    user={session?.user}
                                    navItems={currentNavItems}
                                    isAdminPanel={isAdminPanel}
                                    setIsAdminPanel={setIsAdminPanel}
                                    isCollapsed={false} // Always expanded on mobile
                                />
                            </SheetContent>
                        </Sheet>
                        <div className="w-full flex-1">
                            <span className="font-semibold">
                                {isAdminPanel ? "Admin Panel" : "User Panel"}
                            </span>
                        </div>
                    </header>
                    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </TooltipProvider>
    )
}

interface SidebarContentProps {
    pathname: string | null
    setOpen?: (open: boolean) => void
    user?: {
        name?: string | null
        email?: string | null
        image?: string | null
        role?: string
    }
    navItems: typeof userNavItems
    isAdminPanel: boolean
    setIsAdminPanel: (value: boolean) => void
    isCollapsed: boolean
    toggleCollapse?: () => void
}

function SidebarContent({
    pathname,
    setOpen,
    user,
    navItems,
    isAdminPanel,
    setIsAdminPanel,
    isCollapsed,
    toggleCollapse
}: SidebarContentProps) {
    return (
        <div className="flex h-full flex-col gap-4">
            <div className={cn(
                "flex h-14 items-center border-b px-4 lg:h-[60px] shrink-0",
                isCollapsed ? "justify-center" : "justify-between"
            )}>
                {!isCollapsed && <span className="font-semibold">{isAdminPanel ? "Admin Panel" : "CMS"}</span>}
                {toggleCollapse && (
                    <Button variant="ghost" size="icon" onClick={toggleCollapse} className="h-8 w-8 hidden md:flex">
                        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    </Button>
                )}
            </div>
            <div className="flex-1 overflow-auto py-2">
                <nav className="grid items-start px-2 text-sm font-medium gap-1">
                    {navItems.map((item) => {
                        const LinkComponent = (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen?.(false)}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary whitespace-nowrap",
                                    pathname === item.href
                                        ? "bg-muted text-primary"
                                        : "text-muted-foreground",
                                    isCollapsed && "justify-center px-2"
                                )}
                            >
                                <item.icon className="h-4 w-4 shrink-0" />
                                {!isCollapsed && <span>{item.title}</span>}
                            </Link>
                        )

                        if (isCollapsed) {
                            return (
                                <Tooltip key={item.href}>
                                    <TooltipTrigger asChild>
                                        {LinkComponent}
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        {item.title}
                                    </TooltipContent>
                                </Tooltip>
                            )
                        }

                        return LinkComponent
                    })}
                </nav>
            </div>
            <div className="border-t p-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className={cn("w-full justify-start px-2 h-14 hover:bg-muted/50", isCollapsed && "justify-center px-0")}>
                            <div className="flex items-center gap-3 w-full">
                                <div className="h-8 w-8 rounded-full bg-muted border flex items-center justify-center shrink-0">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                </div>
                                {!isCollapsed && (
                                    <>
                                        <div className="flex flex-col items-start text-left overflow-hidden flex-1">
                                            <span className="text-sm font-medium truncate w-full">
                                                {user?.name || "User"}
                                            </span>
                                            <span className="text-xs text-muted-foreground truncate w-full">
                                                {user?.email || "user@example.com"}
                                            </span>
                                        </div>
                                        <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground opacity-50" />
                                    </>
                                )}
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" side={isCollapsed ? "right" : "top"} forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user?.email || "user@example.com"}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        {user?.role === "ADMIN" && (
                            <>
                                <div className="flex items-center justify-between px-2 py-2">
                                    <Label htmlFor="admin-mode" className="text-sm">Admin Panel</Label>
                                    <Switch
                                        id="admin-mode"
                                        checked={isAdminPanel}
                                        onCheckedChange={setIsAdminPanel}
                                    />
                                </div>
                                <DropdownMenuSeparator />
                            </>
                        )}

                        <DropdownMenuItem onClick={() => signOut()}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
