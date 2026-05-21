import { cn } from "@/lib/utils";
import { Input } from "@base-ui/react/input";
import { CustomLabel } from "./CustomLabel";
import React, { useContext } from "react";

type InputVariant = "default" | "primary" | "secondary" | "accent" | "error";
type InputSize = "sm" | "md" | "lg";
type InputIconPosition = "left" | "right";
type InputDir = "rtl" | "ltr";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  inputSize?: InputSize;
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: InputIconPosition;
  dir?: InputDir;
  onEnter?: () => void;
  children?: React.ReactNode;
}

interface CustomInputContextValue {
  inputId: string;
  dir: InputDir;
  isRTL: boolean;
  icon?: React.ReactNode;
  actualIconPosition: InputIconPosition;
  inputSize: InputSize;
  variant: InputVariant;
  error?: string;
  onEnter?: () => void;
  onKeyDown?: React.InputHTMLAttributes<HTMLInputElement>["onKeyDown"];
  className?: string;
  type?: string;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  inputRef: React.ForwardedRef<HTMLInputElement>;
}

const CustomInputContext = React.createContext<CustomInputContextValue | null>(
  null,
);

interface CustomInputLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  variant?: "default" | "primary" | "secondary" | "muted" | "accent" | "destructive";
  size?: "sm" | "default" | "lg" | "xl";
  weight?: "normal" | "medium" | "semibold" | "bold";
  required?: boolean;
}

const CustomInputLabel: React.FC<CustomInputLabelProps> = ({ 
  children, 
  className, 
  variant,
  size,
  weight,
  required,
  ...props 
}) => {
  const context = useContext(CustomInputContext);

  if (!context || !children) {
    return null;
  }

  return (
    <CustomLabel
      htmlFor={context.inputId}
      variant={variant}
      size={size}
      weight={weight}
      required={required}
      className={cn(
        "block",
        context.isRTL ? "text-right" : "text-left",
        className,
      )}
      {...props}
    >
      {children}
    </CustomLabel>
  );
};

CustomInputLabel.displayName = "CustomInput.Label";

interface CustomInputInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
}

const CustomInputInput = React.forwardRef<
  HTMLInputElement,
  CustomInputInputProps
>(({ className, onKeyDown, variant, ...props }, ref) => {
  const context = useContext(CustomInputContext);

  if (!context) {
    return null;
  }

  const {
    inputId,
    dir,
    isRTL,
    icon,
    actualIconPosition,
    inputSize,
    error,
    onEnter,
    onKeyDown: contextOnKeyDown,
    type,
    inputRef,
  } = context;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onEnter) {
      e.preventDefault();
      onEnter();
    }

    contextOnKeyDown?.(e);
    onKeyDown?.(e);
  };

  return (
    <div className="relative">
      {icon && actualIconPosition === "left" && (
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 text-muted-foreground",
            isRTL ? "right-3" : "left-3",
          )}
        >
          {icon}
        </div>
      )}
      <Input
        ref={ref ?? inputRef}
        id={inputId}
        type={props.type ?? type}
        data-slot="input"
        dir={dir}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full rounded-xl border bg-background outline-none transition-all duration-200 ring-0",
          dir === "rtl" ? "text-right" : "text-left",
          icon && actualIconPosition === "left" && (isRTL ? "pr-10" : "pl-10"),
          icon && actualIconPosition === "right" && (isRTL ? "pl-10" : "pr-10"),
          inputSize === "sm" && "h-8 px-2 text-sm",
          inputSize === "md" && "h-10 px-3 text-sm",
          inputSize === "lg" && "h-12 px-4 text-base",
          variant === "default" &&
            "border-border focus:border-primary focus:ring-2 focus:ring-primary/20",
          variant === "primary" &&
            "border-primary focus:border-primary focus:ring-2 focus:ring-primary/30",
          variant === "secondary" &&
            "border-secondary/50 focus:border-secondary focus:ring-2 focus:ring-secondary/30",
          variant === "accent" &&
            "border-accent/50 focus:border-accent focus:ring-2 focus:ring-accent/30",
          variant === "error" &&
            "border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "placeholder:text-muted-foreground",
          error &&
            "border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/30",
          className,
        )}
        {...props}
      />
      {icon && actualIconPosition === "right" && (
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 text-muted-foreground",
            isRTL ? "left-3" : "right-3",
          )}
        >
          {icon}
        </div>
      )}
    </div>
  );
});

CustomInputInput.displayName = "CustomInput.Input";

const CustomInputError: React.FC<
  React.HTMLAttributes<HTMLParagraphElement>
> = ({ children, className, ...props }) => {
  const context = useContext(CustomInputContext);

  if (!context) {
    return null;
  }

  const message = children ?? context.error;

  if (!message) {
    return null;
  }

  return (
    <p
      className={cn("text-sm text-destructive text-right", className)}
      {...props}
    >
      {message}
    </p>
  );
};

CustomInputError.displayName = "CustomInput.Error";

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      className,
      variant = "default",
      inputSize = "md",
      label,
      error,
      icon,
      iconPosition = "left",
      dir = "rtl",
      onEnter,
      onKeyDown,
      type,
      id,
      children,
      ...inputProps
    },
    ref,
  ) => {
    const inputId =
      id || label?.toLowerCase().replace(/\s/g, "-") || "custom-input";
    const isRTL = dir === "rtl";
    const actualIconPosition = isRTL
      ? iconPosition === "left"
        ? "right"
        : "left"
      : iconPosition;

    const hasLabelChild = React.Children.toArray(children).some(
      (child) =>
        React.isValidElement(child) &&
        (child.type === CustomInputLabel ||
          (child.type as any)?.displayName === "CustomInput.Label"),
    );

    const hasErrorChild = React.Children.toArray(children).some(
      (child) =>
        React.isValidElement(child) &&
        (child.type === CustomInputError ||
          (child.type as any)?.displayName === "CustomInput.Error"),
    );

    const contextValue: CustomInputContextValue = {
      inputId,
      dir,
      isRTL,
      icon,
      actualIconPosition,
      inputSize,
      variant,
      error,
      onEnter,
      onKeyDown,
      className,
      type,
      inputProps,
      inputRef: ref,
    };

    return (
      <CustomInputContext.Provider value={contextValue}>
        <div
          className={cn("flex flex-col w-full space-y-1.5", className)}
          dir={dir}
        >
          {label && !hasLabelChild && (
            <CustomInputLabel>{label}</CustomInputLabel>
          )}
          {children ?? <CustomInputInput />}
          {error && !hasErrorChild && <CustomInputError />}
        </div>
      </CustomInputContext.Provider>
    );
  },
);

const CompoundCustomInput = CustomInput as typeof CustomInput & {
  Label: typeof CustomInputLabel;
  Input: typeof CustomInputInput;
  Error: typeof CustomInputError;
};

CompoundCustomInput.Label = CustomInputLabel;
CompoundCustomInput.Input = CustomInputInput;
CompoundCustomInput.Error = CustomInputError;
CustomInput.displayName = "CustomInput";

export default CompoundCustomInput;
