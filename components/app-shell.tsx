"use client"

import type * as React from "react"
import { SidebarProvider } from "@/components/sidebar-context"
import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/topbar"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-dvh overflow-hidden bg-background text-foreground">
        {/* Left Sidebar */}
        <AppSidebar />

        {/* Right column */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Sticky topbar handled inside Topbar */}
          <Topbar />
          {/* Scrollable content area */}
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default AppShell
