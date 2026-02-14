import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { leadsAnalytics } from "@/lib/api/leads"
import {
  Users,
  UserPlus,
  Clock,
  CheckCircle2,
  TrendingUp,
} from "lucide-react"

export default async function DashboardPage() {
  const analytics = await leadsAnalytics()
  const data = analytics.data || {
    totalLeads: 0,
    stage1: 0,
    stage2: 0,
    stage3: 0,
  }

  const stats = [
    {
      title: "Total Leads",
      value: data.totalLeads.toString(),
      description: "All time leads",
      icon: Users,
    },
    {
      title: "New Leads",
      value: data.stage1.toString(),
      description: "Leads in NEW stage",
      icon: UserPlus,
    },
    {
      title: "Pending Follow-ups",
      value: data.stage2.toString(),
      description: "Leads in PENDING stage",
      icon: Clock,
    },
    {
      title: "Converted",
      value: data.stage3.toString(),
      description: "Leads in FINISHED stage",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your sales performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your recent interactions with leads.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
              <p>No recent activity to show.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>
              Weekly lead conversion metrics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-center justify-center text-muted-foreground">
              <div className="text-center">
                <TrendingUp className="mx-auto h-10 w-10 opacity-20" />
                <p className="mt-2 text-sm">Chart Placeholder</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
