
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, ServiceRequest, UserRole, RequestStatus, Priority, Professional } from '../../types';
import { db } from '../../services/mockSupabase';
import { Icons } from '../../components/Icons';
import { Chat } from '../../components/Chat';

interface Props {
  user: User;
}

const RequestDetails: React.FC<Props> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [desktopTab, setDesktopTab] = useState<'timeline' | 'chat'>('timeline');
  const [mobileTab, setMobileTab] = useState<'details' | 'chat' | 'timeline'>('details');
  const [actionLoading, setActionLoading] = useState(false);

  // Estados Admin
  const [newStatus, setNewStatus] = useState<string>('');
  const [note, setNote] = useState('');
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedProfId, setSelectedProfId] = useState<string>('');
  
  // Modais
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelMotive, setCancelMotive] = useState('');

  const isAdmin = user.role === UserRole.ADMIN;
  const isSyndic = user.role === UserRole.SYNDIC;
  const isResident = user.role === UserRole.RESIDENT;

  useEffect(() => {
    loadRequest();
    if (isAdmin) {
      db.getProfessionals().then(data => setProfessionals(data.filter(p => p.active)));
    }
  }, [id, isAdmin]);

  const loadRequest = async () => {
    if (id) {
      setLoading(true);
      const reqs = await db.getServiceRequests();
      const found = reqs.find(r => r.id === id);
      setRequest(found || null);
      if(found) {
        setNewStatus(found.status);
        setSelectedProfId(found.professional_id || '');
      }
      setLoading(false);
    }
  };

  const handleApproveSyndic = async () => {
    if (!request) return;
    setActionLoading(true);
    try {
      await db.updateServiceRequest(request.id, { status: RequestStatus.OPEN });
      await db.addTimelineEvent(request.id, 'Aprovado pelo Síndico', `Solicitação validada e enviada para a administração.`);
      await loadRequest();
    } catch (e) {
      alert('Erro ao processar aprovação.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAdminUpdate = async () => {
    if (!request) return;
    setActionLoading(true);
    try {
      // 1. Atualizar Profissional
      if (selectedProfId && selectedProfId !== request.professional_id) {
        await db.assignProfessional(request.id, selectedProfId);
      }
      
      // 2. Atualizar Status e Notas
      const updatePayload: Partial<ServiceRequest> = { 
        status: newStatus as RequestStatus,
        admin_notes: note || request.admin_notes
      };

      await db.updateServiceRequest(request.id, updatePayload);
      
      // 3. Registrar na Timeline se mudou status
      if (newStatus !== request.status) {
        let title = 'Status Atualizado';
        let desc = `Novo status: ${newStatus}`;

        if (newStatus === RequestStatus.WAITING_PAYMENT) {
          title = 'Aguardando Pagamento';
          desc = "A administração solicitou o pagamento do morador via PIX (dados enviados no chat).";
        } else if (newStatus === RequestStatus.IN_PROGRESS) {
          title = 'Serviço em Andamento';
          desc = "Iniciada a execução técnica do chamado.";
        }

        await db.addTimelineEvent(request.id, title, desc);
      }
      
      setNote('');
      await loadRequest();
      alert('Atualizado com sucesso!');
    } catch (e) {
      alert('Erro ao salvar alterações no banco de dados. Verifique se o status é válido.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelByAdmin = async () => {
    if (!request || !cancelMotive.trim()) return;
    setActionLoading(true);
    try {
      await db.updateServiceRequest(request.id, { 
        status: RequestStatus.CANCELED,
        admin_notes: cancelMotive 
      });
      await db.addTimelineEvent(request.id, 'Chamado Cancelado', `Motivo: ${cancelMotive}`);
      setIsCancelModalOpen(false);
      setCancelMotive('');
      await loadRequest();
    } catch (e) {
      alert('Erro ao cancelar chamado.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center"><Icons.Loader className="animate-spin inline" /></div>;
  if (!request) return <div className="p-20 text-center">Chamado não encontrado.</div>;

  // Sub-renders fixos (Não declarados como componentes para evitar perda de foco)
  const renderDetailsContent = () => (
    <div className="space-y-6 pb-20 md:pb-0">
      {request.status === RequestStatus.CANCELED && request.admin_notes && (
        <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-6 flex items-start gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-xl"><Icons.X size={24} /></div>
          <div>
            <h3 className="font-bold text-red-800 text-lg">Chamado Cancelado</h3>
            <p className="text-red-700 font-medium mt-1 italic">"{request.admin_notes}"</p>
          </div>
        </div>
      )}

      {request.status === RequestStatus.WAITING_PAYMENT && (
        <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 flex items-start gap-4 animate-pulse">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><Icons.Smartphone size={24} /></div>
          <div>
            <h3 className="font-bold text-purple-900 text-lg">Aguardando Pagamento</h3>
            <p className="text-purple-700 text-sm mt-1">A JLM enviou o valor e a chave PIX no <strong>Chat</strong>. Por favor, envie o comprovante por lá para darmos andamento.</p>
          </div>
        </div>
      )}

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
        {request.is_private && <div className="absolute top-0 left-0 w-full h-1.5 bg-purple-500"></div>}
        <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500 uppercase">{request.protocol}</span>
               <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${request.priority === Priority.HIGH ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-blue-600'}`}>
                 Prioridade {request.priority}
               </span>
               {request.is_private && <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase bg-purple-50 text-purple-600 border border-purple-100">Particular</span>}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{request.type}</h1>
          </div>
          <div className="bg-gray-50 px-4 py-2 rounded-xl border h-fit text-sm font-bold text-gray-700 uppercase">
            {request.status}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
           <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Solicitante</p>
              <p className="font-bold text-gray-800">{request.requester_name || request.syndic_name}</p>
              <p className="text-xs text-gray-500">{request.unit_info || 'Área Comum'}</p>
           </div>
           <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Localização</p>
              <p className="font-bold text-gray-800">{request.condo_name}</p>
              <p className="text-xs text-gray-500">Prédio Registrado</p>
           </div>
        </div>

        <div className="mb-6">
           <h3 className="font-bold text-gray-800 mb-2">Descrição</h3>
           <div className="bg-gray-50 p-4 rounded-xl border text-sm text-gray-600 whitespace-pre-wrap">
              {request.description}
           </div>
        </div>

        {isSyndic && request.status === RequestStatus.PENDING_APPROVAL && (
           <div className="mt-8 p-6 bg-orange-50 border-2 border-dashed border-orange-200 rounded-2xl">
              <div className="flex items-center gap-3 mb-4 text-orange-800 font-bold">
                 <Icons.AlertTriangle size={24} /> Autorização de Síndico Pendente
              </div>
              <button onClick={handleApproveSyndic} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition shadow-lg flex items-center justify-center gap-2">
                {actionLoading ? <Icons.Loader className="animate-spin" /> : <Icons.CheckCircle />} Autorizar Execução
              </button>
           </div>
        )}
      </div>

      {isAdmin && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Icons.Wrench size={20} className="text-jlm-blue" /> Gestão Administrativa
            </h3>
            {request.status !== RequestStatus.CANCELED && (
              <button onClick={() => setIsCancelModalOpen(true)} className="text-red-500 hover:text-red-700 text-xs font-bold uppercase flex items-center gap-1.5">
                <Icons.Trash2 size={16} /> Cancelar Chamado
              </button>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
             <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Técnico Designado</label>
               <select className="w-full border rounded-xl p-3 bg-gray-50" value={selectedProfId} onChange={e => setSelectedProfId(e.target.value)}>
                  <option value="">Aguardando seleção...</option>
                  {professionals.map(p => <option key={p.id} value={p.id}>{p.name} ({p.specialty})</option>)}
               </select>
             </div>
             <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Status Atual</label>
               <select className="w-full border rounded-xl p-3 bg-gray-50" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  {Object.values(RequestStatus).map(s => <option key={s} value={s}>{s}</option>)}
               </select>
             </div>
             <div className="md:col-span-2">
               <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Notas Administrativas</label>
               <textarea className="w-full border rounded-xl p-3 bg-gray-50 h-24" placeholder="Observações internas..." value={note} onChange={e => setNote(e.target.value)} />
             </div>
          </div>
          <button onClick={handleAdminUpdate} disabled={actionLoading} className="w-full bg-jlm-dark text-white font-bold py-4 rounded-xl hover:bg-black transition flex items-center justify-center gap-2 shadow-lg">
            {actionLoading ? <Icons.Loader className="animate-spin" /> : <Icons.Check />} Salvar Atualizações
          </button>
        </div>
      )}
    </div>
  );

  const renderTimelineContent = () => (
    <div className="bg-white p-6 rounded-2xl h-full relative overflow-y-auto">
       <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-100"></div>
       <div className="space-y-8 relative">
          {(request?.timeline || []).map((event, idx) => (
             <div key={event.id} className="relative pl-10">
                <div className={`absolute left-[-4px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white ${idx === 0 ? 'bg-jlm-blue ring-4 ring-blue-50' : 'bg-gray-300'}`}></div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(event.timestamp).toLocaleString()}</p>
                <h4 className="font-bold text-gray-800 text-sm mt-0.5">{event.title}</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{event.description}</p>
             </div>
          ))}
       </div>
    </div>
  );

  return (
    <div className="h-full">
      <div className="hidden md:grid grid-cols-3 gap-6 h-[calc(100vh-140px)]">
        <div className="col-span-2 overflow-y-auto pr-2 custom-scrollbar">
          {renderDetailsContent()}
        </div>
        <div className="flex flex-col bg-white rounded-2xl shadow-sm border overflow-hidden">
           <div className="flex bg-gray-50 border-b">
              <button onClick={() => setDesktopTab('timeline')} className={`flex-1 py-4 text-sm font-bold ${desktopTab === 'timeline' ? 'bg-white border-b-2 border-jlm-blue text-jlm-blue' : 'text-gray-400'}`}>Timeline</button>
              <button onClick={() => setDesktopTab('chat')} className={`flex-1 py-4 text-sm font-bold ${desktopTab === 'chat' ? 'bg-white border-b-2 border-jlm-blue text-jlm-blue' : 'text-gray-400'}`}>Chat</button>
           </div>
           <div className="flex-1 overflow-y-auto">
              {desktopTab === 'timeline' ? renderTimelineContent() : <Chat requestId={request.id} user={user} />}
           </div>
        </div>
      </div>

      <div className="md:hidden flex flex-col h-full">
         <div className="flex-1 overflow-y-auto">
            {mobileTab === 'details' && renderDetailsContent()}
            {mobileTab === 'chat' && <div className="h-[calc(100vh-250px)]"><Chat requestId={request.id} user={user} /></div>}
            {mobileTab === 'timeline' && <div className="p-4">{renderTimelineContent()}</div>}
         </div>
         <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 flex justify-around z-50">
            <button onClick={() => setMobileTab('details')} className={`flex flex-col items-center gap-1 ${mobileTab === 'details' ? 'text-jlm-blue' : 'text-gray-400'}`}><Icons.FileText size={20} /><span className="text-[10px]">Info</span></button>
            <button onClick={() => setMobileTab('chat')} className={`flex flex-col items-center gap-1 ${mobileTab === 'chat' ? 'text-jlm-blue' : 'text-gray-400'}`}><Icons.MessageCircle size={20} /><span className="text-[10px]">Chat</span></button>
            <button onClick={() => setMobileTab('timeline')} className={`flex flex-col items-center gap-1 ${mobileTab === 'timeline' ? 'text-jlm-blue' : 'text-gray-400'}`}><Icons.Clock size={20} /><span className="text-[10px]">Histórico</span></button>
         </div>
      </div>

      {isCancelModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cancelar Chamado</h3>
              <p className="text-gray-500 text-sm mb-4">Informe o motivo do cancelamento:</p>
              <textarea 
                className="w-full border rounded-xl p-4 bg-gray-50 outline-none resize-none text-sm h-32"
                placeholder="Ex: Peça não encontrada no mercado..."
                value={cancelMotive}
                onChange={e => setCancelMotive(e.target.value)}
              />
              <div className="flex gap-3 mt-6">
                <button onClick={() => setIsCancelModalOpen(false)} className="flex-1 py-3 text-gray-600 font-bold">Voltar</button>
                <button disabled={!cancelMotive.trim()} onClick={handleCancelByAdmin} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl disabled:opacity-50">Confirmar</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default RequestDetails;
