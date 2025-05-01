"use client"

import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { PublicHeader } from "@/components/public-header"
import { sidebarOpenAtom } from "@/lib/jotai/atoms"
import { useAtom } from "jotai"

export default function PublicDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen] = useAtom(sidebarOpenAtom)

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${sidebarOpen ? "md:ml-64" : "ml-0"}`}
        style={{ width: sidebarOpen ? "calc(100% - 16rem)" : "100%", marginLeft: sidebarOpen ? "16rem" : "0" }}
      >
        <PublicHeader />
        <main className="flex-1 overflow-y-auto bg-muted/40 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
