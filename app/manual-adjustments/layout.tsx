import type React from "react"
import { AppShell } from "@/components/app-shell"

export default function ManualAdjustmentsLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}
