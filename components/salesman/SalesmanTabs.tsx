"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function SalesmanTabs({ userId }: { userId: string }) {
    const pathname = usePathname();

    return (
        <div className="flex items-center gap-2">
            <Link
                href={`/admin/salesman/${userId}/manage`}
                className={cn(
                    buttonVariants({ variant: pathname.includes("/manage") ? "default" : "outline" }),
                    "h-9"
                )}
            >
                Manage
            </Link>
            <Link
                href={`/admin/salesman/${userId}/profile`}
                className={cn(
                    buttonVariants({ variant: pathname.endsWith("/profile") || pathname === `/admin/salesman/${userId}` ? "default" : "outline" }),
                    "h-9"
                )}
            >
                Profile
            </Link>
            <Link
                href={`/admin/salesman/${userId}/leads`}
                className={cn(
                    buttonVariants({ variant: pathname.includes("/leads") ? "default" : "outline" }),
                    "h-9"
                )}
            >
                Leads
            </Link>
        </div>
    )
}
