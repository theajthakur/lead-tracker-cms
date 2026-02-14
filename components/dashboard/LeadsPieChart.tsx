"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent } from "@/components/ui/card"

import { useMediaQuery } from "@/hooks/use-media-query"

interface LeadsPieChartProps {
    data: {
        name: string
        value: number
    }[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

export function LeadsPieChart({ data }: LeadsPieChartProps) {
    const isMobile = useMediaQuery("(max-width: 768px)")

    if (data.every(d => d.value === 0)) {
        return (
            <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                <p>No data available</p>
            </div>
        )
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart margin={isMobile ? { top: 0, right: 0, bottom: 0, left: 0 } : undefined}>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={isMobile ? 50 : 60}
                    outerRadius={isMobile ? 70 : 80}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            const dataItem = payload[0].payload;
                            const total = data.reduce((acc, current) => acc + current.value, 0);
                            const percentage = total > 0 ? ((dataItem.value / total) * 100).toFixed(1) : 0;

                            return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="h-2 w-2 rounded-full"
                                                style={{ backgroundColor: payload[0].color }}
                                            />
                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                {dataItem.name}
                                            </span>
                                        </div>
                                        <div className="flex items-baseline gap-2 font-bold">
                                            {dataItem.value}
                                            <span className="text-[0.70rem] text-muted-foreground font-normal">
                                                ({percentage}%)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    }}
                />
                <Legend
                    layout={isMobile ? "horizontal" : "vertical"}
                    verticalAlign={isMobile ? "bottom" : "middle"}
                    align={isMobile ? "center" : "right"}
                    wrapperStyle={isMobile ? { paddingTop: "20px" } : undefined}
                    formatter={(value: string, entry: any) => {
                        const { payload } = entry;
                        const total = data.reduce((acc, current) => acc + current.value, 0);
                        const percentage = total > 0 ? ((payload.value / total) * 100).toFixed(0) : 0;
                        return <span className="text-sm text-muted-foreground ml-2">{value} ({percentage}%)</span>
                    }}
                />
            </PieChart>
        </ResponsiveContainer>
    )
}
