import React from "react";

interface ReviewCardProps {
  imageUrl: string;
  rating: number;
  reviewText: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ 
  imageUrl, 
  rating, 
  reviewText 
}) => {
  return (
    <div className="flex flex-col">
      <img
        src={imageUrl}
        alt="Movie poster"
        className="w-full rounded-[10px] mb-[20px] hover:opacity-80 transition-opacity cursor-pointer"
      />
      <div className="flex mb-2.5">
        {[...Array(5)].map((_, i) => (
          <span 
            key={i} 
            className={`text-2xl ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`}
          >
            ★
          </span>
        ))}
      </div>
      <div className="text-white text-lg">
        &quot;{reviewText}&quot;
      </div>
    </div>
  );
};