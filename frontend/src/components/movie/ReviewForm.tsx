import React, { useState } from "react";
import { MovieRating } from "./MovieRating";

interface ReviewFormProps {
  onSubmit: (rating: number, review: string) => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    
    if (!review.trim()) {
      setError("Please write a review");
      return;
    }
    
    onSubmit(rating, review);
    
    // Reset form
    setRating(0);
    setReview("");
    setError("");
  };

  return (
    <div className="bg-[#1E252C] p-6 rounded-lg">
      <h3 className="text-white text-2xl font-bold mb-4">Write a Review</h3>
      
      {error && (
        <div className="bg-red-500 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-white mb-2">
            Your Rating
          </label>
          <MovieRating 
            initialRating={rating} 
            onChange={setRating} 
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="review" className="block text-white mb-2">
            Your Review
          </label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={4}
            className="w-full bg-[#14181C] text-white border border-gray-700 rounded p-3 focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="Share your thoughts about this movie..."
          />
        </div>
        
        <button
          type="submit"
          className="bg-white text-[#14181C] px-6 py-3 rounded hover:bg-gray-200 transition-colors"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};