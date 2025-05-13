import React, { useState, useEffect } from "react";
import { PageLayout } from "../components/layout/PageLayout";
import { LoginForm } from "../components/auth/LoginForm";
import { useNavigate, useLocation } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract success message from navigation state
  useEffect(() => {
    if (location.state && 'successMessage' in location.state) {
      setSuccessMessage(location.state.successMessage as string);
      // Clear the state to prevent showing message after page refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleLogin = (email: string, password: string) => {
    // Reset messages when attempting login
    setError(null);
    setSuccessMessage(null);
    
    try {
      // Your login logic
      // After successful login, redirect to home
      // navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  return (
    <PageLayout>
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
    </PageLayout>
  );
};

export default LoginPage;