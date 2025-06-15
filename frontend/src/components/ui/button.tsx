import React from "react";

/* clsx-lite */
const cn = (...c: (string | undefined | false)[]) =>
  c.filter(Boolean).join(" ");

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "ghost";
  size?: "sm" | "md" | "lg";
}

const variantClasses = {
  primary:     "bg-amber-500 hover:bg-amber-600 text-white",
  secondary:   "bg-slate-700 hover:bg-slate-600 text-white",
  destructive: "bg-red-500 hover:bg-red-600 text-white",
  ghost:       "bg-transparent hover:bg-slate-800 text-slate-100",
};

const sizeClasses = {
  sm: "h-8  px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      children,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
        "disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
Button.displayName = "Button";
