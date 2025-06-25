import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown, Menu, X } from "lucide-react";
import { logout } from "../../services/Slices/loginSlice";
import logo from "../../Assets/Icons/logo.png";

interface Props {
  isLoggedIn: boolean;
  username?: string;
}

const Header: React.FC<Props> = ({ isLoggedIn, username = "user" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.login);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLogged = [
    { to: "/movies", label: "Filmes" },
    { to: "/profile", label: "Diário" },
    { to: "/feed", label: "Feed" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsMobileMenuOpen(false);
  };

  const handleLinkClick = (to: string) => {
    navigate(to);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-[linear-gradient(180deg,#14181C_0%,#1E252C_100%)] py-3 sticky top-0 z-40">
      <div className="flex items-center justify-between max-w-none mx-auto px-5 max-md:max-w-[991px] max-sm:max-w-screen-sm">
        <Link className="flex items-center gap-3" to="/" onClick={() => setIsMobileMenuOpen(false)}>
          <img src={logo} alt="Logo" className="w-10 h-10 max-sm:w-8 max-sm:h-8" />
          <span className="text-white text-2xl font-medium max-sm:text-xl">
            Absolute Cinema
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {isLoggedIn
            ? navLogged.map((n) => (
                <Link key={n.to} to={n.to} className="text-white text-lg hover:text-amber-400">
                  {n.label}
                </Link>
              ))
            : (
              <>
                <Link to="/login" className="text-white text-lg hover:text-gray-300">Login</Link>
                <Link to="/register" className="text-white text-lg hover:text-gray-300">Register</Link>
              </>
            )}
        </nav>

        {isLoggedIn ? (
          <div className="relative group hidden lg:block">
            <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-1.5 px-3 rounded-md">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-sm">{username}</span>
              <ChevronDown size={16} />
            </button>

            <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-1">
                <button
                  onClick={handleProfileClick}
                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-slate-700"
                >
                  Meu Perfil
                </button>
                <button
                  onClick={() => handleLinkClick('/edit-profile')}
                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-slate-700"
                >
                  Editar Perfil
                </button>
                <hr className="border-slate-600 my-1" />
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:hidden flex gap-4 text-sm font-medium">
            <Link to="/login" className="text-white hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
            <Link to="/register" className="text-white hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
          </div>
        )}

        <button
          className="text-white lg:hidden"
          aria-label="Menu"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-75 z-30 flex justify-end">
          <div className="bg-[linear-gradient(180deg,#14181C_0%,#1E252C_100%)] w-64 h-full p-5 shadow-lg relative">
            <button
              className="absolute top-4 right-4 text-white"
              aria-label="Close Menu"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={28} />
            </button>

            <nav className="flex flex-col gap-4 mt-10">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center gap-2 text-white py-1.5 rounded-md text-left flex-grow"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-lg font-medium">{username}</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-1.5 text-sm text-red-400 border border-red-400 rounded-md hover:bg-red-900/30 transition-colors duration-200"
                    >
                      Sair
                    </button>
                  </div>
                  <button
                    onClick={() => handleLinkClick('/edit-profile')}
                    className="block w-full text-left px-4 text-sm text-white hover:bg-slate-700"
                  >
                    Editar Perfil
                  </button>
                  <hr className="border-slate-600 my-2" />
                  {navLogged.map((n) => (
                    <Link
                      key={n.to}
                      to={n.to}
                      className="text-white text-lg hover:text-amber-400"
                      onClick={() => handleLinkClick(n.to)}
                    >
                      {n.label}
                    </Link>
                  ))}
                </>
              ) : (
                <>
                  <Link to="/login" className="text-white text-lg hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="text-white text-lg hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;