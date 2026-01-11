
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Priority } from '../../types';
import { db } from '../../services/mockSupabase';
import { Icons } from '../../components/Icons';

interface Props {
  user: User;
}

const NewResidentRequest: React.FC<Props> = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [scope, setScope] = useState<'private' | 'condo'>('private');
  const [formData, setFormData] = useState({
    type: 'Manutenção Geral',
    priority: Priority.LOW,
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await db.createServiceRequest({
      ...formData,
      is_private: scope === 'private'
    }, user);
    
    setLoading(false);
    navigate('/resident');
  };

  return (
    <div className="max-w-3xl mx-auto pb-8">
      <div className="mb-6">
        <button onClick={() => navigate('/resident')} className="mb-4 text-gray-500 flex items-center gap-1 text-sm">
           <Icons.ArrowLeft size={16} /> Voltar
        </button>
        <h1 className="text-2xl md:text-3xl font-bold font-heading text-jlm-dark">Nova Solicitação</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Scope Selector */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Onde é o serviço?</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div 
                 onClick={() => setScope('private')}
                 className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                   scope === 'private' 
                     ? 'border-purple-500 bg-purple-50' 
                     : 'border-gray-100 hover:border-purple-200'
                 }`}
               >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${scope === 'private' ? 'border-purple-500' : 'border-gray-300'}`}>
                    {scope === 'private' && <div className="w-3 h-3 bg-purple-500 rounded-full"></div>}
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 block">Minha Unidade</span>
                    <span className="text-xs text-gray-500">Reparos internos no apartamento</span>
                  </div>
               </div>
               
               <div 
                 onClick={() => setScope('condo')}
                 className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                   scope === 'condo' 
                     ? 'border-blue-500 bg-blue-50' 
                     : 'border-gray-100 hover:border-blue-200'
                 }`}
               >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${scope === 'condo' ? 'border-blue-500' : 'border-gray-300'}`}>
                     {scope === 'condo' && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 block">Área Comum (Condomínio)</span>
                    <span className="text-xs text-gray-500">Sugestão ou reparo no prédio</span>
                  </div>
               </div>
            </div>
            
            {scope === 'condo' && (
              <div className="mt-3 flex items-start gap-2 text-xs text-orange-700 bg-orange-50 p-3 rounded-lg border border-orange-100">
                <Icons.AlertTriangle size={14} className="mt-0.5" />
                <span>Solicitações para o condomínio passarão pela aprovação do síndico antes de serem encaminhadas para a administração.</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de Serviço</label>
              <div className="relative">
                <Icons.Wrench className="absolute left-4 top-4 text-gray-400" size={20} />
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-jlm-blue outline-none appearance-none font-medium"
                >
                  <option>Manutenção Geral</option>
                  <option>Elétrica</option>
                  <option>Hidráulica</option>
                  <option>T.I. / Internet</option>
                  <option>Interfonia</option>
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
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-jlm-blue outline-none appearance-none font-medium"
                >
                  <option value={Priority.LOW}>Baixa</option>
                  <option value={Priority.MEDIUM}>Média</option>
                  <option value={Priority.HIGH}>Alta</option>
                </select>
                <Icons.ArrowRight className="absolute right-4 top-4 text-gray-400 rotate-90 md:rotate-0" size={16} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Descrição</label>
            <textarea
              required
              rows={5}
              className="w-full p-4 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-jlm-blue outline-none resize-none"
              placeholder="Descreva o problema e o local..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <div className="pt-4 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/resident')}
              className="px-6 py-4 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-jlm-blue text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              {loading ? 'Enviando...' : <><Icons.Check size={20} /> Enviar Solicitação</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewResidentRequest;
