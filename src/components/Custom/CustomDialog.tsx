"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CustomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

export function CustomDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  showCloseButton = true,
}: CustomDialogProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent
          dir="rtl"
          className={cn(
            "rounded-t-2xl rounded-b-none",
            // Keep the drawer clear of the floating glass tabbar
            // (bottom-6 offset + h-16 height + breathing room).
            // "data-[swipe-direction=down]:bottom-24",
            // "[--drawer-content-max-height:calc(100dvh-8rem-7rem)]",
            "p-0 gap-0",
            "bg-card text-card-foreground",
            "border border-border",
            "shadow-lg",
            "[&::-webkit-scrollbar]:w-1.5",
            "[&::-webkit-scrollbar-track]:bg-transparent",
            "[&::-webkit-scrollbar-thumb]:bg-transparent",
            "[&::-webkit-scrollbar-thumb]:rounded-full",
            "[&:hover::-webkit-scrollbar-thumb]:bg-gray-300",
            "[&:hover::-webkit-scrollbar-thumb]:hover:bg-gray-400",
            "scrollbar-width: thin",
            "scrollbar-color: transparent transparent",
            "hover:scrollbar-color: #d1d5db transparent",
            className,
          )}
        >
          {showCloseButton && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-2 z-10 rounded-full text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          <div className="p-6 overflow-y-auto">
            <DrawerHeader className="text-right w-full p-0">
              <DrawerTitle className="text-xl font-bold text-foreground w-full text-right block">
                {title}
              </DrawerTitle>
              {description && (
                <DrawerDescription className="text-sm text-muted-foreground mt-1 text-right w-full block">
                  {description}
                </DrawerDescription>
              )}
            </DrawerHeader>

            <div className="mt-4">{children}</div>
            <div className="h-20"></div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        className={cn(
          "w-[95vw] max-w-md md:max-w-lg lg:max-w-xl rounded-2xl",
          "max-h-[calc(100vh-100px)] overflow-y-auto",
          "my-[50px]",
          "p-0 gap-0",
          "bg-card text-card-foreground",
          "border border-border",
          "shadow-lg",
          // Scrollbar (theme-based)
          "[&::-webkit-scrollbar]:w-1.5",
          "[&::-webkit-scrollbar-track]:bg-transparent",
          "[&::-webkit-scrollbar-thumb]:bg-transparent",
          "[&::-webkit-scrollbar-thumb]:rounded-full",
          "[&:hover::-webkit-scrollbar-thumb]:bg-gray-300",
          "[&:hover::-webkit-scrollbar-thumb]:hover:bg-gray-400",
          "scrollbar-width: thin",
          "scrollbar-color: transparent transparent",
          "hover:scrollbar-color: #d1d5db transparent",
          className,
        )}
      >
        {showCloseButton && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-2 z-10 rounded-full text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <div className="p-6">
          <DialogHeader className="text-right w-full">
            <DialogTitle className="text-xl font-bold text-foreground w-full text-right block">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-sm text-muted-foreground mt-1 text-right w-full block">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="mt-4">{children}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
