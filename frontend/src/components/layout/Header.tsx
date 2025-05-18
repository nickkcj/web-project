import React from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <div className="bg-[linear-gradient(180deg,#14181C_0%,#1E252C_100%)] py-3">
      <div className="flex items-center justify-between max-w-none mx-auto px-5 max-md:max-w-[991px] max-sm:max-w-screen-sm">
        <div className="flex items-center gap-3">
          <Link className="flex items-center gap-3" to="/">
            <img
              src="/logo.png"
              alt="Absolute Cinema Logo"
              className="w-[40px] h-[40px] max-sm:w-[32px] max-sm:h-[32px]"
            />
            <div className="text-white text-2xl font-medium max-sm:text-xl">
              Absolute Cinema
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-6 max-sm:hidden">
          <Link to="/login">
            <button className="text-white text-lg hover:text-gray-300 transition-colors">Login</button>
          </Link>
          <Link to="/register">
            <button className="text-white text-lg hover:text-gray-300 transition-colors">Register</button>
          </Link>
        </div>
        <button className="hidden text-white max-sm:block" aria-label="Menu">
          <i className="ti ti-menu-2 text-xl" />
        </button>
      </div>
    </div>
  );
};