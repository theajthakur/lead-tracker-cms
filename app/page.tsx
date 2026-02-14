"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Users,
  UserPlus,
  Clock,
  CheckCircle2,
  TrendingUp,
} from "lucide-react"

export default function DashboardPage() {
  // Mock data for the dashboard
  const stats = [
    {
      title: "Total Leads",
      value: "1,248",
      description: "+180 from last month",
      icon: Users,
    },
    {
      title: "New Leads",
      value: "45",
      description: "+12 since last week",
      icon: UserPlus,
    },
    {
      title: "Pending Follow-ups",
      value: "12",
      description: "Requires attention",
      icon: Clock,
    },
    {
      title: "Converted",
      value: "284",
      description: "+8% conversion rate",
      icon: CheckCircle2,
    },
  ]

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
            <div className="space-y-8">
              {/* Mock Recent Activity Items */}
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Called Lead #{100 + i}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {i * 15} minutes ago
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    Called
                  </div>
                </div>
              ))}
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
