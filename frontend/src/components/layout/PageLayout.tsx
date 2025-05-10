import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <link
      href="https://fonts.googleapis.com/css2?family=K2D:wght@400;500;700;800&family=Inter:wght@400;500&display=swap"
      rel="stylesheet"
    />
    <div className="min-h-screen bg-[#0F172A]">
      <Header />
      <main className="max-w-[1100px] mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  </>
);
