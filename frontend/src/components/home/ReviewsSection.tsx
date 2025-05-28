import React from 'react';
import originPoster from '../../Assets/Photos/origin_poster.jpg';

const reviews = [
  {
    poster: '/images/review1.jpg',
    title: 'Us',
    rating: 5,
    text: 'great movie and plot twist',
  },
  {
    poster: '/images/review2.jpg',
    title: 'The Witch',
    rating: 4,
    text: 'great movie and plot twist',
  },
  {
    poster: '/images/review3.jpg',
    title: 'Origin',
    rating: 4,
    text: 'great movie and plot twist',
  },
];

export const ReviewsSection: React.FC = () => {
  return (
    <section className="mb-[60px]">
      <h2 className="text-white text-2xl md:text-3xl font-bold mb-8">Últimas Avaliações</h2>
      <div className="flex flex-row gap-8 justify-center">
        {reviews.map((review, idx) => (
          <div key={idx} className="bg-[#1E252C] rounded-[10px] p-4 w-[220px] flex flex-col items-center shadow-lg">
            <img src={originPoster} alt={review.title} className="w-full h-[320px] object-cover rounded mb-4" />
            <div className="text-white text-lg font-semibold mb-2 text-center">{review.title}</div>
            <div className="flex items-center mb-2">
              {Array.from({ length: review.rating }).map((_, i) => (
                <span key={i} className="text-xl" style={{ color: 'var(--id-color-yellow)' }}>★</span>
              ))}
              {Array.from({ length: 5 - review.rating }).map((_, i) => (
                <span key={i} className="text-gray-600 text-xl">★</span>
              ))}
            </div>
            <div className="text-gray-300 text-sm text-center">"{review.text}"</div>
          </div>
        ))}
      </div>
    </section>
  );
};