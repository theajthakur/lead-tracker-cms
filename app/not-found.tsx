"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function notFound() {
    return (
        <div className="flex w-full flex-col p-8 rounded-lg shadow-sm justify-center items-center h-full">
            <Image src="/404.png" alt="Not Found" width={500} height={500} />
            <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
            <p className="text-muted-foreground">The page you are looking for does not exist.</p>
            <Button onClick={() => { window.location.href = "/" }}>Go Back</Button>
        </div>
    )
}
