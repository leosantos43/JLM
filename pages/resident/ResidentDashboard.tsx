
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ServiceRequest, RequestStatus } from '../../types';
import { db } from '../../services/mockSupabase';
import { Icons } from '../../components/Icons';

interface Props {
  user: User;
}

const getStatusBadge = (r: ServiceRequest) => {
  if (r.status === RequestStatus.PENDING_APPROVAL) {
    return (
       <span className="flex items-center gap-1 px-2 py-1 rounded bg-orange-100 text-orange-700 text-[10px] font-bold border border-orange-200 uppercase tracking-wide">
          <Icons.Clock size={10} /> Em Análise
       </span>
    );
  }
  switch (r.status) {
    case RequestStatus.OPEN: return <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-[10px] font-bold border border-yellow-200 uppercase tracking-wide">Aberto</span>;
    case RequestStatus.IN_PROGRESS: return <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-[10px] font-bold border border-blue-200 uppercase tracking-wide">Em Andamento</span>;
    case RequestStatus.COMPLETED: return <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-[10px] font-bold border border-green-200 uppercase tracking-wide">Concluído</span>;
    case RequestStatus.CANCELED: return <span className="px-2 py-1 rounded bg-red-100 text-red-800 text-[10px] font-bold border border-red-200 uppercase tracking-wide">Cancelado</span>;
    default: return <span className="px-2 py-1 rounded bg-gray-100 text-gray-600 text-[10px] font-bold border border-gray-200 uppercase tracking-wide">{r.status}</span>;
  }
};

