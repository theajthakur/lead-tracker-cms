"use client"

import React from 'react'
import { usePathname } from 'next/navigation'
import { SessionProvider } from "next-auth/react"
import { AdminShell } from './AdminShell'
import { TooltipProvider } from '../ui/tooltip'

export default function LayoutProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";

    return (
        <TooltipProvider>
            <SessionProvider>
                {isLoginPage ? (
                    children
                ) : (
                    <AdminShell>{children}</AdminShell>
                )}
            </SessionProvider>
        </TooltipProvider>
    )
}

