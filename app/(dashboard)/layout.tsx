"use client"

import type React from "react"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { SidebarProvider } from "@/components/sidebar-provider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1 md:ml-64">
          {" "}
          {/* Added ml-64 to match sidebar width */}
          <Header />
          <main className="flex-1 overflow-y-auto bg-muted/40 p-4 md:p-6 w-full">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
