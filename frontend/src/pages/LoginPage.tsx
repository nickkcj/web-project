import React, { useState } from "react";
import { PageLayout } from "../components/layout/PageLayout";
import { LoginForm } from "../components/auth/LoginForm";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = (email: string, password: string) => {
    // Handle login logic here - e.g., API call
    console.log("Login attempt with:", email, password);
    try {
      // Add your actual login API call here
      // If login fails, you can set an error:
      // setError('Invalid email or password');
      
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