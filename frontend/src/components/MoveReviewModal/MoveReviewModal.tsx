import React, { useEffect } from "react";
import ReactDOM from "react-dom";

interface Review {
  poster: string;
  title: string;
  rating: number;
  text: string;
  details: string;
}

interface Props {
  review: Review;
  onClose: () => void;
}

export const MovieReviewModal: React.FC<Props> = ({ review, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative bg-[#1E252C] text-white rounded-2xl shadow-2xl w-[90%] max-w-3xl
                   flex flex-col md:flex-row overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={review.poster}
          alt={review.title}
          className="h-64 md:h-auto md:w-1/3 object-cover"
        />

        <div className="p-6 flex-1 flex flex-col gap-4">
          <h3 className="text-2xl font-bold">{review.title}</h3>
          <p className="text-lg">
            {"★".repeat(review.rating).padEnd(5, "☆")}
          </p>
          <p className="italic">“{review.text}”</p>
          <p>{review.details}</p>
        </div>

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-2 right-3 text-3xl leading-none text-gray-400 hover:text-white"
        >
          &times;
        </button>
      </div>
    </div>,
    document.body
  );
};
