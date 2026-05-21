import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const customLabelVariants = cva(
  "font-medium leading-none transition-colors",
  {
    variants: {
      variant: {
        default: "text-foreground",
        primary: "text-[var(--primary)]",
        secondary: "text-[var(--secondary-foreground)]",
        muted: "text-muted-foreground",
        accent: "text-[var(--accent-foreground)]",
        destructive: "text-destructive",
      },
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
        xl: "text-lg",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      weight: "medium",
    },
  }
)

export interface CustomLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof customLabelVariants> {
  required?: boolean
}

const CustomLabel = React.forwardRef<HTMLLabelElement, CustomLabelProps>(
  ({ className, variant, size, weight, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          customLabelVariants({ variant, size, weight }),
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
    )
  }
)

CustomLabel.displayName = "CustomLabel"

export { CustomLabel, customLabelVariants }
