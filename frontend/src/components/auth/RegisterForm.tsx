import React, { useState } from "react";

interface RegisterFormProps {
  onSubmit: (name: string, email: string, password: string) => void;
  onCancel: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-[#1B2228] p-6 rounded">
      <h2 className="text-white text-2xl mb-4">Register</h2>
      <div className="mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full p-2 rounded bg-[#14181C] text-white border border-gray-700"
        />
      </div>
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
          Register
        </button>
        <button type="button" onClick={onCancel} className="text-white px-4 py-2 rounded border border-white">
          Cancel
        </button>
      </div>
    </form>
  );
};