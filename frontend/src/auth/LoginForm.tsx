import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email("Por favor, insira um endereço de e-mail válido"),
  password: z.string().min(1, "A senha é obrigatória"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  onCancel: () => void;
  isLoading?: boolean,
}

export function LoginForm({ onSubmit, onCancel }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const handleFormSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      onSubmit(data.email, data.password);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 py-4">
      <div className="mb-6">
        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="w-full h-12 bg-white/80 text-gray-800 text-base font-medium px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          aria-invalid={errors.email ? "true" : "false"}
        />
        {errors.email && (
          <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>
      
      <div className="mb-6">
        <input
          type="password"
          placeholder="Senha"
          {...register("password")}
          className="w-full h-12 bg-white/80 text-gray-800 text-base font-medium px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          aria-invalid={errors.password ? "true" : "false"}
        />
        {errors.password && (
          <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center mb-6">
        <input
          type="checkbox"
          id="rememberMe"
          {...register("rememberMe")}
          className="w-4 h-4 text-[#B82E2E] bg-white/80 border-gray-300 rounded focus:ring-[#B82E2E]"
        />
        <label htmlFor="rememberMe" className="ml-2 text-white">
          Lembrar de mim
        </label>
      </div>
      
      <button 
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-[#B82E2E] text-white font-medium rounded-lg hover:bg-[#a12929] transition disabled:opacity-70 mt-8"
      >
        {isLoading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}