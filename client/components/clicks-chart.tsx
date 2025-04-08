"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { ClickData } from "@/lib/types"

interface ClicksChartProps {
  data: ClickData[]
}

export function ClicksChart({ data }: ClicksChartProps) {
  return (
    <ChartContainer
      config={{
        clicks: {
          label: "Clicks",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={10} tickFormatter={(value) => value.toString()} />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(label) =>
                  new Date(label).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })
                }
              />
            }
          />
          <Line
            type="monotone"
            dataKey="clicks"
            strokeWidth={2}
            activeDot={{
              r: 6,
              style: { fill: "var(--color-clicks)", opacity: 0.8 },
            }}
            style={{
              stroke: "var(--color-clicks)",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
