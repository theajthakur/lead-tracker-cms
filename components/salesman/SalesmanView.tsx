"use client"

import { useState } from "react"
import { Plus, Search, User, Mail, Calendar, Shield } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import CreateSalesmanDialog from "./CreateSalesmanDialog"
import SalesmanDetailsDialog from "./SalesmanDetailsDialog"

interface Salesman {
    id: string
    name: string
    email: string
    createdAt: Date
    status: string
    _count: {
        leads: number
    }
}

interface SalesmanViewProps {
    initialSalesmen: Salesman[]
}

export default function SalesmanView({ initialSalesmen }: SalesmanViewProps) {
    const [salesmen, setSalesmen] = useState<Salesman[]>(initialSalesmen)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedSalesmanId, setSelectedSalesmanId] = useState<string | null>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)

    const filteredSalesmen = salesmen.filter(
        (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleSalesmanCreated = (newSalesman: any) => {
        // Optimistic update or refresh
        // Since the API returns the created user, we can append it
        // But the type might slightly mismatch if not careful with _count
        // For simplicity, we can trigger a router refresh or just append with default count
        const salesman: Salesman = {
            id: newSalesman.id,
            name: newSalesman.name,
            email: newSalesman.email,
            createdAt: newSalesman.createdAt,
            status: newSalesman.status,
            _count: { leads: 0 }
        }
        setSalesmen((prev) => [salesman, ...prev])
    }

    const handleRowClick = (id: string) => {
        setSelectedSalesmanId(id)
        setIsDetailsOpen(true)
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Salesmen</h1>
                    <p className="text-muted-foreground">
                        Manage your sales team and view their performance.
                    </p>
                </div>
                <CreateSalesmanDialog onSalesmanCreated={handleSalesmanCreated} />
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Team Members</CardTitle>
                            <CardDescription>
                                A list of all salesmen in your organization.
                            </CardDescription>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search salesmen..."
                                className="pl-8 max-w-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="text-right">Leads Assigned</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSalesmen.map((salesman) => (
                                <TableRow
                                    key={salesman.id}
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => handleRowClick(salesman.id)}
                                >
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium flex items-center gap-2">
                                                <User className="h-3 w-3 text-muted-foreground" />
                                                {salesman.name}
                                            </span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-2">
                                                <Mail className="h-3 w-3" />
                                                {salesman.email}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={salesman.status === "ACTIVE" ? "default" : "secondary"}>
                                            {salesman.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            {format(new Date(salesman.createdAt), "PP")}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        {salesman._count.leads}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredSalesmen.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No salesmen found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <SalesmanDetailsDialog
                userId={selectedSalesmanId}
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
            />
        </div>
    )
}
