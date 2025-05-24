import React from "react";
import { HeroSection } from "../../components/home/HeroSection";
import { ReviewsSection } from "../../components/home/ReviewsSection";
import { FeaturedSection } from "../../components/home/FeaturedSection";
import moviesPosters from '../../Assets/Backgrounds/movies_poster.png';

const Home = () => {
  const trendingMovies = [
    '/images/movie1.jpg',
    '/images/movie2.jpg',
    '/images/movie3.jpg',
    '/images/movie4.jpg',
    '/images/movie5.jpg',
    '/images/movie6.jpg',
  ];

  const featuredMovies = [
    '/images/featured1.jpg',
    '/images/featured2.jpg',
    '/images/featured3.jpg',
  ];

  const reviews = [
    {
      id: 1,
      user: 'John Doe',
      movie: 'Inception',
      rating: 5,
      comment: 'Mind-bending masterpiece that keeps you guessing until the end.',
      date: '2024-03-15'
    },
    {
      id: 2,
      user: 'Jane Smith',
      movie: 'The Dark Knight',
      rating: 4,
      comment: 'Heath Ledger\'s performance as Joker is unforgettable.',
      date: '2024-03-14'
    },
    {
      id: 3,
      user: 'Mike Johnson',
      movie: 'Interstellar',
      rating: 5,
      comment: 'A beautiful journey through space and time.',
      date: '2024-03-13'
    }
  ];

  return (
    <main className="max-w-[1100px] mx-auto px-4 py-8">
      <HeroSection />
      <div className="mb-0">
        <h2 className="text-white text-2xl md:text-3xl font-bold text-center mb-8 mt-32">
          Todos os filmes que você já imaginou.
        </h2>
        <div className="flex justify-center mb-4">
          <img
            src={moviesPosters}
            alt="Movie Collage"
            className="max-w-full rounded-lg shadow-lg"
          />
        </div>
        <h2 className="text-white text-2xl md:text-3xl font-bold text-center mb-[120px] mt-0">
          Em um lugar só.
        </h2>
      </div>
      <div className="mb-[120px]">
        <ReviewsSection />
      </div>
      <div className="mb-[120px]">
        <FeaturedSection />
      </div>
    </main>
  );
};

export default Home;
