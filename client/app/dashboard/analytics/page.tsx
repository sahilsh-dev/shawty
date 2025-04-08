"use client"

import { useState } from "react"
import { Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockUrlData, mockClicksData } from "@/lib/mock-data"
import { ClicksChart } from "@/components/clicks-chart"
import { ClicksBarChart } from "@/components/clicks-bar-chart"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d")
  const [selectedUrl, setSelectedUrl] = useState("all")

  // Filter data based on selected URL
  const filteredData =
    selectedUrl === "all" ? mockClicksData : mockClicksData.filter((item) => item.urlId === selectedUrl)

  // Calculate total clicks
  const totalClicks = filteredData.reduce((sum, item) => sum + item.clicks, 0)

  // Get top performing URLs
  const topUrls = [...mockUrlData].sort((a, b) => b.totalClicks - a.totalClicks).slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Visualize and analyze your URL performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>Date Range</span>
          </Button>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="h-8 w-[150px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* URL Selector */}
      <Card>
        <CardHeader>
          <CardTitle>URL Performance</CardTitle>
          <CardDescription>Select a URL to view detailed analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedUrl} onValueChange={setSelectedUrl}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a URL" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All URLs</SelectItem>
              {mockUrlData.map((url) => (
                <SelectItem key={url.id} value={url.id}>
                  {url.shortUrl} ({url.totalClicks} clicks)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Clicks Over Time</CardTitle>
            <CardDescription>
              {selectedUrl === "all"
                ? "Total clicks across all URLs"
                : `Clicks for ${mockUrlData.find((url) => url.id === selectedUrl)?.shortUrl}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Tabs defaultValue="line">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="line">Line Chart</TabsTrigger>
                  <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                </TabsList>
                <div className="text-sm font-medium">
                  Total Clicks: <span className="text-primary">{totalClicks}</span>
                </div>
              </div>
              <TabsContent value="line" className="h-[250px] mt-4">
                <ClicksChart data={filteredData} />
              </TabsContent>
              <TabsContent value="bar" className="h-[250px] mt-4">
                <ClicksBarChart data={filteredData} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing URLs */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing URLs</CardTitle>
          <CardDescription>Your most clicked shortened URLs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topUrls.map((url, index) => (
              <div key={url.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{url.shortUrl}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-[300px]">{url.originalUrl}</div>
                  </div>
                </div>
                <div className="font-medium">{url.totalClicks} clicks</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
