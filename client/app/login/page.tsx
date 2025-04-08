"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Link2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // For debugging
  useEffect(() => {
    console.log("Login page mounted")
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login attempt with:", { email, password })

    setIsLoading(true)

    // Hardcoded credentials check - using exact string comparison
    if (email === "intern@dacoid.com" && password === "Test123") {
      console.log("Credentials match")

      try {
        // Create a simple JWT token
        const token = btoa(JSON.stringify({ email, exp: Date.now() + 24 * 60 * 60 * 1000 }))
        console.log("Token created")

        // Store token in localStorage
        localStorage.setItem("auth_token", token)
        console.log("Token stored in localStorage")

        toast({
          title: "Login successful",
          description: "Welcome to Shawty dashboard",
        })

        console.log("Redirecting to dashboard...")
        // Use direct window location change
        window.location.href = "/dashboard"
      } catch (error) {
        console.error("Error during login:", error)
        toast({
          title: "Login error",
          description: "An error occurred during login",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    } else {
      console.log("Credentials do not match")
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  // Pre-fill credentials for demo purposes
  useEffect(() => {
    setEmail("intern@dacoid.com")
    setPassword("Test123")
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-6">
            <Link2 className="h-10 w-10 text-primary" />
            <span className="ml-2 text-2xl font-bold">Shawty</span>
          </div>
          <CardTitle className="text-2xl text-center">Login to Dashboard</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access the analytics</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="intern@dacoid.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Test123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            {/* Direct link as fallback */}
            <div className="text-sm text-center text-muted-foreground">
              Or
              <a
                href="/dashboard"
                className="ml-1 text-primary hover:underline"
                onClick={(e) => {
                  e.preventDefault()
                  const token = btoa(
                    JSON.stringify({ email: "intern@dacoid.com", exp: Date.now() + 24 * 60 * 60 * 1000 }),
                  )
                  localStorage.setItem("auth_token", token)
                  window.location.href = "/dashboard"
                }}
              >
                click here to enter
              </a>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
