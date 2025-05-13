import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1E252C] py-6">
      <div className="max-w-none mx-auto px-5 max-md:max-w-[991px] max-sm:max-w-screen-sm">
        <div className="flex flex-wrap items-center justify-between text-white">
          <div className="text-base">
            © 2025 Absolute Cinema All rights reserved
          </div>
          
          <div className="flex gap-8 text-base">
            <a href="#" className="hover:text-gray-300 transition-colors">Minhas avaliações</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Avaliar</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Descobrir</a>
          </div>
        </div>
      </div>
    </footer>
  );
};