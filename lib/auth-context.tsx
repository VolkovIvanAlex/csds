"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
  avatar?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      // In a real app, this would check a token in localStorage or cookies
      const storedUser = localStorage.getItem("cybershield_user")

      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [])

  // Redirect based on auth status and current route
  useEffect(() => {
    if (!isLoading) {
      const isAuthRoute = pathname?.includes("/(auth)") || pathname === "/login" || pathname === "/register"

      if (!user && !isAuthRoute && pathname !== "/") {
        // Not logged in and trying to access protected route
        router.push("/login")
      } else if (user && isAuthRoute) {
        // Logged in but on auth route
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, pathname, router])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    try {
      // Mock login - in a real app, this would call an API
      // For demo purposes, we'll just create a mock user
      const mockUser = {
        id: "user-1",
        name: email.split("@")[0],
        email,
        avatar: "/vibrant-street-market.png",
      }

      // Store user in localStorage
      localStorage.setItem("cybershield_user", JSON.stringify(mockUser))
      setUser(mockUser)

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Remove user from localStorage
    localStorage.removeItem("cybershield_user")
    setUser(null)

    // Redirect to login
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
