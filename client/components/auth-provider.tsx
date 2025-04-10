"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { isAuthenticated, isTokenExpired, removeToken } from "@/lib/auth"

interface AuthContextType {
  isLoggedIn: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check authentication status on mount and when localStorage changes
    const checkAuth = () => {
      const authenticated = isAuthenticated()
      setIsLoggedIn(authenticated)

      if (authenticated && isTokenExpired()) {
        // Token is expired, log the user out
        logout()
        toast({
          title: "Session expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        })
      }
    }

    checkAuth()

    // Listen for storage events (in case token is changed in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_token") {
        checkAuth()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [router, toast])

  const logout = () => {
    removeToken()
    setIsLoggedIn(false)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ isLoggedIn, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
