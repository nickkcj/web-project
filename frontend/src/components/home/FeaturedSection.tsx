import React from 'react';
import aqui from '../../Assets/Photos/aqui.jpg';


const favorites = [
  {
    poster: aqui,
    title: 'The Active',
  },
  {
    poster: aqui,
    title: 'Ainda Estou Aqui',
  },
  {
    poster: aqui,
    title: 'Another Movie',
  },
];

export const FeaturedSection: React.FC = () => {
  return (
    <section className="mb-[60px]">
      <h2 className="text-white text-2xl md:text-3xl font-bold text-center mb-8">Os Favoritos</h2>
      <div className="flex flex-row gap-8 justify-center">
        {favorites.map((fav, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <img src={fav.poster} alt={fav.title} className="w-[220px] h-[140px] object-cover rounded-lg shadow-lg mb-2" />
            {/* <div className="text-white text-sm mt-2 text-center">{fav.title}</div> */}
          </div>
        ))}
      </div>
    </section>
  );
};