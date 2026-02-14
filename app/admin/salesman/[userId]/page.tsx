import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Trophy, XCircle } from "lucide-react";
import { getLeadsAnalyticsByUserId } from "@/lib/api/leads";

interface PageProps {
    params: Promise<{
        userId: string
    }>
}

export default async function SalesmanDetailPage({ params }: PageProps) {
    const { userId } = await params;

    const [analyticsReq] = await Promise.all([
        getLeadsAnalyticsByUserId(userId)
    ]);

    const analytics = (analyticsReq as any).data || {
        totalLeads: 0,
        stage1: 0,
        stage2: 0,
        stage3: 0,
        stage4: 0,
        stage5: 0,
        stage6: 0,
    };

    const stats = [
        {
            title: "Total Leads",
            value: analytics.totalLeads.toString(),
            icon: Users,
        },
        {
            title: "Quote",
            value: analytics.stage4.toString(),
            icon: FileText,
        },
        {
            title: "Won",
            value: analytics.stage5.toString(),
            icon: Trophy,
        },
        {
            title: "Lost",
            value: analytics.stage6.toString(),
            icon: XCircle,
        },
    ];

    return (
        <div className="flex flex-col h-full space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
