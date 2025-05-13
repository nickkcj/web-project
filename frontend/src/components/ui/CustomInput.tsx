import React, { InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function CustomInput({ 
  className, 
  ...props 
}: CustomInputProps) {
  return (
    <input
      className={cn(
        "w-full h-[139px] bg-white text-[#6D6A6A] text-[64px] font-bold px-[11px] rounded-[15px] max-md:h-[100px] max-md:text-5xl max-sm:h-[60px] max-sm:text-2xl max-sm:px-6",
        className
      )}
      {...props}
    />
  );
}