import React, { useState, useEffect } from "react";
import { LoginForm } from "../auth/LoginForm";
import { useNavigate, useLocation } from "react-router-dom";
import backGroundImage from "../Assets/Backgrounds/register_background.jpg"

const LoginPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && 'successMessage' in location.state) {
      setSuccessMessage(location.state.successMessage as string);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleLogin = (email: string, password: string) => {
    setError(null);
    setSuccessMessage(null);

    try {
      // lógica de login
      // navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=K2D:wght@400;500;700;800&family=Inter:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <div className="min-h-screen flex flex-col">
        <div className="relative flex-1 flex items-center justify-center min-h-0 bg-[#0F172A]">
          {/* Background image and overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={backGroundImage}
              alt="Cinema background"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          </div>

          {/* Content */}
          <div className="relative z-10 w-full flex items-center justify-center py-12">
            <section className="w-full flex items-center justify-center min-h-[600px]">
              {error && (
                <div className="absolute top-4 bg-red-500 text-white p-3 rounded mb-4">
                  {error}
                </div>
              )}
              {successMessage && (
                <div className="absolute top-4 bg-green-500 text-white p-3 rounded mb-4">
                  {successMessage}
                </div>
              )}
              <div className="bg-[#0F172A]/70 backdrop-blur-md shadow-2xl rounded-2xl p-10 max-w-lg w-full mx-4 border border-white/20">
                <h2 className="text-white text-center text-4xl font-extrabold mb-4 drop-shadow">
                  Prepare a pipoca. Você voltou!
                </h2>
                <p className="text-white text-center text-lg mb-8 opacity-80">
                  Não tem uma conta? <span className="underline cursor-pointer" onClick={() => navigate('/register')}>Registre-se aqui</span>
                </p>
                <LoginForm
                  onSubmit={handleLogin}
                  onCancel={() => navigate('/')}
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
