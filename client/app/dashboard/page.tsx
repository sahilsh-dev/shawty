"use client"

import { useState, useEffect } from "react"
import { Calendar, ExternalLink, Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { fetchUrlData } from "@/lib/api"
import type { UrlData } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [urlData, setUrlData] = useState<UrlData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  const itemsPerPage = 10

  // Fetch URL data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const urlsData: any[] = await fetchUrlData()
        if (urlsData) {
          const transformedUrlsData = urlsData.map((item) => ({
            id: item._id,
            originalUrl: item.original,
            shortUrl: `${API_URL}/${item.short}`,
            totalClicks: item.clicks,
            createdAt: item.createdAt,
            isExpired: false
          }))
          setUrlData(transformedUrlsData);
        } else {
          toast({
            title: "Error",
            description: "Failed to load URL data",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching URL data:", error)
        toast({
          title: "Error",
          description: "Failed to load URL data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [toast])

  const filteredData = urlData.filter(
    (url) =>
      url.originalUrl?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      url.shortUrl?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Stats
  const totalUrls = urlData.length
  const totalClicks = urlData.reduce((acc, url) => acc + url.totalClicks, 0)
  const activeUrls = urlData.filter((url) => !url.isExpired).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage and analyze your shortened URLs</p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total URLs</CardDescription>
            <CardTitle className="text-3xl">{totalUrls}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Clicks</CardDescription>
            <CardTitle className="text-3xl">{totalClicks}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active URLs</CardDescription>
            <CardTitle className="text-3xl">{activeUrls}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* URL Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your URLs</CardTitle>
          <CardDescription>Manage and track all your shortened URLs</CardDescription>
          <div className="mt-4 flex w-full items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search URLs..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Original URL</TableHead>
                    <TableHead>Short URL</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((url) => (
                    <TableRow key={url.id}>
                      <TableCell className="max-w-[200px] truncate font-medium">{url.originalUrl}</TableCell>
                      <TableCell>{url.shortUrl}</TableCell>
                      <TableCell className="text-right">{url.totalClicks}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {url.createdAt}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={url.isExpired ? "destructive" : "default"}>
                          {url.isExpired ? "Expired" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <a href={url.originalUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">Open original URL</span>
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginatedData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No URLs found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {filteredData.length > 0 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            if (currentPage > 1) setCurrentPage(currentPage - 1)
                          }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>

                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        const pageNumber = i + 1
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                setCurrentPage(pageNumber)
                              }}
                              isActive={currentPage === pageNumber}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      })}

                      {totalPages > 5 && (
                        <>
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                setCurrentPage(totalPages)
                              }}
                              isActive={currentPage === totalPages}
                            >
                              {totalPages}
                            </PaginationLink>
                          </PaginationItem>
                        </>
                      )}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                          }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
