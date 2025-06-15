import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import backGroundImage from "../../Assets/Backgrounds/register_background.jpg";
import { fetchLogin } from "../../services/Slices/loginSlice";
import { LoginForm } from "../../auth/LoginForm";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { error, message, token, loading } = useSelector((state: any) => state.login);

  useEffect(() => {
    if (token) {
      navigate("/feed"); // redireciona após login
    }
  }, [token, navigate]);

  useEffect(() => {
    if (location.state && "successMessage" in location.state) {
      // Se veio de um registro bem-sucedido
      // Aqui poderíamos também despachar uma action se quisesse manter a mensagem em Redux
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleLogin = (email: string, password: string) => {
    (dispatch as any)(fetchLogin({ email, password }));
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
                  {message}
                </div>
              )}
              {message && !error && (
                <div className="absolute top-4 bg-green-500 text-white p-3 rounded mb-4">
                  {message}
                </div>
              )}
              <div className="bg-[#0F172A]/70 backdrop-blur-md shadow-2xl rounded-2xl p-10 max-w-lg w-full mx-4 border border-white/20">
                <h2 className="text-white text-center text-4xl font-extrabold mb-4 drop-shadow">
                  Prepare a pipoca. Você voltou!
                </h2>
                <p className="text-white text-center text-lg mb-8 opacity-80">
                  Não tem uma conta?{" "}
                  <span className="underline cursor-pointer" onClick={() => navigate("/register")}>
                    Registre-se aqui
                  </span>
                </p>
                <LoginForm
                  onSubmit={handleLogin}
                  onCancel={() => navigate("/")}
                  isLoading={loading}
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
