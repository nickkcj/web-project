import React from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Clapperboard from '../../Assets/Icons/clapperboard.jpg';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.login);
  return (
    <section className="flex flex-col md:flex-row items-center justify-between bg-transparent w-full">
      <div className="flex-1 md:pr-10 md:mb-0 flex flex-col items-start">
        <h1 className="text-white text-[2rem] md:text-[3rem] font-extrabold leading-[1.2] mb-[30px] text-left mt-[30px]">
          Seus gostos, suas notas, suas histórias.
        </h1>
        <p className="text-white text-xl mb-10 max-md:text-lg max-sm:text-base text-left">
          Registre cada filme e série que marcou você. Avalie, escreva
          resenhas, crie listas personalizadas e descubra novas histórias
          para viver.
        </p>
        <button 
          className="text-[#14181C] text-[1rem] md:text-[1.5rem] bg-white px-[30px] py-[15px] rounded-[10px] hover:bg-gray-200 transition-colors self-start"
          onClick={() => navigate(user ? "/discovery" : "/register")}
        >
          Comece agora 🎬
        </button>
      </div>
      <div className="flex-1 hidden justify-center md:flex w-full">
        <img 
          src={Clapperboard} 
          alt="Clapperboard" 
          className="w-[420px] h-[300px] object-contain rounded-lg max-w-full max-md:w-[50px] max-md:h-[auto]"
        />
      </div>
    </section>
  );
};