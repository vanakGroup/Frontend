import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="top-center"
      dir="rtl"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:!bg-white group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:rounded-2xl group-[.toaster]:shadow-lg group-[.toaster]:font-sans",
          success: "group-[.toaster]:border-green-500",
          error: "group-[.toaster]:border-destructive",
          warning: "group-[.toaster]:border-amber-500",
          info: "group-[.toaster]:border-primary",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
