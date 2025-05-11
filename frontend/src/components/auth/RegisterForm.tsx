import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const registrationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data: any) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

type RegisterFormProps = {
  onSubmit: (name: string, email: string, password: string) => void;
  onCancel: () => void;
};

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema)
  });

  const handleFormSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    try {
      onSubmit(data.name, data.email, data.password);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Registration successful!");
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0F172A]/70 backdrop-blur-md shadow-2xl rounded-2xl p-10 max-w-lg w-full mx-4 border border-white/20">
      <h2 className="text-white text-center text-4xl font-extrabold mb-4 drop-shadow">
        Bem-vindo ao seu universo de filmes e séries.
      </h2>
      <p className="text-white text-center text-lg mb-8 opacity-80">
        Já tem uma conta? <span className="underline cursor-pointer" onClick={onCancel}>Entre aqui</span>
      </p>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
        <div>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full h-12 bg-white/80 text-gray-800 text-base font-medium px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B82E2E] transition"
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <input
            type="text"
            placeholder="Nome"
            {...register("name")}
            className="w-full h-12 bg-white/80 text-gray-800 text-base font-medium px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B82E2E] transition"
            aria-invalid={errors.name ? "true" : "false"}
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <input
            type="password"
            placeholder="Senha"
            {...register("password")}
            className="w-full h-12 bg-white/80 text-gray-800 text-base font-medium px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B82E2E] transition"
            aria-invalid={errors.password ? "true" : "false"}
          />
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>
        
        <div>
          <input
            type="password"
            placeholder="Confirme a senha"
            {...register("confirmPassword")}
            className="w-full h-12 bg-white/80 text-gray-800 text-base font-medium px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B82E2E] transition"
            aria-invalid={errors.confirmPassword ? "true" : "false"}
          />
          {errors.confirmPassword && (
            <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>
        
        <button 
          type="submit"
          disabled={isSubmitting}
          className="bg-[#B82E2E] text-white text-lg font-bold h-12 rounded-lg hover:bg-[#a12929] transition-colors disabled:opacity-70 shadow"
        >
          {isSubmitting ? "Processando..." : "Registrar"}
        </button>
      </form>
    </div>
  );
};