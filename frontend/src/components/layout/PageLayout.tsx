import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <link
      href="https://fonts.googleapis.com/css2?family=K2D:wght@400;500;700;800&family=Inter:wght@400;500&display=swap"
      rel="stylesheet"
    />
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="relative flex-1 flex items-center justify-center min-h-0 bg-[#0F172A]">
        {/* Background image and overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/register_background.jpg"
            alt="Cinema background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        </div>
        {/* Content */}
        <div className="relative z-10 w-full flex items-center justify-center py-12">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  </>
);
