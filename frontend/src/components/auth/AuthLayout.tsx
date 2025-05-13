import React, { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  backgroundImage?: string;
}

export function AuthLayout({ 
  children, 
  backgroundImage = "https://cdn.builder.io/api/v1/image/assets/TEMP/627a9e2e429f6a3d532cf63bb65c8f0668f3b80e" 
}: AuthLayoutProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#14181C] relative overflow-hidden">
      <img
        src={backgroundImage}
        alt="Background"
        className="absolute w-full h-full object-cover"
      />
      <div className="relative w-full max-w-[1902px] bg-[linear-gradient(180deg,rgba(30,37,44,0.85)_0%,rgba(60,74,89,0.85)_100%)] p-16 rounded-[100px] max-md:p-12 max-sm:p-8">
        {children}
      </div>
    </div>
  );
}