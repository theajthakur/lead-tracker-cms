"use client"

import React from 'react'
import { usePathname } from 'next/navigation'
import { SessionProvider } from "next-auth/react"
import { AdminShell } from './AdminShell'

export default function LayoutProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";

    return (
        <SessionProvider>
            {isLoginPage ? (
                children
            ) : (
                <AdminShell>{children}</AdminShell>
            )}
        </SessionProvider>
    )
}

