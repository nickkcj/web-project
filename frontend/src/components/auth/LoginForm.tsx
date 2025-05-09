import React, { useState } from "react";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  onCancel: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onCancel }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-[#1B2228] p-6 rounded">
      <h2 className="text-white text-2xl mb-4">Login</h2>
      
      {error && (
        <div className="bg-red-500 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 rounded bg-[#14181C] text-white border border-gray-700"
        />
      </div>
      
      <div className="mb-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 rounded bg-[#14181C] text-white border border-gray-700"
        />
      </div>
      
      <div className="flex gap-4">
        <button type="submit" className="bg-white text-[#14181C] px-4 py-2 rounded">
          Login
        </button>
        <button type="button" onClick={onCancel} className="text-white px-4 py-2 rounded border border-white">
          Cancel
        </button>
      </div>
    </form>
  );
};