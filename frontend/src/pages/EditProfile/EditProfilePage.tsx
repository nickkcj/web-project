import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../services/Slices/loginSlice';
import services from '../../services/services';

export const EditProfilePage: React.FC = () => {
  const { user } = useSelector((state: any) => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('O nome é obrigatório');
      return;
    }

    if (!formData.email.trim()) {
      alert('O email é obrigatório');
      return;
    }

    if (formData.name.trim().length < 2) {
      alert('O nome deve ter pelo menos 2 caracteres');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Por favor, insira um email válido');
      return;
    }

    try {
      setUpdating(true);
      const updatedUser = await services.updateUserProfile({
        name: formData.name.trim(),
        email: formData.email.trim()
      });

      dispatch(updateUser(updatedUser));
      alert('Perfil atualizado com sucesso!');
      navigate('/profile');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert(error.response?.data?.error || 'Erro ao atualizar perfil');
    } finally {
      setUpdating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      alert('Funcionalidade de exclusão de conta em desenvolvimento');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-gradient-to-br from-slate-700/90 to-slate-800/90 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-blue-400/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-600/60 to-slate-700/60 px-8 py-6 border-b border-blue-400/30">
            <h1 className="text-white text-2xl font-bold text-center">Minha Conta</h1>
          </div>

          <div className="p-8">
            {/* Avatar */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl border-4 border-white/30">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-white text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-400 text-sm">Membro desde 2024</p>
            </div>

            {/* Detalhes Section */}
            <div className="bg-slate-600/30 rounded-xl p-6 mb-6 border border-slate-500/30">
              <h3 className="text-white text-lg font-semibold mb-4">Detalhes</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-gray-300 text-sm font-medium mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-white/90 text-gray-800 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Seu nome de usuário"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white/90 text-gray-800 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-white/90 text-gray-800 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white py-3 px-4 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-6"
                >
                  {updating ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Salvando...
                    </div>
                  ) : (
                    'Salvar Mudanças'
                  )}
                </button>
              </form>
            </div>

            {/* Delete Account Button */}
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="w-full bg-red-600/90 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors border border-red-500/50 shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Deletar Conta
            </button>

            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="w-full bg-slate-600/50 hover:bg-slate-700/50 text-white py-3 px-4 rounded-lg font-medium transition-colors mt-4 border border-slate-500/50"
            >
              Voltar ao Perfil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};