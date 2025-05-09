import React from "react";

interface MovieGridProps {
  images: string[];
  className?: string;
}

export const MovieGrid: React.FC<MovieGridProps> = ({ images, className = "" }) => {
  return (
    <div className={`grid grid-cols-3 gap-5 max-md:grid-cols-2 max-sm:grid-cols-1 ${className}`}>
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Movie poster ${index + 1}`}
          className="w-full rounded-[10px] hover:opacity-80 transition-opacity cursor-pointer"
        />
      ))}
    </div>
  );
};