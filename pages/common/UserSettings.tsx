import React, { useState } from 'react';
import { User } from '../../types';
import { db } from '../../services/mockSupabase';
import { Icons } from '../../components/Icons';

interface Props {
  user: User;
}

const UserSettings: React.FC<Props> = ({ user }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'As novas senhas não coincidem.' });
      setLoading(false);
      return;
    }

    if (newPassword.length < 3) {
      setMessage({ type: 'error', text: 'A senha deve ter pelo menos 3 caracteres.' });
      setLoading(false);
      return;
    }

    // Verify current password first by trying to login
    const { user: verifiedUser, error } = await db.login(user.email, currentPassword);

    if (!verifiedUser || error) {
       setMessage({ type: 'error', text: 'Senha atual incorreta.' });
       setLoading(false);
       return;
    }

    const success = await db.changePassword(user.id, newPassword);

    if (success) {
      setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setMessage({ type: 'error', text: 'Erro ao alterar senha.' });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-jlm-dark">Minha Conta</h1>
        <p className="text-gray-500">Gerencie suas configurações de segurança e acesso.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8">
           <div className="flex items-center gap-4 mb-8">
             <div className="w-16 h-16 rounded-full bg-gradient-to-br from-jlm-blue to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
               {user.name.charAt(0)}
             </div>
             <div>
               <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
               <p className="text-gray-500">{user.email}</p>
               <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded mt-1 inline-block uppercase">
                 {user.role === 'admin' ? 'Administrador' : 'Síndico'}
               </span>
             </div>
           </div>

           <div className="border-t border-gray-100 pt-8">
             <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800">
               <Icons.Lock size={20} className="text-jlm-blue" />
               Alterar Senha
             </h3>

             {message && (
               <div className={`p-4 rounded-xl mb-6 text-sm flex items-center gap-3 border ${
                 message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
               }`}>
                 {message.type === 'success' ? <Icons.CheckCircle size={20} /> : <Icons.AlertTriangle size={20} />}
                 {message.text}
               </div>
             )}

             <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Senha Atual</label>
                 <input 
                   type="password"
                   required
                   className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-jlm-blue outline-none"
                   value={currentPassword}
                   onChange={(e) => setCurrentPassword(e.target.value)}
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                 <input 
                   type="password"
                   required
                   className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-jlm-blue outline-none"
                   value={newPassword}
                   onChange={(e) => setNewPassword(e.target.value)}
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
                 <input 
                   type="password"
                   required
                   className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-jlm-blue outline-none"
                   value={confirmPassword}
                   onChange={(e) => setConfirmPassword(e.target.value)}
                 />
               </div>
               
               <div className="pt-2">
                 <button 
                   type="submit" 
                   disabled={loading}
                   className="px-6 py-2.5 bg-jlm-dark text-white font-bold rounded-xl hover:bg-black transition disabled:opacity-70 flex items-center gap-2"
                 >
                   {loading ? 'Salvando...' : 'Atualizar Senha'}
                 </button>
               </div>
             </form>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;