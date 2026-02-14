"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { useMediaQuery } from "@/hooks/use-media-query"

interface LeadsBarChartProps {
    data: {
        name: string
        value: number
    }[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

export function LeadsBarChart({ data }: LeadsBarChartProps) {
    const isMobile = useMediaQuery("(max-width: 768px)")

    if (data.every(d => d.value === 0)) {
        return (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                <p>No data available</p>
            </div>
        )
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={data}
                margin={isMobile ? { top: 0, right: 0, bottom: 0, left: -20 } : { top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => isMobile ? value.slice(0, 3) : value}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                    cursor={{ fill: 'transparent' }}
                    content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                            return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                            {label}
                                        </span>
                                        <span className="font-bold text-sm">
                                            {payload[0].value} Leads
                                        </span>
                                    </div>
                                </div>
                            )
                        }
                        return null
                    }}
                />
                <Bar
                    dataKey="value"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                >
                    {/* We can map colors to cells if we want specific colors per stage, 
                      or just use primary color for uniformity. Since pie chart uses colors, 
                      maybe stick to primary here or matching colors?
                      Let's stick to theme primary for bar chart for now as it looks cleaner in bar form,
                      or we can color code them. Let's use primary.
                   */}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}
