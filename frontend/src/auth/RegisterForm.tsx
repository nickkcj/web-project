import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const registrationSchema = z.object({
  email: z.string().email("Por favor, insira um e-mail válido"),
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string()
}).refine((data: any) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface RegisterFormProps {
  onSubmit: (name: string, email: string, password: string) => void;
  onCancel: () => void;
}

export function RegisterForm({ onSubmit, onCancel }: RegisterFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const { register, handleSubmit, formState: { errors } } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema)
  });

  const handleCloseSnackbar = () => {
    setSnackbar(s => ({ ...s, open: false }));
  };

  const handleFormSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    try {
      onSubmit(data.name, data.email, data.password);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSnackbar({ open: true, message: "Registro realizado com sucesso!", severity: "success" });
    } catch (error) {
      console.error("Registration failed:", error);
      setSnackbar({ open: true, message: "Falha no registro. Tente novamente.", severity: "error" });
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
