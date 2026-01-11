
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ServiceRequest, RequestStatus } from '../../types';
import { db } from '../../services/mockSupabase';
import { Icons } from '../../components/Icons';

interface Props {
  user: User;
  showHistory?: boolean;
}

const statusColor = (status: RequestStatus) => {
  switch (status) {
    case RequestStatus.PENDING_APPROVAL: return 'text-orange-700 bg-orange-50 border-orange-200';
    case RequestStatus.OPEN: return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    case RequestStatus.IN_PROGRESS: return 'text-blue-700 bg-blue-50 border-blue-200';
    case RequestStatus.COMPLETED: return 'text-green-700 bg-green-50 border-green-200';
    case RequestStatus.CANCELED: return 'text-red-700 bg-red-50 border-red-200';
    default: return 'text-gray-600 bg-gray-50';
  }
};

const SyndicDashboard: React.FC<Props> = ({ user, showHistory = false }) => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [user, showHistory]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await db.getServiceRequests(user.id, user.role);
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(window.confirm('Aprovar esta solicitação para envio à administração?')) {
       setActionLoading(id);
       try {
         await db.updateServiceRequest(id, { status: RequestStatus.OPEN });
         await db.addTimelineEvent(id, 'Aprovado pelo Síndico', `O síndico ${user.name} aprovou a solicitação para execução.`);
         await fetchData();
         alert('Chamado aprovado e enviado para a JLM!');
       } catch (err: any) {
         alert('Erro ao aprovar: ' + err.message);
       } finally {
         setActionLoading(null);
       }
    }
  };

  const handleReject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(window.confirm('Rejeitar esta solicitação de área comum?')) {
       setActionLoading(id);
       try {
         await db.updateServiceRequest(id, { status: RequestStatus.CANCELED });
         await db.addTimelineEvent(id, 'Rejeitado pelo Síndico', `Solicitação cancelada pelo síndico.`);
         await fetchData();
       } catch (err: any) {
         alert('Erro ao rejeitar: ' + err.message);
       } finally {
         setActionLoading(null);
       }
    }
  };

  const pendingApprovals = requests.filter(r => r.status === RequestStatus.PENDING_APPROVAL);

  const baseRequests = showHistory 
    ? requests.filter(r => r.status === RequestStatus.COMPLETED || r.status === RequestStatus.CANCELED)
    : requests.filter(r => r.status !== RequestStatus.COMPLETED && r.status !== RequestStatus.CANCELED && r.status !== RequestStatus.PENDING_APPROVAL);

  const displayedRequests = activeFilter === 'ALL' 
    ? baseRequests 
    : baseRequests.filter(r => r.status === activeFilter);

  const filters = [
    { id: 'ALL', label: 'Todos' },
    { id: RequestStatus.OPEN, label: 'Abertos' },
    { id: RequestStatus.IN_PROGRESS, label: 'Andamento' },
  ];

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-gray-900 tracking-tight">
            {showHistory ? 'Histórico Geral' : `Olá, ${user.name.split(' ')[0]}`}
          </h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">
            {showHistory ? 'Arquivo de solicitações.' : 'Gestão do Condomínio ' + (user.condo_name || '')}
          </p>
        </div>
        {!showHistory && (
          <Link to="/app/new-request" className="w-full md:w-auto flex justify-center items-center gap-2 bg-jlm-blue hover:bg-blue-600 text-white px-6 py-3.5 rounded-xl font-bold transition shadow-lg shadow-blue-500/20">
            <Icons.Plus size={20} /> Novo Chamado (Adm)
          </Link>
        )}
      </div>

      {!showHistory && pendingApprovals.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 shadow-sm">
           <div className="flex items-center gap-2 text-orange-800 font-bold mb-4">
              <Icons.AlertTriangle size={20} />
              <h2>Aprovações Pendentes de Moradores ({pendingApprovals.length})</h2>
           </div>
           <div className="grid gap-4 md:grid-cols-2">
              {pendingApprovals.map(req => (
                 <div key={req.id} onClick={() => navigate(`/app/request/${req.id}`)} className="bg-white p-5 rounded-xl border border-orange-100 cursor-pointer hover:shadow-md transition group">
                    <div className="flex justify-between items-start mb-3">
                       <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-1 rounded font-bold uppercase tracking-wider">
                          {req.unit_info || 'Área Comum'}
                       </span>
                       <span className="text-[10px] text-gray-400 font-medium">{new Date(req.created_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-1 group-hover:text-jlm-blue transition-colors">{req.type}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{req.description}</p>
                    <div className="flex gap-2">
                       <button 
                         disabled={actionLoading === req.id}
                         onClick={(e) => handleApprove(req.id, e)} 
                         className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-1"
                       >
                         {actionLoading === req.id ? <Icons.Loader className="animate-spin" size={14} /> : <Icons.Check size={16} />} Aprovar
                       </button>
                       <button 
                         disabled={actionLoading === req.id}
                         onClick={(e) => handleReject(req.id, e)} 
                         className="flex-1 bg-white border border-red-200 text-red-600 py-2 rounded-lg text-sm font-bold hover:bg-red-50 transition disabled:opacity-50"
                       >
                         Recusar
                       </button>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      )}

      <div className="bg-white md:rounded-2xl md:shadow-sm md:border md:border-gray-100 overflow-hidden">
        <div className="hidden md:flex p-6 border-b border-gray-50 justify-between items-center">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <Icons.ClipboardList size={20} className="text-gray-400" />
            {showHistory ? 'Registros Encerrados' : 'Chamados Ativos'}
          </h2>
          {!showHistory && (
             <div className="flex bg-gray-100 rounded-lg p-1 border">
               {filters.map(f => (
                 <button key={f.id} onClick={() => setActiveFilter(f.id)} className={`px-4 py-1.5 text-xs font-bold rounded-md transition ${activeFilter === f.id ? 'bg-white text-jlm-blue shadow-sm' : 'text-gray-500'}`}>
                   {f.label}
                 </button>
               ))}
             </div>
          )}
        </div>
        
        {loading ? (
          <div className="p-12 text-center text-gray-400"><Icons.Loader className="animate-spin inline mr-2" /> Carregando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left hidden md:table">
              <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Data / Protocolo</th>
                  <th className="px-6 py-4">Serviço</th>
                  <th className="px-6 py-4">Solicitante</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {displayedRequests.map(req => (
                  <tr key={req.id} className="hover:bg-gray-50/50 transition cursor-pointer" onClick={() => navigate(`/app/request/${req.id}`)}>
                    <td className="px-6 py-4">
                       <p className="text-sm font-bold text-gray-800">{new Date(req.created_at).toLocaleDateString()}</p>
                       <p className="text-[10px] font-mono text-gray-400 uppercase">{req.protocol}</p>
                    </td>
                    <td className="px-6 py-4">
                       <p className="font-bold text-gray-800">{req.type}</p>
                       {req.is_private && <span className="text-[10px] text-purple-600 font-bold uppercase tracking-tight">Privado</span>}
                    </td>
                    <td className="px-6 py-4">
                       <p className="text-sm text-gray-600">{req.requester_name || req.syndic_name}</p>
                       {req.unit_info && <p className="text-xs text-gray-400">{req.unit_info}</p>}
                    </td>
                    <td className="px-6 py-4">
                       <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${statusColor(req.status)}`}>
                         {req.status}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <Icons.ArrowRight className="text-gray-300 inline" size={18} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="md:hidden p-4 space-y-4">
               {displayedRequests.map(req => (
                 <div key={req.id} onClick={() => navigate(`/app/request/${req.id}`)} className="bg-white p-4 rounded-xl border shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-xs font-bold text-gray-800">{req.type}</span>
                       <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${statusColor(req.status)}`}>{req.status}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">{req.description}</p>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SyndicDashboard;
