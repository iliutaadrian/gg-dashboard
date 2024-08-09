"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AreaChartIcon } from "lucide-react"
import { Build } from "@/lib/db"
import { BuildFull } from "@/types"

const chartConfig = {
  failed: {
    label: "Failed",
    color: "hsl(var(--chart-3))",
  },

} satisfies ChartConfig

interface Props {
  builds: BuildFull[]
}

export function Analytics({ builds }: Props) {
  const [timeRange, setTimeRange] = React.useState("7d")
  const chartData = builds.map((b) => ({ date: b.dateBuild, failed: b.number_of_failures, builds: b.build }))

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const now = new Date()
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    now.setDate(now.getDate() - daysToSubtract)
    return date >= now
  })

  return (
    <Card className="shadow-neon border-muted-foreground bg-primary/5 pb-1">
      <CardHeader >
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>
            <div className="flex items-center gap-5">
              <div className="w-10 h-10 rounded-full border-2 border-primary flex justify-center items-center">
                <p>
                  <AreaChartIcon />
                </p>
              </div>
              Analytics
            </div>
          </CardTitle>
          <CardDescription>
            Analytics with builds number and failed tests
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[180px] rounded-md sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="360d" className="rounded-lg">
              Last Year
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillFailed" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-failed)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-failed)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />

            <ChartTooltip
              cursor={true}
              content={
                <ChartTooltipContent
                  labelFormatter={(value, payload) => {
                    const date = new Date(value).toLocaleDateString("ro-Ro");
                    const build = payload && payload[0] ? payload[0].payload.builds : "";
                    const failed = payload && payload[0] ? payload[0].payload.failed : "";
                    return `${date} #${build}`;
                  }}
                  indicator="dot"
                />
              }
            />

            <Area
              dataKey="failed"
              type="natural"
              fill="url(#fillFailed)"
              stroke="var(--color-failed)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

