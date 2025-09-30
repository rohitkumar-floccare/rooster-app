"use client"

import type * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Keep types simple and robust to version changes
type Props = React.ComponentProps<typeof NextThemesProvider>

export function ThemeProvider({ children, ...props }: Props) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange {...props}>
      {children}
    </NextThemesProvider>
  )
}
