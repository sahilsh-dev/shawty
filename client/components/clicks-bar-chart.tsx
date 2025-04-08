"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { ClickData } from "@/lib/types"

interface ClicksBarChartProps {
  data: ClickData[]
}

export function ClicksBarChart({ data }: ClicksBarChartProps) {
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
        <BarChart
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
          <Bar
            dataKey="clicks"
            radius={[4, 4, 0, 0]}
            style={{
              fill: "var(--color-clicks)",
              opacity: 0.8,
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
