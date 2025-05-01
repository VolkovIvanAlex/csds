"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  FileText,
  Home,
  Shield,
  User,
  X,
  Settings,
  Bell,
  Share2,
  Globe,
  Building,
  PlusCircle,
  FilePlus,
} from "lucide-react"
import { useAtom } from "jotai"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { sidebarOpenAtom, authStateAtom } from "@/lib/jotai/atoms"

interface SidebarItemProps {
  href: string
  icon: React.ElementType
  title: string
  requiresAuth?: boolean
}

function SidebarItem({ href, icon: Icon, title, requiresAuth = true }: SidebarItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href
  const [authState] = useAtom(authStateAtom)

  // Don't render auth-required items if not authenticated
  if (requiresAuth && !authState.isAuthenticated) {
    return null
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{title}</span>
    </Link>
  )
}

export function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom)
  const [authState] = useAtom(authStateAtom)

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
        )}
      >
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Shield className="h-6 w-6 text-primary" />
            <span>CyberShield</span>
          </Link>
          <Button variant="ghost" size="icon" className="ml-auto md:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        <ScrollArea className="flex-1 px-2 py-4">
          <nav className="flex flex-col gap-1">
            <SidebarItem href="/public-dashboard" icon={Globe} title="Public Dashboard" requiresAuth={false} />

            {authState.isAuthenticated && (
              <>
                <SidebarItem href="/dashboard" icon={Home} title="Dashboard" />

                {/* Reports section */}
                <div className="mt-6 px-3 py-2">
                  <h3 className="mb-2 text-xs font-semibold text-muted-foreground">REPORTS</h3>
                  <div className="space-y-1">
                    <SidebarItem href="/dashboard/reports" icon={FileText} title="All Reports" />
                    <SidebarItem href="/dashboard/reports/new" icon={FilePlus} title="Create Report" />
                    <SidebarItem href="/dashboard/shared" icon={Share2} title="Shared Reports" />
                  </div>
                </div>

                {/* Organizations section */}
                <div className="mt-4 px-3 py-2">
                  <h3 className="mb-2 text-xs font-semibold text-muted-foreground">ORGANIZATIONS</h3>
                  <div className="space-y-1">
                    <SidebarItem href="/dashboard/organizations" icon={Building} title="All Organizations" />
                    <SidebarItem href="/dashboard/organizations/new" icon={PlusCircle} title="Create Organization" />
                  </div>
                </div>

                <div className="mt-4 px-3 py-2">
                  <h3 className="mb-2 text-xs font-semibold text-muted-foreground">ANALYSIS</h3>
                  <div className="space-y-1">
                    <SidebarItem href="/dashboard/analytics" icon={BarChart3} title="Analytics" />
                    <SidebarItem href="/dashboard/notifications" icon={Bell} title="Notifications" />
                  </div>
                </div>

                <div className="mt-4 px-3 py-2">
                  <h3 className="mb-2 text-xs font-semibold text-muted-foreground">ACCOUNT</h3>
                  <div className="space-y-1">
                    <SidebarItem href="/dashboard/profile" icon={User} title="Profile" />
                    <SidebarItem href="/dashboard/settings" icon={Settings} title="Settings" />
                  </div>
                </div>
              </>
            )}

            {!authState.isAuthenticated && (
              <>
                <div className="mt-6 px-3 py-2">
                  <h3 className="mb-2 text-xs font-semibold text-muted-foreground">ACCOUNT</h3>
                  <div className="space-y-1">
                    <Link
                      href="/login"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent text-muted-foreground"
                    >
                      <User className="h-5 w-5" />
                      <span>Login</span>
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent text-muted-foreground"
                    >
                      <Shield className="h-5 w-5" />
                      <span>Register</span>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </nav>
        </ScrollArea>
      </aside>
    </>
  )
}
