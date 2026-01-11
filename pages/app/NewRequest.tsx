import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Priority } from '../../types';
import { db } from '../../services/mockSupabase';
import { Icons } from '../../components/Icons';

interface Props {
  user: User;
}

const NewRequest: React.FC<Props> = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Manutenção Predial',
    priority: Priority.LOW,
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await db.createServiceRequest(formData, user);
    setLoading(false);
    navigate('/app');
  };

  return (
    <div className="max-w-3xl mx-auto pb-8">
      <div className="mb-6 md:mb-8">
        <button onClick={() => navigate('/app')} className="mb-4 text-gray-500 flex items-center gap-1 text-sm md:hidden">
           <Icons.ArrowLeft size={16} /> Voltar
        </button>
        <h1 className="text-2xl md:text-3xl font-bold font-heading text-jlm-dark">Solicitar Novo Serviço</h1>
        <p className="text-gray-500 text-sm md:text-base">Descreva o problema para enviarmos o profissional ideal.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de Serviço</label>
              <div className="relative">
                <Icons.Wrench className="absolute left-4 top-4 text-gray-400" size={20} />
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-jlm-blue outline-none appearance-none text-gray-800 font-medium text-base"
                >
                  <option>Manutenção Predial</option>
                  <option>Elétrica</option>
                  <option>Hidráulica</option>
                  <option>Jardinagem</option>
                  <option>Carpintaria</option>
                  <option>Interfonia</option>
                  <option>Desentupimento</option>
                  <option>T.I. (Computadores e Redes)</option>
                  <option>Decoração de Natal</option>
                </select>
                <Icons.ArrowRight className="absolute right-4 top-4 text-gray-400 rotate-90 md:rotate-0" size={16} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Prioridade</label>
              <div className="relative">
                <Icons.AlertTriangle className="absolute left-4 top-4 text-gray-400" size={20} />
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value as Priority})}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-jlm-blue outline-none appearance-none text-gray-800 font-medium text-base"
                >
                  <option value={Priority.LOW}>Baixa</option>
                  <option value={Priority.MEDIUM}>Média</option>
                  <option value={Priority.HIGH}>Alta (Urgência)</option>
                </select>
                <Icons.ArrowRight className="absolute right-4 top-4 text-gray-400 rotate-90 md:rotate-0" size={16} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Descrição Detalhada</label>
            <textarea
              required
              rows={6}
              className="w-full p-4 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-jlm-blue outline-none resize-none text-base"
              placeholder="Descreva o problema, local exato e melhor horário para visita..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Fotos (Opcional)</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition active:bg-blue-50 cursor-pointer">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                 <Icons.Image size={24} />
              </div>
              <p className="text-sm font-bold text-gray-600">Toque para adicionar fotos</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG (Max 5MB)</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col md:flex-row items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/app')}
              className="w-full md:w-auto px-6 py-4 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-8 py-4 bg-jlm-blue text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition flex justify-center items-center gap-2 active:scale-95"
            >
              {loading ? 'Enviando...' : <><Icons.Check size={20} /> Enviar Solicitação</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewRequest;