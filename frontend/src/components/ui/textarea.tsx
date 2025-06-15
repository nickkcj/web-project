import React from "react";

const cn = (...c: (string | undefined | false)[]) =>
  c.filter(Boolean).join(" ");

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-md bg-slate-800 text-slate-100 text-sm",
        "border border-slate-700 p-3 placeholder-slate-400",
        "focus:outline-none focus:ring-2 focus:ring-amber-400",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
