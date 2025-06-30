import React from "react";
import { HeroSection } from "../../components/home/HeroSection";
import { ReviewsSection } from "../../components/home/ReviewsSection";
import { FeaturedSection } from "../../components/home/FeaturedSection";
import moviesPosters from '../../Assets/Backgrounds/movies_poster.png';

const Home = () => {
  
  return (
    <main className="max-w-[1100px] mx-auto px-4 py-8">
      <HeroSection />
      <div className="mb-0">
        <h2 className="text-white text-[2rem] md:text-[2rem] font-bold text-center mb-8 mt-32">
          Todos os filmes que você já imaginou.
        </h2>
        <div className="flex justify-center mb-">
          <img
            src={moviesPosters}
            alt="Movie Collage"
            className="w-[50%] rounded-lg shadow-lg"
          />
        </div>
        <h2 className="text-white text-[2rem] md:text-[2rem] font-bold text-center mb-[60px] mt-0">
          Em um lugar só.
        </h2>
      </div>
      <div className="mb-[60px]">
        <FeaturedSection />
      </div>
    </main>
  );
};

export default Home;
