import React from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <div className="bg-[linear-gradient(180deg,#14181C_0%,#1E252C_100%)] py-5">
      <div className="flex items-center justify-between max-w-none mx-auto px-5 max-md:max-w-[991px] max-sm:max-w-screen-sm">
        <div className="flex items-center gap-5">
          <img
            src="/logo.png"
            alt="Absolute Cinema Logo"
            className="w-[50px] h-[50px] max-sm:w-[40px] max-sm:h-[40px]"
          />
          <div className="text-white text-[32px] max-sm:text-2xl">
            Absolute Cinema
          </div>
        </div>
        <div className="flex items-center gap-10 max-sm:hidden">
          <button className="text-white text-2xl hover:text-gray-300 transition-colors">Login</button>
          <Link to="/register">
            <button className="text-white text-2xl hover:text-gray-300 transition-colors">Register</button>
          </Link>
        </div>
        <button className="hidden text-white max-sm:block" aria-label="Menu">
          <i className="ti ti-menu-2 text-2xl" />
        </button>
      </div>
    </div>
  );
};