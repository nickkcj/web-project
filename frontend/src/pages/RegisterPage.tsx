import React, { useState } from "react";
import { PageLayout } from "../components/layout/PageLayout";
import { RegisterForm } from "../components/auth/RegisterForm";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      setError(null);
      await registerUser(name, email, password);
      // Pass success message via navigation state
      navigate('/login', { 
        state: { 
          successMessage: 'Conta criada com sucesso! Agora você pode fazer login.' 
        } 
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
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
        <RegisterForm
          onSubmit={handleRegister}
          onCancel={() => navigate('/')}
        />
      </section>
    </PageLayout>
  );
};

export default RegisterPage;

