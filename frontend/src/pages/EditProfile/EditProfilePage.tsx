import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../services/Slices/loginSlice';
import services from '../../services/index';

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

  let memberSince = '';
  if (user && user.createdAt) {
    const date = new Date(user.createdAt);
    if (!isNaN(date.getTime())) {
      memberSince = date.getFullYear().toString();
    }
  }

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
      
      const updateData: { name: string; email: string; password?: string } = {
        name: formData.name.trim(),
        email: formData.email.trim()
      };
      
      if (formData.password.trim()) {
        updateData.password = formData.password.trim();
      }

      const updatedUser = await services.updateUserProfile(updateData);

      dispatch(updateUser(updatedUser));
      alert('Perfil atualizado com sucesso!');
      navigate('/profile');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Erro ao atualizar perfil';
      alert(errorMessage);
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
    <div className="min-h-screen bg-[#3A546E]/67 flex items-center justify-center p-4">
      <div className="w-[75%] max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-slate-700/90 to-slate-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-[#6B8AAA] overflow-hidden">
          <div className="flex flex-row w-full max-md:flex-col">
            {/* Avatar e menu lateral */}
            <div className="p-8 flex gap-8 w-full max-md:flex-col max-md:p-4 max-md:gap-4">
              <div className="flex flex-row mt-[4rem] max-md:mt-0 max-md:justify-center">
                <div className="flex flex-col justify-center pt-4 text-center mb-auto">
                  <div className="flex align-center justify-center">
                    <div className="w-[10rem] h-[10rem] bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-6xl font-bold shadow-xl border-4 border-white/30 max-md:w-28 max-md:h-28 max-md:text-4xl">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="text-center mb-8 max-md:mb-4">
                    <h2 className="text-white text-xl font-semibold max-md:text-lg">{user.name}</h2>
                    <p className="text-gray-400 text-sm max-md:text-xs">Membro desde {memberSince}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/profile')}
                    className="w-full bg-slate-600/50 hover:bg-slate-700/50 text-white py-3 px-4 rounded-lg font-medium transition-colors mt-4 border border-slate-500/50 max-md:py-2 max-md:px-2 max-md:text-sm"
                  >
                    Voltar
                  </button>
                </div>
              </div>
              {/* Formulário */}
              <div className="flex flex-col w-full max-md:mt-4">
                <div className="pb-6">
                  <div className="border-b border-white-400/30 from-slate-600/60 to-slate-700/60">
                    <h1 className="text-white text-2xl text-left max-md:text-lg">Minha Conta</h1>
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <div className="text-left bg-[#4C6680] rounded-xl p-6 mb-6 max-md:p-3 max-md:mb-4">
                    <h3 className="text-white text-lg font-semibold mb-4 max-md:text-base">Detalhes</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-gray-300 text-sm font-medium mb-2 max-md:text-xs">Nome de Usuário</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full bg-white/90 text-gray-800 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all max-md:py-2 max-md:px-2 max-md:text-sm"
                          placeholder="Seu nome de usuário"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2 max-md:text-xs">E-mail</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full bg-white/90 text-gray-800 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all max-md:py-2 max-md:px-2 max-md:text-sm"
                          placeholder="seu@email.com"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2 max-md:text-xs">Nova Senha</label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full bg-white/90 text-gray-800 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all max-md:py-2 max-md:px-2 max-md:text-sm"
                          placeholder="••••••••"
                        />
                        <p className="text-xs text-gray-400 mt-1 max-md:text-[10px]">Deixe em branco para manter a senha atual</p>
                      </div>
                      <button
                        type="submit"
                        disabled={updating}
                        className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white py-3 px-4 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-6 max-md:py-2 max-md:px-2 max-md:text-sm"
                      >
                        {updating ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-[5rem] border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Salvando...
                          </div>
                        ) : (
                          'Salvar Mudanças'
                        )}
                      </button>
                    </form>
                  </div>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="w-fit ml-auto bg-red-600/90 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors border border-red-500/50 shadow-lg flex items-center justify-center gap-2 max-md:py-2 max-md:px-2 max-md:text-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Deletar Conta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};