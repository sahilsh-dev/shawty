"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BarChart3, Link2, LogOut, Menu, PieChart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"
import { isAuthenticated, removeToken, isTokenExpired } from "@/lib/auth"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()
  const { toast } = useToast()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    // Check if token is expired
    if (isTokenExpired()) {
      removeToken()
      toast({
        title: "Session expired",
        description: "Your session has expired. Please log in again.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }
  }, [router, toast])

  const handleLogout = () => {
    removeToken()
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })
    router.push("/login")
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-56 pt-12">
            <nav className="grid gap-2">
              <Button variant="ghost" className="justify-start" asChild>
                <a href="/dashboard">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Dashboard
                </a>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <a href="/dashboard/analytics">
                  <PieChart className="mr-2 h-4 w-4" />
                  Analytics
                </a>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <Link2 className="h-6 w-6" />
          <span className="text-lg font-semibold">Shawty</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-56 flex-col border-r bg-background md:flex">
          <nav className="grid gap-2 p-4">
            <Button variant="ghost" className="justify-start" asChild>
              <a href="/dashboard">
                <BarChart3 className="mr-2 h-4 w-4" />
                Dashboard
              </a>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <a href="/dashboard/analytics">
                <PieChart className="mr-2 h-4 w-4" />
                Analytics
              </a>
            </Button>
          </nav>
        </aside>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
