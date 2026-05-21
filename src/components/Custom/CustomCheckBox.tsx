"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomLabel } from "./CustomLabel";

type CheckboxVariant = "default" | "primary" | "secondary" | "accent";

interface CustomCheckBoxContextValue {
  id: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  variant: CheckboxVariant;
}

const CustomCheckBoxContext = React.createContext<
  CustomCheckBoxContextValue | undefined
>(undefined);

function useCustomCheckBoxContext() {
  const context = React.useContext(CustomCheckBoxContext);
  if (!context) {
    throw new Error(
      "CustomCheckBox compound components must be used within CustomCheckBox.Root"
    );
  }
  return context;
}

interface RootProps {
  children: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  variant?: CheckboxVariant;
}

function Root({
  children,
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  className,
  id: providedId,
  variant = "default",
}: RootProps) {
  const generatedId = React.useId();
  const id = providedId || generatedId;

  const [uncontrolledChecked, setUncontrolledChecked] =
    React.useState(defaultChecked);

  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : uncontrolledChecked;

  const handleCheckedChange = React.useCallback(
    (newChecked: boolean) => {
      if (!isControlled) {
        setUncontrolledChecked(newChecked);
      }
      onCheckedChange?.(newChecked);
    },
    [isControlled, onCheckedChange]
  );

  const contextValue = React.useMemo(
    () => ({
      id,
      checked,
      onCheckedChange: handleCheckedChange,
      disabled,
      variant,
    }),
    [id, checked, handleCheckedChange, disabled, variant]
  );

  return (
    <CustomCheckBoxContext.Provider value={contextValue}>
      <div className={cn("flex items-center gap-2", className)}>{children}</div>
    </CustomCheckBoxContext.Provider>
  );
}

interface CheckboxSubComponentProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    "checked" | "onCheckedChange" | "disabled" | "id"
  > {}

function CheckboxSubComponent({
  className,
  ...props
}: CheckboxSubComponentProps) {
  const { id, checked, onCheckedChange, disabled, variant } =
    useCustomCheckBoxContext();

  return (
    <CheckboxPrimitive.Root
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={cn(
        "peer h-5 w-5 shrink-0 rounded-md border-2 transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:border-transparent",
        variant === "default" &&
          "border-border data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground focus-visible:ring-ring",
        variant === "primary" &&
          "border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground focus-visible:ring-primary/30",
        variant === "secondary" &&
          "border-secondary/50 data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground focus-visible:ring-secondary/30",
        variant === "accent" &&
          "border-accent/50 data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground focus-visible:ring-accent/30",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
      >
        <Check className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

interface LabelProps extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'htmlFor'> {
  children: React.ReactNode;
  variant?: "default" | "primary" | "secondary" | "muted" | "accent" | "destructive";
  size?: "sm" | "default" | "lg" | "xl";
  weight?: "normal" | "medium" | "semibold" | "bold";
  required?: boolean;
}

function Label({ 
  children, 
  className, 
  variant,
  size,
  weight,
  required,
  ...props 
}: LabelProps) {
  const { id, disabled, variant: checkboxVariant } = useCustomCheckBoxContext();

  // Map checkbox variant to label variant if not explicitly provided
  const labelVariant = variant || (checkboxVariant === "default" ? "default" : checkboxVariant as any);

  return (
    <CustomLabel
      htmlFor={id}
      variant={labelVariant}
      size={size}
      weight={weight}
      required={required}
      className={cn(
        "cursor-pointer select-none",
        disabled && "cursor-not-allowed opacity-70",
        className
      )}
      {...props}
    >
      {children}
    </CustomLabel>
  );
}

export const CustomCheckBox = {
  Root,
  Checkbox: CheckboxSubComponent,
  Label,
};
