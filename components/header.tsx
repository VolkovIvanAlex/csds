"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, Menu, Plus, Search } from "lucide-react"
import { useAtom, useSetAtom } from "jotai"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { sidebarOpenAtom } from "@/lib/jotai/atoms/atoms"
import { authStateAtom } from "@/lib/jotai/atoms/authState"
import { logoutAtom } from "@/lib/jotai/auth-actions"
import { useLogout } from "@privy-io/react-auth"

export function Header() {
  const router = useRouter()
  const [, setSidebarOpen] = useAtom(sidebarOpenAtom)
  const [authState, setAuthState] = useAtom(authStateAtom)
  const { logout: privyLogout } = useLogout();
  const logout = useSetAtom(logoutAtom);

  console.log(authState);

  const handleLogout = async () => {
    logout()
    await privyLogout();
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>

      <div className="flex items-center gap-2">
        {authState.isAuthenticated && (
          <>
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
          {authState.user?.role}
          </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Plus className="h-5 w-5" />
                  <span className="sr-only">Create New</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Create New</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/reports/new">New Report</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/organizations/new">New Organization</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <Link href="/dashboard/notifications">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={authState.user?.avatar || "/avatars/default-avatar.png"} alt="User" />
                    <AvatarFallback>{authState.user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}

        {!authState.isAuthenticated && (
          <Button size="sm" asChild>
            <Link href="/login">Login</Link>
          </Button>
        )}
      </div>
    </header>
  )
}
