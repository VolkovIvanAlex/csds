import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

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
