import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  glow?: boolean
  glass?: boolean
}

const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, hover = true, glow = false, glass = false, ...props }, ref) => (
    <Card
      ref={ref}
      className={cn(
        "card-elevated transition-all duration-300",
        hover && "hover:shadow-elegant hover:-translate-y-1",
        glow && "shadow-glow",
        glass && "glass",
        className
      )}
      {...props}
    />
  )
)
EnhancedCard.displayName = "EnhancedCard"

export { EnhancedCard }