import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1E252C] py-10">
      <div className="max-w-none mx-auto px-5 max-md:max-w-[991px] max-sm:max-w-screen-sm">
        <div className="text-white text-center text-lg mb-5">
          © 2025 Absolute Cinema All rights reserved
        </div>
        <div className="flex justify-center gap-10 text-white">
          <div className="flex flex-col items-center">
            <h3 className="text-xl mb-2.5 font-medium">Conta</h3>
            <a href="#" className="text-base mb-[5px] hover:text-gray-300 transition-colors">Minhas avaliações</a>
            <a href="#" className="text-base mb-[5px] hover:text-gray-300 transition-colors">Avaliar</a>
            <a href="#" className="text-base hover:text-gray-300 transition-colors">Descobrir</a>
          </div>
        </div>
      </div>
    </footer>
  );
};