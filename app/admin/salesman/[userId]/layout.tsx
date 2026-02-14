import { fetchUserDetail } from "@/lib/api/admin";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, Ban, Mail, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import SalesmanTabs from "@/components/salesman/SalesmanTabs";

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{
        userId: string;
    }>;
}

export default async function SalesmanLayout({ children, params }: LayoutProps) {
    const { userId } = await params;
    const { data: user, error } = await fetchUserDetail(userId);

    if (error || !user) {
        return notFound();
    }

    return (
        <div className="flex flex-col h-full space-y-6">
            {/* User Profile Header */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
                            <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                <Badge variant={user.status === "ACTIVE" ? "default" : "destructive"} className="uppercase">
                                    {user.status === "ACTIVE" ? <BadgeCheck className="w-3 h-3 mr-1" /> : <Ban className="w-3 h-3 mr-1" />}
                                    {user.status}
                                </Badge>
                                <span className="text-sm">Salesman ID: {user.id.slice(0, 8)}...</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                {user.email}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {user.createdAt ? `Joined ${new Date(user.createdAt).toLocaleDateString()}` : "Join date unknown"}
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <SalesmanTabs userId={userId} />

            <div className="flex-1 min-h-0">
                {children}
            </div>
        </div>
    );
}
