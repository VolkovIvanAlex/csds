import { cn } from "@/lib/utils"

export function Spinner({ className }) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-muted-foreground border-t-transparent h-4 w-4",
        className
      )}
    />
  )
}