import type { ReactNode } from "react"
import AppShell from "@/components/app-shell"

export default function RulesPoliciesLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>
}
