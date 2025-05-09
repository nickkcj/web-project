import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between bg-transparent mb-[60px] w-full">
      <div className="flex-1 md:pr-10 mb-8 md:mb-0">
        <h1 className="text-white text-[48px] md:text-[64px] font-extrabold leading-[1.2] mb-[30px]">
          Seus gostos, suas notas, suas histórias.
        </h1>
        <p className="text-white text-2xl mb-10 max-md:text-xl max-sm:text-lg">
          Registre cada filme e série que marcou você. Avalie, escreva
          resenhas, crie listas personalizadas e descubra novas histórias
          para viver.
        </p>
        <button 
          className="text-[#14181C] text-2xl bg-white px-[30px] py-[15px] rounded-[10px] hover:bg-gray-200 transition-colors"
          onClick={() => console.log("Get started clicked")}
        >
          Comece agora 🎬
        </button>
      </div>
      <div className="flex-1 flex justify-center md:justify-end w-full">
        <img 
          src="/clapperboard.jpg" 
          alt="Clapperboard" 
          className="w-[420px] h-[300px] object-contain rounded-lg shadow-lg max-w-full max-md:w-[320px] max-md:h-[220px]"
        />
      </div>
    </section>
  );
};