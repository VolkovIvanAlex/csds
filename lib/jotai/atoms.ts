import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

// Types
export type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  organization: string
  jobTitle: string
  avatar: string
}

export type AuthState = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Initial auth state
const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

// Persist auth state in localStorage
export const authStateAtom = atomWithStorage<AuthState>("cybershield_auth", initialAuthState)

// Loading state atom
export const loadingAtom = atom<boolean>(false)

// Error message atom
export const errorAtom = atom<string | null>(null)

// Current view/page atom
export const currentViewAtom = atom<string>("dashboard")

// Search query atom
export const searchQueryAtom = atom<string>("")

// Filter atoms
export const severityFilterAtom = atom<string | null>(null)
export const typeFilterAtom = atom<string | null>(null)
export const dateRangeFilterAtom = atom<{ start: Date | null; end: Date | null }>({
  start: null,
  end: null,
})

// Theme atom (light/dark)
export const themeAtom = atomWithStorage<"light" | "dark" | "system">("cybershield_theme", "system")

// Sidebar state atom
export const sidebarOpenAtom = atomWithStorage<boolean>("cybershield_sidebar", true)

// Mobile menu state atom
export const mobileMenuOpenAtom = atom<boolean>(false)

// Notification count atom
export const notificationCountAtom = atom<number>(3)

// Derived atoms
export const userDisplayNameAtom = atom<string>((get) => {
  const auth = get(authStateAtom)
  if (auth.user) {
    return `${auth.user.firstName} ${auth.user.lastName}`
  }
  return "Guest User"
})

export const userInitialsAtom = atom<string>((get) => {
  const auth = get(authStateAtom)
  if (auth.user) {
    return `${auth.user.firstName.charAt(0)}${auth.user.lastName.charAt(0)}`
  }
  return "GU"
})

export const userRoleAtom = atom<string>((get) => {
  const auth = get(authStateAtom)
  return auth.user?.role || "guest"
})
