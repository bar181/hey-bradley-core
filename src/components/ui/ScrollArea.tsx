// P122 / W4 — shadcn ScrollArea primitive backed by @base-ui/react.
// Pattern follows the project's existing base-nova shadcn convention
// (see button.tsx, accordion.tsx, switch.tsx — all wrap @base-ui/react/*).
// Used for builder left-panel vertical scroll containment + chat-toolbar
// horizontal scroll fallback per ADR target.
import * as React from "react"
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area"

import { cn } from "@/lib/utils"

type ScrollAreaProps = React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
  type?: "vertical" | "horizontal" | "both"
  viewportClassName?: string
}

function ScrollArea({
  className,
  viewportClassName,
  type = "vertical",
  children,
  ...props
}: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className={cn(
          "size-full focus-visible:outline-none",
          // Vertical-only: prevent horizontal pan/scroll bleed
          type === "vertical" && "overflow-x-hidden",
          type === "horizontal" && "overflow-y-hidden",
          viewportClassName,
        )}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      {(type === "vertical" || type === "both") && <ScrollBar orientation="vertical" />}
      {(type === "horizontal" || type === "both") && <ScrollBar orientation="horizontal" />}
      {type === "both" && <ScrollAreaPrimitive.Corner />}
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Scrollbar>) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none select-none transition-colors",
        orientation === "vertical" && "h-full w-1.5 border-l border-l-transparent p-px",
        orientation === "horizontal" && "h-1.5 flex-col border-t border-t-transparent p-px",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-full bg-[var(--hb-border)] hover:bg-[var(--hb-text-muted)] transition-colors"
      />
    </ScrollAreaPrimitive.Scrollbar>
  )
}

export { ScrollArea, ScrollBar }
