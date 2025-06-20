import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown } from "lucide-react";
import { logout } from "../../services/Slices/loginSlice";
import logo from "../../Assets/Icons/logo.png";

/* simple clsx helper */
const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

interface Props {
  isLoggedIn: boolean;
  username?: string;
}

const Header: React.FC<Props> = ({ isLoggedIn, username = "user" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.login);

  const navLogged = [
    { to: "/movies",     label: "Filmes" },
    { to: "/my-reviews", label: "Minhas Avaliações" },
    { to: "/feed",       label: "Feed" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className="bg-[linear-gradient(180deg,#14181C_0%,#1E252C_100%)] py-3 sticky top-0 z-40">
      <div className="flex items-center justify-between max-w-none mx-auto px-5 max-md:max-w-[991px] max-sm:max-w-screen-sm">
        {/* logo */}
        <Link className="flex items-center gap-3" to="/">
          <img src={logo} alt="Logo" className="w-10 h-10 max-sm:w-8 max-sm:h-8" />
          <span className="text-white text-2xl font-medium max-sm:text-xl">
            Absolute Cinema
          </span>
        </Link>

        {/* desktop links */}
        <nav className="hidden lg:flex items-center gap-8">
          {isLoggedIn
            ? navLogged.map((n) => (
                <Link key={n.to} to={n.to} className="text-white text-lg hover:text-amber-400">
                  {n.label}
                </Link>
              ))
            : (
              <>
                <Link to="/login"    className="text-white text-lg hover:text-gray-300">Login</Link>
                <Link to="/register" className="text-white text-lg hover:text-gray-300">Register</Link>
              </>
            )}
        </nav>

        {/* right-side: dropdown or auth links (mobile) */}
        {isLoggedIn ? (
          <div className="relative group">
            <button className="hidden lg:flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-1.5 px-3 rounded-md">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-sm">{username}</span>
              <ChevronDown size={16} />
            </button>
            
            {/* Dropdown menu */}
            <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-1">
                <button
                  onClick={handleProfileClick}
                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-slate-700"
                >
                  Meu Perfil
                </button>
                <button
                  onClick={() => navigate('/edit-profile')}
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
            <Link to="/login"    className="text-white hover:text-gray-300">Login</Link>
            <Link to="/register" className="text-white hover:text-gray-300">Register</Link>
          </div>
        )}

        {/* hamburger (future) */}
        <button className="text-white lg:hidden" aria-label="Menu">
          <i className="ti ti-menu-2 text-xl" />
        </button>
      </div>
    </header>
  );
};

export default Header;