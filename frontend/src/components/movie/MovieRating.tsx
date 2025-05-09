import React, { useState } from "react";

interface MovieRatingProps {
  initialRating?: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
}

export const MovieRating: React.FC<MovieRatingProps> = ({ 
  initialRating = 0, 
  onChange,
  readOnly = false
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRatingChange = (newRating: number) => {
    if (readOnly) return;
    
    setRating(newRating);
    if (onChange) {
      onChange(newRating);
    }
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          className={`text-2xl ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
          onClick={() => handleRatingChange(star)}
          onMouseEnter={() => !readOnly && setHoverRating(star)}
          onMouseLeave={() => !readOnly && setHoverRating(0)}
          aria-label={`Rate ${star} stars`}
        >
          <span className={
            (hoverRating || rating) >= star 
              ? 'text-yellow-400' 
              : 'text-gray-600'
          }>
            ★
          </span>
        </button>
      ))}
    </div>
  );
};