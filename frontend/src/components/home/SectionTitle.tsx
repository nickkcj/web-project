import React from "react";

interface SectionTitleProps {
  title: string;
  centered?: boolean;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title, centered = false }) => {
  return (
    <h2 className={`text-white text-3xl mb-6 ${centered ? 'text-center' : ''}`}>
      {title}
    </h2>
  );
};