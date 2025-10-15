import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

type Density = "normal" | "compact"

const CardCtx = React.createContext<{ density: Density }>({ density: "normal" })
const useCardDensity = () => React.useContext(CardCtx).density

const cardVariants = cva(
  "bg-card text-card-foreground border", // neutral base
  {
    variants: {
      variant: {
        panel: "rounded-xl shadow-sm",
        // rounded like the mock; lighter border; no shadow
        tile: "rounded-[18px] shadow-none",
        plain: "rounded-none border-none shadow-none bg-transparent",
      },
      interactive: {
        true: "transition-shadow hover:shadow-md",
        false: "",
      },
    },
    defaultVariants: {
      variant: "panel",
      interactive: false,
    },
  }
)

type CardProps = React.ComponentProps<"div"> &
  VariantProps<typeof cardVariants> & {
    density?: Density
  }

function Card({
  className,
  variant,
  interactive,
  density = "normal",
  ...props
}: CardProps) {
  return (
    <CardCtx.Provider value={{ density }}>
      <div
        data-slot="card"
        data-variant={variant}
        data-density={density}
        className={cn(
          cardVariants({ variant, interactive }),
          variant === "tile" && "border-neutral-200 dark:border-neutral-800",
          className
        )}
        {...props}
      />
    </CardCtx.Provider>
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  const density = useCardDensity()
  return (
    <div
      data-slot="card-header"
      className={cn(density === "compact" ? "px-4 pt-3" : "px-6 pt-5", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("font-semibold leading-none", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-action" className={cn("ml-auto", className)} {...props} />
}

/* -----------------------------------------------------------
   ONLY CHANGE: make Stat card layout stack on small screens.
   It targets the immediate child that's a
   'div.flex.items-center.justify-between' (your Stat’s wrapper),
   turning it into a column and pushing the right block (icon) down.
   Other cards (e.g., roster header "justify-end") are unaffected.
----------------------------------------------------------- */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  const density = useCardDensity()
  return (
    <div
      data-slot="card-content"
      className={cn(
        density === "compact" ? "px-4 pb-3" : "px-6 pb-5",
        // mobile-only stacking for Stat cards
        "max-sm:[&>div.flex.items-center.justify-between]:flex-col",
        "max-sm:[&>div.flex.items-center.justify-between]:items-start",
        "max-sm:[&>div.flex.items-center.justify-between>div:last-child]:mt-3",
        className
      )}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  const density = useCardDensity()
  return (
    <div
      data-slot="card-footer"
      className={cn(density === "compact" ? "px-4 pt-3" : "px-6 pt-5", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
