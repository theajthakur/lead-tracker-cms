"use client"

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"

import { useMediaQuery } from "@/hooks/use-media-query"

interface LeadsLineChartProps {
    data: {
        date: string
        total: number
        stage1: number
        stage2: number
        stage3: number
    }[]
    labels: string[]
}

const COLORS = {
    total: "#888888",
    stage1: "#0088FE",
    stage2: "#00C49F",
    stage3: "#FFBB28",
}

export function LeadsLineChart({ data, labels }: LeadsLineChartProps) {
    const isMobile = useMediaQuery("(max-width: 768px)")

    if (data.every(d => d.total === 0)) {
        return (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                <p>No recent activity</p>
            </div>
        )
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart
                data={data}
                margin={{
                    top: 5,
                    right: isMobile ? 10 : 30,
                    left: isMobile ? -10 : 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                    dataKey="date"
                    stroke="#888888"
                    fontSize={isMobile ? 10 : 12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => isMobile ? value.slice(0, 3) : value}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={isMobile ? 10 : 12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                    width={isMobile ? 30 : 40}
                />
                <Tooltip
                    content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                            return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <div className="mb-2 text-sm font-medium text-foreground">{label}</div>
                                    <div className="flex flex-col gap-1">
                                        {payload.map((entry: any, index: number) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <div
                                                    className="h-2 w-2 rounded-full"
                                                    style={{ backgroundColor: entry.color }}
                                                />
                                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                    {entry.name}:
                                                </span>
                                                <span className="font-bold text-sm">
                                                    {entry.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        }
                        return null
                    }}
                />
                <Legend verticalAlign="top" height={36} />

                {/* Total Line */}
                <Line
                    type="monotone"
                    dataKey="total"
                    name="Total"
                    stroke={COLORS.total}
                    strokeWidth={2}
                    dot={false}
                />

                {/* Stage 1 Line */}
                <Line
                    type="monotone"
                    dataKey="stage1"
                    name={labels[0]}
                    stroke={COLORS.stage1}
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                />

                {/* Stage 2 Line */}
                <Line
                    type="monotone"
                    dataKey="stage2"
                    name={labels[1]}
                    stroke={COLORS.stage2}
                    strokeWidth={2}
                />

                {/* Stage 3 Line */}
                <Line
                    type="monotone"
                    dataKey="stage3"
                    name={labels[2]}
                    stroke={COLORS.stage3}
                    strokeWidth={2}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}
