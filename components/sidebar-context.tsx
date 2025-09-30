"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

type SidebarContextValue = {
  // desktop
  isCollapsed: boolean
  toggleCollapsed: () => void
  setCollapsed: (v: boolean) => void
  // mobile
  isMobileOpen: boolean
  openMobile: () => void
  closeMobile: () => void
  toggleMobile: () => void
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Optional: close mobile drawer on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const value = useMemo<SidebarContextValue>(
    () => ({
      isCollapsed,
      toggleCollapsed: () => setIsCollapsed((v) => !v),
      setCollapsed: setIsCollapsed,
      isMobileOpen,
      openMobile: () => setIsMobileOpen(true),
      closeMobile: () => setIsMobileOpen(false),
      toggleMobile: () => setIsMobileOpen((v) => !v),
    }),
    [isCollapsed, isMobileOpen],
  )

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider")
  return ctx
}
