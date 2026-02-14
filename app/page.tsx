import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LeadsPieChart } from "@/components/dashboard/LeadsPieChart"
import { LeadsBarChart } from "@/components/dashboard/LeadsBarChart"
import { leadsAnalytics } from "@/lib/api/leads"
import { LEAD_STAGES } from "@/lib/types/leads"
import {
  Users,
  FileText,
  Trophy,
  XCircle,
} from "lucide-react"

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  const analytics = await leadsAnalytics();

  const data = analytics.data || {
    totalLeads: 0,
    stage1: 0,
    stage2: 0,
    stage3: 0,
    stage4: 0,
    stage5: 0,
    stage6: 0,
  }

  const chartData = [
    { name: LEAD_STAGES[0], value: data.stage1 },
    { name: LEAD_STAGES[1], value: data.stage2 },
    { name: LEAD_STAGES[2], value: data.stage3 },
    { name: LEAD_STAGES[3], value: data.stage4 },
    { name: LEAD_STAGES[4], value: data.stage5 },
    { name: LEAD_STAGES[5], value: data.stage6 },
  ]

  const stats = [
    {
      title: "Total Leads",
      value: data.totalLeads.toString(),
      description: "All time leads",
      icon: Users,
    },
    {
      title: "Quote",
      value: data.stage4.toString(),
      description: "Leads in Quote stage",
      icon: FileText,
    },
    {
      title: "Won",
      value: data.stage5.toString(),
      description: "Won leads",
      icon: Trophy,
    },
    {
      title: "Lost",
      value: data.stage6.toString(),
      description: "Lost leads",
      icon: XCircle,
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
            <CardTitle>Lead Stages Overview</CardTitle>
            <CardDescription>
              Count of leads in each stage.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LeadsBarChart data={chartData} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>
              Leads distribution statistics
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
