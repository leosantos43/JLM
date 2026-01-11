
import React, { useEffect, useState } from 'react';
import { db } from '../../services/mockSupabase';
import { Condominium, User, UserRole } from '../../types';
import { Icons } from '../../components/Icons';

const AdminCondos: React.FC = () => {
  const [condos, setCondos] = useState<Condominium[]>([]);
  const [syndics, setSyndics] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    syndic_id: '',
    towers: 1,
    residents_count: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [condoData, userData] = await Promise.all([
        db.getCondominiums(),
        db.getUsers()
      ]);
      setCondos(condoData);
      setSyndics(userData.filter(u => u.role === UserRole.SYNDIC));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedSyndic = syndics.find(s => s.id === formData.syndic_id);
      await db.createCondominium({
        name: formData.name,
        address: formData.address,
        syndic_id: formData.syndic_id || undefined,
        syndic_name: selectedSyndic ? selectedSyndic.name : undefined,
        towers: Number(formData.towers),
        residents_count: Number(formData.residents_count)
      });
      setIsModalOpen(false);
      setFormData({ name: '', address: '', syndic_id: '', towers: 1, residents_count: 0 });
      await loadData();
    } catch (err: any) {
      alert('Erro ao criar condomínio: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if(window.confirm('Excluir este condomínio? Registros e moradores vinculados podem ser afetados.')) {
      setDeleteId(id);
      try {
        await db.deleteCondominium(id);
        setCondos(prev => prev.filter(c => c.id !== id));
      } catch (err: any) {
        console.error("Erro deletando condomínio:", err);
        alert('Erro ao deletar do banco: ' + (err.message || 'Verifique dependências no Supabase'));
      } finally {
        setDeleteId(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-heading text-jlm-dark">Condomínios</h1>
          <p className="text-gray-500 text-sm">Base de dados de empreendimentos atendidos pela JLM.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-jlm-blue text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">
          <Icons.Plus size={18} /> Novo Condomínio
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && condos.length === 0 ? (
          <div className="col-span-full py-20 text-center text-gray-400"><Icons.Loader className="animate-spin inline mr-2" /> Carregando...</div>
        ) : condos.length === 0 ? (
          <div className="col-span-full py-16 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
            Nenhum condomínio registrado.
          </div>
        ) : (
          condos.map(condo => (
            <div key={condo.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative group hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 text-jlm-blue rounded-xl"><Icons.Building2 size={24} /></div>
                <button 
                  onClick={() => handleDelete(condo.id)} 
                  disabled={deleteId === condo.id}
                  className={`p-2 rounded-lg transition ${deleteId === condo.id ? 'text-gray-300' : 'text-gray-300 hover:text-red-500 hover:bg-red-50'}`}
                >
                  {deleteId === condo.id ? <Icons.Loader className="animate-spin" size={18} /> : <Icons.Trash size={18} />}
                </button>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{condo.name}</h3>
              <p className="text-gray-500 text-sm mb-6 flex gap-2"><Icons.MapPin size={16} className="shrink-0" /> {condo.address}</p>
              
              <div className="space-y-2 mb-6">
                 <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Icons.User size={14} className="text-gray-400" /> 
                    <span className="font-medium">Síndico:</span> {condo.syndic_name || 'Não atribuído'}
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50">
                 <div className="bg-gray-50 p-2 rounded-lg text-center">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Torres</p>
                    <p className="font-bold text-gray-800">{condo.towers}</p>
                 </div>
                 <div className="bg-gray-50 p-2 rounded-lg text-center">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Unidades</p>
                    <p className="font-bold text-gray-800">{condo.residents_count}</p>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                 <h3 className="font-bold text-lg text-gray-800">Cadastrar Condomínio</h3>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><Icons.X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Empreendimento</label>
                   <input required className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-jlm-blue" placeholder="Ex: Residencial Central Park" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
                   <input required className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-jlm-blue" placeholder="Rua, Número, Bairro, Cidade" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Qtd. Torres</label>
                      <input type="number" min="1" className="w-full border rounded-lg p-2.5" value={formData.towers} onChange={e => setFormData({...formData, towers: parseInt(e.target.value)})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Qtd. Unidades</label>
                      <input type="number" min="0" className="w-full border rounded-lg p-2.5" value={formData.residents_count} onChange={e => setFormData({...formData, residents_count: parseInt(e.target.value)})} />
                    </div>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Síndico Responsável</label>
                   <select className="w-full border rounded-lg p-2.5 bg-white outline-none focus:ring-2 focus:ring-jlm-blue" value={formData.syndic_id} onChange={e => setFormData({...formData, syndic_id: e.target.value})}>
                      <option value="">Nenhum síndico selecionado...</option>
                      {syndics.map(s => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)}
                   </select>
                 </div>
                 <div className="flex gap-3 mt-6">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition">Cancelar</button>
                   <button type="submit" className="flex-1 py-2.5 bg-jlm-blue text-white rounded-xl font-bold shadow-lg hover:bg-blue-700">Finalizar Cadastro</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminCondos;
