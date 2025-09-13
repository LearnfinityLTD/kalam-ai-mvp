import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";

// Toast variants for styling
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transform data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-green-50 text-green-800 border-green-200",
        destructive:
          "border destructive group-destructive border-red-200 bg-red-50 text-red-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type ToastProps = React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
  VariantProps<typeof toastVariants> & {
    title?: string;
    description?: string;
  };

// Toast provider with root-level context
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ToastPrimitives.Provider>
      {children}
      <ToastPrimitives.Viewport
        className="fixed bottom-0 right-0 z-[100] flex max-w-[400px] flex-col gap-2 p-4 sm:bottom-4 sm:right-4"
        dir="rtl"
      />
    </ToastPrimitives.Provider>
  );
};

// Toast component
const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  ToastProps
>(({ className, variant, title, description, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={toastVariants({ variant, className })}
      {...props}
    >
      <div className="grid gap-1">
        {title && (
          <ToastPrimitives.Title className="text-sm font-semibold">
            {title}
          </ToastPrimitives.Title>
        )}
        {description && (
          <ToastPrimitives.Description className="text-sm opacity-90">
            {description}
          </ToastPrimitives.Description>
        )}
      </div>
      <ToastPrimitives.Close
        className="absolute right-2 top-2 rounded-md p-1 text-green-800/50 opacity-0 transition-opacity hover:text-green-800 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-800/50 group-[.destructive]:hover:text-red-800"
        aria-label="إغلاق"
      >
        <span aria-hidden>×</span>
      </ToastPrimitives.Close>
    </ToastPrimitives.Root>
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

// useToast hook
export function useToast() {
  const [open, setOpen] = React.useState(false);
  const [toastProps, setToastProps] = React.useState<ToastProps>({});

  const toast = React.useCallback(
    ({ title, description, variant = "default", ...props }: ToastProps) => {
      setToastProps({ title, description, variant, ...props });
      setOpen(true);
    },
    []
  );

  const ToastComponent = React.useMemo(
    () => (
      <Toast
        open={open}
        onOpenChange={setOpen}
        duration={5000}
        {...toastProps}
      />
    ),
    [open, toastProps]
  );

  return { toast, ToastComponent };
}