const RequestCard: React.FC<{ req: ServiceRequest }> = ({ req }) => {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate(`/resident/request/${req.id}`)}
      className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden"
    >
      <div className={`absolute left-0 top-0 h-full w-1.5 ${req.is_private ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
      
      <div className="flex justify-between items-start mb-3 pl-3">
         <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
               <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{req.protocol}</span>
               {!req.is_private && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold uppercase border border-blue-100">Área Comum</span>}
            </div>
            <h3 className="font-bold text-gray-800 text-lg leading-tight group-hover:text-jlm-blue transition-colors">{req.type}</h3>
         </div>
         {getStatusBadge(req)}
      </div>
      
      <p className="text-sm text-gray-500 line-clamp-2 pl-3 mb-4 min-h-[40px]">{req.description}</p>
      
      <div className="flex items-center justify-between pl-3 pt-3 border-t border-gray-50">
         <div className="flex items-center gap-2 text-xs text-gray-400">
            <Icons.Calendar size={14} /> {new Date(req.created_at).toLocaleDateString()}
         </div>
         <span className="text-jlm-blue text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            Ver detalhes <Icons.ArrowRight size={12} />
         </span>
      </div>
    </div>
  );
};

// Mock Notices Data (Em um app real, viria do banco)
const notices = [
  { id: 1, title: 'Manutenção do Elevador', date: 'Hoje', type: 'warning', text: 'O elevador social do Bloco A ficará parado das 14h às 16h.' },
  { id: 2, title: 'Assembleia Geral', date: '25/10', type: 'info', text: 'Reunião mensal no salão de festas às 19h. Contamos com sua presença.' },
];

const ResidentDashboard: React.FC<Props> = ({ user }) => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await db.getServiceRequests(user.id, user.role);
      setRequests(data);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const privateRequests = requests.filter(r => r.is_private);
  const condoRequests = requests.filter(r => !r.is_private);
  
  // Stats
  const activeCount = requests.filter(r => r.status === RequestStatus.OPEN || r.status === RequestStatus.IN_PROGRESS).length;
  const completedCount = requests.filter(r => r.status === RequestStatus.COMPLETED).length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      {/* Welcome & Quick Actions */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-gradient-to-br from-purple-700 to-indigo-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
           <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 opacity-20 rounded-full blur-2xl"></div>
           
           <div className="relative z-10 h-full flex flex-col justify-between">
             <div>
               <p className="opacity-80 text-sm font-medium mb-1 flex items-center gap-2"><Icons.Sun size={14} /> Painel do Morador</p>
               <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">Olá, {user.name.split(' ')[0]}</h1>
               <div className="flex flex-wrap gap-2">
                 <span className="flex items-center gap-1.5 text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                   <Icons.MapPin size={12} /> {user.condo_name}
                 </span>
                 <span className="flex items-center gap-1.5 text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                   <Icons.Home size={12} /> Bl. {user.block} - Apt {user.apartment}
                 </span>
               </div>
             </div>
             
             <div className="mt-8 flex gap-3">
                <Link 
                   to="/resident/new-request"
                   className="bg-white text-purple-700 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-gray-50 transition flex items-center gap-2 active:scale-95 text-sm md:text-base"
                 >
                   <Icons.PlusCircle size={18} /> Novo Chamado
                 </Link>
                 <Link 
                   to="/resident/settings"
                   className="bg-purple-600/50 hover:bg-purple-600 border border-white/20 text-white px-4 py-3 rounded-xl font-bold transition flex items-center gap-2 active:scale-95 text-sm md:text-base backdrop-blur-sm"
                 >
                   <Icons.Settings size={18} />
                 </Link>
             </div>
           </div>
        </div>

        {/* Stats & Notices Widget */}
        <div className="w-full md:w-80 flex flex-col gap-4">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                        <Icons.Activity size={20} />
                    </div>
                    <span className="text-2xl font-bold text-gray-800">{activeCount}</span>
                    <span className="text-xs text-gray-400 uppercase font-bold">Ativos</span>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-2">
                        <Icons.CheckCircle size={20} />
                    </div>
                    <span className="text-2xl font-bold text-gray-800">{completedCount}</span>
                    <span className="text-xs text-gray-400 uppercase font-bold">Resolvidos</span>
                </div>
            </div>

            {/* Notices */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex-1 flex flex-col">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Icons.Bell size={16} className="text-jlm-blue" /> Mural de Avisos
                </h3>
                <div className="space-y-3 overflow-y-auto max-h-[160px] custom-scrollbar pr-1">
                    {notices.map(notice => (
                        <div key={notice.id} className={`p-3 rounded-xl border ${notice.type === 'warning' ? 'bg-orange-50 border-orange-100' : 'bg-blue-50 border-blue-100'}`}>
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-xs font-bold ${notice.type === 'warning' ? 'text-orange-700' : 'text-blue-700'}`}>{notice.title}</span>
                                <span className="text-[10px] text-gray-400 bg-white px-1.5 rounded">{notice.date}</span>
                            </div>
                            <p className="text-xs text-gray-600 leading-snug">{notice.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center"><Icons.Loader className="animate-spin mx-auto text-purple-600" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Private Requests */}
          <div>
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                 <div className="bg-purple-100 p-1.5 rounded-lg text-purple-600"><Icons.Home size={18} /></div>
                 Minha Unidade
               </h2>
               {privateRequests.length > 0 && <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded-full text-gray-500">{privateRequests.length}</span>}
            </div>
            
            <div className="space-y-4">
              {privateRequests.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300">
                      <Icons.Inbox size={24} />
                  </div>
                  <p className="text-gray-400 text-sm">Nenhuma solicitação para sua residência.</p>
                  <Link to="/resident/new-request" className="text-purple-600 text-sm font-bold mt-2 inline-block hover:underline">Criar primeira solicitação</Link>
                </div>
              ) : (
                privateRequests.map(r => <RequestCard key={r.id} req={r} />)
              )}
            </div>
          </div>

          {/* Condo Requests */}
          <div>
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                 <div className="bg-blue-100 p-1.5 rounded-lg text-blue-600"><Icons.Building2 size={18} /></div>
                 Áreas Comuns
               </h2>
               {condoRequests.length > 0 && <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded-full text-gray-500">{condoRequests.length}</span>}
            </div>

            <div className="space-y-4">
              {condoRequests.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300">
                      <Icons.Inbox size={24} />
                  </div>
                  <p className="text-gray-400 text-sm">Você ainda não sugeriu serviços para o condomínio.</p>
                </div>
              ) : (
                condoRequests.map(r => <RequestCard key={r.id} req={r} />)
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResidentDashboard;
