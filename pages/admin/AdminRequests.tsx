
import React, { useEffect, useState } from 'react';
import { db } from '../../services/mockSupabase';
import { ServiceRequest, RequestStatus, Priority } from '../../types';
import { Icons } from '../../components/Icons';

const AdminRequests: React.FC = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Abas: 'condo' (áreas comuns) ou 'resident' (unidades privativas)
  const [activeTab, setActiveTab] = useState<'condo' | 'resident'>('condo');
  
  const [filterText, setFilterText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await db.getServiceRequests();
    setRequests(data);
    setLoading(false);
  };

  const filtered = requests.filter(r => {
    const isRightScope = activeTab === 'condo' ? !r.is_private : r.is_private;
    const matchesText = 
      r.protocol.toLowerCase().includes(filterText.toLowerCase()) ||
      r.condo_name.toLowerCase().includes(filterText.toLowerCase()) ||
      r.type.toLowerCase().includes(filterText.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;

    return isRightScope && matchesText && matchesStatus;
  });

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case Priority.HIGH: return 'text-red-600 bg-red-50 border-red-100';
      case Priority.MEDIUM: return 'text-orange-600 bg-orange-50 border-orange-100';
      case Priority.LOW: return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.WAITING_PAYMENT: return 'bg-purple-100 text-purple-700 border-purple-200';
      case RequestStatus.OPEN: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case RequestStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-700 border-blue-200';
      case RequestStatus.COMPLETED: return 'bg-green-100 text-green-700 border-green-200';
      case RequestStatus.CANCELED: return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header com Abas */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-jlm-dark">Central de Chamados</h1>
          <p className="text-gray-500 text-sm">Gerencie solicitações de áreas comuns e moradores.</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200">
           <button 
             onClick={() => { setActiveTab('condo'); setFilterStatus('all'); }}
             className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'condo' ? 'bg-white text-jlm-blue shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
           >
             <Icons.Building size={18} /> Condomínios
           </button>
           <button 
             onClick={() => { setActiveTab('resident'); setFilterStatus('all'); }}
             className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'resident' ? 'bg-white text-purple-600 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
           >
             <Icons.User size={18} /> Moradores
           </button>
        </div>
      </div>

      {/* Cards de Resumo para Moradores */}
      {activeTab === 'resident' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="bg-purple-50 border border-purple-100 p-4 rounded-2xl flex items-center justify-between">
              <div>
                 <p className="text-[10px] font-bold text-purple-500 uppercase">Aguardando Pagamento</p>
                 <p className="text-2xl font-bold text-purple-700">{requests.filter(r => r.is_private && r.status === RequestStatus.WAITING_PAYMENT).length}</p>
              </div>
              <div className="p-3 bg-white rounded-xl text-purple-600 shadow-sm"><Icons.Smartphone size={20} /></div>
           </div>
           <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center justify-between">
              <div>
                 <p className="text-[10px] font-bold text-blue-500 uppercase">Em Andamento</p>
                 <p className="text-2xl font-bold text-blue-700">{requests.filter(r => r.is_private && r.status === RequestStatus.IN_PROGRESS).length}</p>
              </div>
              <div className="p-3 bg-white rounded-xl text-blue-600 shadow-sm"><Icons.Activity size={20} /></div>
           </div>
           <div className="bg-green-50 border border-green-100 p-4 rounded-2xl flex items-center justify-between">
              <div>
                 <p className="text-[10px] font-bold text-green-500 uppercase">Concluídos</p>
                 <p className="text-2xl font-bold text-green-700">{requests.filter(r => r.is_private && r.status === RequestStatus.COMPLETED).length}</p>
              </div>
              <div className="p-3 bg-white rounded-xl text-green-600 shadow-sm"><Icons.CheckCircle size={20} /></div>
           </div>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 p-1 w-full xl:w-auto">
          <div className="relative flex-1">
            <Icons.Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar chamado..."
              className="pl-9 pr-3 py-1.5 text-sm bg-transparent outline-none w-full xl:w-64"
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
            />
          </div>
          <div className="w-px bg-gray-200 mx-2"></div>
          <select 
            className="bg-transparent text-sm text-gray-600 outline-none cursor-pointer px-2"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos os Status</option>
            {Object.values(RequestStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex-1">
         {loading ? (
            <div className="p-12 text-center text-gray-400"><Icons.Loader className="animate-spin inline mr-2" /> Carregando...</div>
         ) : filtered.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center gap-4">
               <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                  <Icons.Inbox size={32} />
               </div>
               <p className="text-gray-500 font-medium">Nenhum chamado nesta categoria.</p>
            </div>
         ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Protocolo / Data</th>
                    <th className="px-6 py-4">Serviço / Local</th>
                    <th className="px-6 py-4">Solicitante</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {filtered.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => window.location.hash = `/admin/request/${r.id}`}>
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs font-bold text-gray-800">{r.protocol}</div>
                        <div className="text-[10px] text-gray-400">{new Date(r.created_at).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-800">{r.type}</div>
                        <div className="text-xs text-gray-500">{r.condo_name} {r.unit_info && `• ${r.unit_info}`}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-700 font-medium">{r.requester_name || r.syndic_name}</div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getPriorityColor(r.priority)}`}>{r.priority}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(r.status)}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <Icons.ArrowRight size={18} className="text-gray-300 inline" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
         )}
      </div>
    </div>
  );
};

export default AdminRequests;
