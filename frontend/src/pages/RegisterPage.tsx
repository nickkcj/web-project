import React, { useEffect } from "react";
import { RegisterForm } from "../auth/RegisterForm";
import { useNavigate } from "react-router-dom";
import backGroundImage from "../Assets/Backgrounds/register_background.jpg";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegister } from "../services/Slices/registerSlice";

const RegisterPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, message } = useSelector((state: any) => state.register);

  const handleRegister = (name: string, email: string, password: string) => {
    dispatch(fetchRegister({ name, email, password }) as any);
  };

  useEffect(() => {
    if (message) {
      navigate("/login", {
        state: { successMessage: "Conta criada com sucesso! Agora você pode fazer login." },
      });
    }
  }, [message, navigate]);

  return (
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
                {typeof error === "string" ? error : "Erro ao registrar."}
              </div>
            )}
            <RegisterForm
              onSubmit={handleRegister}
              onCancel={() => navigate("/login")}
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
