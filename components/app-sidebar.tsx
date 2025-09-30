"use client"

import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import {
  CalendarCheck2,
  ClipboardList,
  FileText,
  GitCompare,
  LayoutDashboard,
  Settings2,
  UsersRound,
} from "lucide-react"
import { useSidebar } from "./sidebar-context"

const items = [
  { label: "Roster Overview", icon: LayoutDashboard, href: "/" },
  { label: "Roster Builder", icon: ClipboardList, href: "/roster-builder" },
  { label: "Swap Requests", icon: GitCompare, href: "/swap-requests" },
  { label: "Manual Adjustments", icon: Settings2, href: "/manual-adjustments" },
  { label: "Rules & Policies", icon: FileText, href: "/rules-policies" },
  { label: "Team Manager", icon: UsersRound, href: "/team-manager" },
  { label: "Reports", icon: CalendarCheck2, href: "/reports" },
]

function DesktopSidebar() {
  const { isCollapsed } = useSidebar()
  const widthClass = isCollapsed ? "md:w-[72px]" : "md:w-[240px]"
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "hidden md:block shrink-0 h-dvh border-r bg-card transition-[width] duration-300 ease-in-out",
        widthClass,
      )}
      aria-label="Primary"
    >
      <div className="px-4 py-5 flex items-center gap-3">
        {/* brand icon */}
        <Image
          src="/images/brand-icon.png"
          alt="App logo"
          width={32}
          height={32}
          className="h-8 w-8 rounded-md object-contain ring-1 ring-border"
          priority
        />
        <div className={cn("text-sm transition-opacity duration-200", isCollapsed && "opacity-0 pointer-events-none")}>
          <div className="font-medium">Swap Manager</div>
          <div className="text-muted-foreground">Daily Adjustments</div>
        </div>
        {/* previously a Button with <ChevronsLeftRight /> lived here */}
      </div>
      <nav className="px-2 pb-6">
        <ul className="space-y-1.5">
          {items.map((item) => {
            const Icon = item.icon
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)

            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  aria-label={item.label}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    active ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span
                    className={cn(
                      "transition-all duration-200",
                      isCollapsed
                        ? "max-w-0 overflow-hidden opacity-0 pointer-events-none select-none"
                        : "max-w-[200px] opacity-100",
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

function MobileDrawer() {
  const { isMobileOpen, closeMobile } = useSidebar()
  const pathname = usePathname()

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden",
          isMobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden="true"
        onClick={closeMobile}
      />
      {/* Drawer */}
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 z-50 w-[260px] border-r bg-card p-4 md:hidden transition-transform duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        <div className="mb-4 flex items-center gap-3">
          {/* brand icon */}
          <Image
            src="/images/brand-icon.png"
            alt="App logo"
            width={32}
            height={32}
            className="h-8 w-8 rounded-md object-contain ring-1 ring-border"
            priority
          />
          <div className="text-sm">
            <div className="font-medium">Swap Manager</div>
            <div className="text-muted-foreground">Daily Adjustments</div>
          </div>
        </div>
        <nav className="px-1">
          <ul className="space-y-1.5">
            {items.map((item) => {
              const Icon = item.icon
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={closeMobile}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </>
  )
}

export function AppSidebar() {
  return (
    <>
      {/* Desktop collapsible sidebar */}
      <DesktopSidebar />
      {/* Mobile drawer */}
      <MobileDrawer />
    </>
  )
}
