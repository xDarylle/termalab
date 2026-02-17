import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"


export const Container = ({ children, className, ...props }: ComponentProps<"div">) => {
  return (
    <div className={cn("w-full bg-card p-5 rounded-xl border border-border shadow", className)} {...props}>{children}</div>
  )
}
