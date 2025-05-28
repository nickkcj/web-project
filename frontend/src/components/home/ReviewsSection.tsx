import React, { useState } from 'react';
import originPoster from '../../Assets/Photos/origin_poster.jpg';
import aquiPoster from '../../Assets/Photos/aqui.jpg';
import theWitchPoster from '../../Assets/Photos/The_Witch_poster.png';

const reviews = [
  {
    poster: aquiPoster,
    title: 'Us',
    rating: 5,
    text: 'great movie and plot twist',
    details: 'A family’s serene beach vacation turns to chaos when their doppelgängers appear.',
  },
  {
    poster: theWitchPoster,
    title: 'The Witch',
    rating: 4,
    text: 'great movie and plot twist',
    details: 'A Puritan family encounters evil forces in the woods beyond their New England farm.',
  },
  {
    poster: originPoster,
    title: 'Origin',
    rating: 4,
    text: 'great movie and plot twist',
    details: 'A drama about the journey of exploring the roots of caste and inequality.',
  },
];

export const ReviewsSection: React.FC = () => {
  const [selectedReview, setSelectedReview] = useState<any>(null);

  return (
    <section className="mb-[60px] relative">
      <h2 className="text-white text-2xl md:text-3xl font-bold mb-8">Últimas Avaliações</h2>
      <div className="flex flex-row gap-8 justify-center">
        {reviews.map((review, idx) => (
          <div
            key={idx}
            className="bg-[#1E252C] rounded-[10px] p-4 w-[220px] flex flex-col items-center shadow-lg cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setSelectedReview(review)}
          >
            <img
              src={review.poster}
              alt={review.title}
              className="w-full h-[320px] object-cover rounded mb-4"
            />
            <div className="text-white text-lg font-semibold mb-2 text-center">
              {review.title}
            </div>
            <div className="flex items-center mb-2">
              {Array.from({ length: review.rating }).map((_, i) => (
                <span key={i} className="text-yellow-400 text-xl">★</span>
              ))}
              {Array.from({ length: 5 - review.rating }).map((_, i) => (
                <span key={i} className="text-gray-600 text-xl">★</span>
              ))}
            </div>
            <div className="text-gray-300 text-sm text-center">"{review.text}"</div>
          </div>
        ))}
      </div>

      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#1E252C] p-6 rounded-lg max-w-md text-white relative shadow-2xl">
            <button
              onClick={() => setSelectedReview(null)}
              className="absolute top-2 right-3 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-4">{selectedReview.title}</h3>
            
            <img
              src={selectedReview.poster}
              alt={selectedReview.title}
              className="w-full h-[320px] object-cover rounded mb-4"
            />
            <p className="mb-2">Rating: {'★'.repeat(selectedReview.rating)}</p>
            <p className="mb-4 italic">"{selectedReview.text}"</p>
            <p>{selectedReview.details}</p>
          </div>
        </div>
      )}
    </section>
  );
};
