import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LeadsPieChart } from "@/components/dashboard/LeadsPieChart"
import { LeadsLineChart } from "@/components/dashboard/LeadsLineChart"
import { leadsAnalytics, getRecentLeadsActivity } from "@/lib/api/leads"
import {
  Users,
  UserPlus,
  Clock,
  CheckCircle2,
  TrendingUp,
} from "lucide-react"

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  let labels = ["NEW", "PENDING", "FINISHED"]

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { labels: true }
    })
    if (user?.labels && user.labels.length === 3) {
      labels = user.labels
    }
  }

  const [analytics, recentActivity] = await Promise.all([
    leadsAnalytics(),
    getRecentLeadsActivity()
  ]);

  const activityData = recentActivity.status === "success" && recentActivity.data ? recentActivity.data : [];

  const data = analytics.data || {
    totalLeads: 0,
    stage1: 0,
    stage2: 0,
    stage3: 0,
  }

  const chartData = [
    { name: labels[0], value: data.stage1 },
    { name: labels[1], value: data.stage2 },
    { name: labels[2], value: data.stage3 },
  ]

  const stats = [
    {
      title: "Total Leads",
      value: data.totalLeads.toString(),
      description: "All time leads",
      icon: Users,
    },
    {
      title: `${labels[0]} Leads`,
      value: data.stage1.toString(),
      description: `Leads in ${labels[0]} stage`,
      icon: UserPlus,
    },
    {
      title: `${labels[1]} Leads`,
      value: data.stage2.toString(),
      description: `Leads in ${labels[1]} stage`,
      icon: Clock,
    },
    {
      title: `${labels[2]} Leads`,
      value: data.stage3.toString(),
      description: `Leads in ${labels[2]} stage`,
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
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your recent interactions with leads.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LeadsLineChart data={activityData} labels={labels} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>
              Leads wise Statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LeadsPieChart data={chartData} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
