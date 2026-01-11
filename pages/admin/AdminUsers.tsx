
import React, { useEffect, useState } from 'react';
import { db } from '../../services/mockSupabase';
import { User, UserRole, Condominium } from '../../types';
import { Icons } from '../../components/Icons';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [condos, setCondos] = useState<Condominium[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: UserRole.RESIDENT,
    condo_name: '',
    block: '',
    apartment: '',
    password: ''
  });

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importLogs, setImportLogs] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [userData, condoData] = await Promise.all([
         db.getUsers(),
         db.getCondominiums()
      ]);
      setUsers(userData);
      setCondos(condoData);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await db.createUser(formData);
      setIsModalOpen(false);
      setFormData({ name: '', email: '', role: UserRole.RESIDENT, condo_name: '', block: '', apartment: '', password: '' });
      await loadData();
      alert('Usuário criado com sucesso!');
    } catch (err: any) {
      alert('Erro: ' + (err.message || 'Falha ao criar usuário'));
    }
  };

  const handleDeleteUser = async (id: string) => {
    if(window.confirm('Deseja realmente excluir este usuário? Esta ação não pode ser desfeita.')) {
      setDeleteId(id);
      try {
        await db.deleteUser(id);
        setUsers(prev => prev.filter(u => u.id !== id));
      } catch (err: any) {
        console.error("Erro na deleção:", err);
        alert('Erro ao excluir do banco de dados: ' + (err.message || 'Verifique as permissões no Supabase'));
      } finally {
        setDeleteId(null);
      }
    }
  };

  const handleDownloadTemplate = () => {
    const headers = "Nome Completo,E-mail,Perfil,Condominio,Bloco,Apartamento,Senha";
    const example1 = "João Silva,joao@exemplo.com,resident,Residencial Flores,A,101,123456";
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + example1;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "modelo_usuarios_jlm.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportLogs([]);
    const logs: string[] = [];
    let successCount = 0;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target?.result as string;
      if (!text) return;
      const lines = text.split('\n');
      if (lines.length < 2) {
        alert("Arquivo inválido.");
        setImporting(false);
        return;
      }

      const headerMap: Record<string, string> = {
        "Nome Completo": "name",
        "E-mail": "email",
        "Perfil": "role",
        "Condominio": "condo_name",
        "Bloco": "block",
        "Apartamento": "apartment",
        "Senha": "password"
      };

      const rawHeaders = lines[0].split(',').map(h => h.trim());
      const rows = lines.slice(1).filter(row => row.trim() !== '');

      for (const row of rows) {
        const cols = row.split(',').map(c => c.trim());
        const userObj: any = {};
        rawHeaders.forEach((header, index) => {
           const techKey = headerMap[header] || header;
           userObj[techKey] = cols[index];
        });

        if (!userObj.name || !userObj.email) continue;

        if (userObj.role) {
           userObj.role = userObj.role.toLowerCase();
           if (userObj.role === 'morador') userObj.role = 'resident';
           if (userObj.role === 'sindico' || userObj.role === 'síndico') userObj.role = 'syndic';
        }

        try {
          await db.createUser(userObj);
          logs.push(`✅ Criado: ${userObj.name}`);
          successCount++;
        } catch (err: any) {
          logs.push(`❌ Erro em ${userObj.email}: ${err.message}`);
        }
        setImportLogs([...logs]);
      }
      setImporting(false);
      await loadData();
      alert(`Importação concluída! ${successCount} usuários processados.`);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(filter.toLowerCase()) || 
    u.email.toLowerCase().includes(filter.toLowerCase()) ||
    (u.condo_name && u.condo_name.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-jlm-dark">Gestão de Usuários</h1>
          <p className="text-gray-500 text-sm">Controle de acesso para administradores, síndicos e moradores.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsImportModalOpen(true)} className="bg-white text-gray-700 border border-gray-200 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition hover:bg-gray-50">
            <Icons.Upload size={18} /> Importação em Massa
          </button>
          <button onClick={() => setIsModalOpen(true)} className="bg-jlm-blue hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition shadow-lg shadow-blue-500/20">
            <Icons.UserPlus size={18} /> Novo Usuário
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 bg-gray-50/30">
          <div className="relative flex-1 max-w-md">
             <Icons.Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
             <input type="text" placeholder="Buscar por nome, e-mail ou prédio..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-jlm-blue" value={filter} onChange={(e) => setFilter(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs font-bold uppercase text-gray-500 tracking-wider">
              <tr>
                <th className="px-6 py-4">Nome / E-mail</th>
                <th className="px-6 py-4">Perfil</th>
                <th className="px-6 py-4">Condomínio / Unidade</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {loading && users.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400"><Icons.Loader className="animate-spin inline mr-2" /> Carregando usuários...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">Nenhum registro encontrado.</td></tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-blue-50/10 transition group">
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${u.role === 'admin' ? 'bg-gray-800' : u.role === 'syndic' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{u.name}</p>
                            <p className="text-xs text-gray-500">{u.email}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      {u.role === 'admin' && <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Administrador</span>}
                      {u.role === 'syndic' && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Síndico</span>}
                      {u.role === 'resident' && <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Morador</span>}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <p className="font-medium">{u.condo_name || '--'}</p>
                      {u.block && <p className="text-[10px] text-gray-400">Bl. {u.block} - Apt {u.apartment}</p>}
                    </td>
                    <td className="px-6 py-4 text-right">
                       {u.email !== 'admin@jlm.com' ? (
                         <button 
                           onClick={() => handleDeleteUser(u.id)} 
                           disabled={deleteId === u.id}
                           className={`p-2 rounded-lg transition ${deleteId === u.id ? 'bg-gray-100 text-gray-300' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                         >
                           {deleteId === u.id ? <Icons.Loader className="animate-spin" size={18} /> : <Icons.Trash size={18} />}
                         </button>
                       ) : <span className="text-[10px] text-gray-300 italic font-medium px-2">Protegido</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Criar Usuário */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                 <h3 className="font-bold text-lg text-gray-800">Cadastrar Usuário</h3>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><Icons.X size={20} /></button>
              </div>
              <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                 <input required className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-jlm-blue" placeholder="Nome Completo" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                 <input required type="email" className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-jlm-blue" placeholder="E-mail" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                 
                 <div className="grid grid-cols-2 gap-3">
                   <select className="w-full border rounded-lg p-2.5 bg-white" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as UserRole})}>
                      <option value={UserRole.RESIDENT}>Morador</option>
                      <option value={UserRole.SYNDIC}>Síndico</option>
                      <option value={UserRole.ADMIN}>Admin</option>
                   </select>
                   <input className="w-full border rounded-lg p-2.5" placeholder="Senha (Opcional)" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                 </div>

                 {formData.role !== UserRole.ADMIN && (
                    <div className="space-y-3 pt-2 border-t border-gray-50">
                      <select required className="w-full border rounded-lg p-2.5 bg-white" value={formData.condo_name} onChange={e => setFormData({...formData, condo_name: e.target.value})}>
                        <option value="">Selecione o Condomínio...</option>
                        {condos.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                      {formData.role === UserRole.RESIDENT && (
                        <div className="grid grid-cols-2 gap-3">
                           <input className="border rounded-lg p-2.5" placeholder="Bloco" value={formData.block} onChange={e => setFormData({...formData, block: e.target.value})} />
                           <input className="border rounded-lg p-2.5" placeholder="Apartamento" value={formData.apartment} onChange={e => setFormData({...formData, apartment: e.target.value})} />
                        </div>
                      )}
                    </div>
                 )}

                 <div className="flex gap-3 pt-4">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 text-gray-600 font-medium">Cancelar</button>
                   <button type="submit" className="flex-1 py-2.5 bg-jlm-blue text-white rounded-xl font-bold shadow-lg hover:bg-blue-700">Criar Acesso</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Modal Importação CSV */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 animate-in fade-in duration-200">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-gray-800">Importação em Massa</h3>
               <button onClick={() => setIsImportModalOpen(false)} className="text-gray-400"><Icons.X /></button>
             </div>
             <div className="grid grid-cols-2 gap-6 mb-6">
                <button onClick={handleDownloadTemplate} className="border-2 border-dashed border-blue-100 p-6 rounded-2xl flex flex-col items-center gap-3 hover:bg-blue-50 transition group">
                  <Icons.Download className="text-jlm-blue group-hover:scale-110 transition-transform" size={32} />
                  <span className="text-sm font-bold text-gray-700">1. Baixar Planilha Modelo</span>
                </button>
                <label className="border-2 border-dashed border-gray-100 p-6 rounded-2xl flex flex-col items-center gap-3 hover:bg-gray-50 transition cursor-pointer group">
                  <Icons.Upload className="text-gray-600 group-hover:scale-110 transition-transform" size={32} />
                  <span className="text-sm font-bold text-gray-700">2. Enviar Arquivo CSV</span>
                  <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                </label>
             </div>
             <div className="bg-jlm-dark text-green-400 p-5 rounded-xl font-mono text-xs h-40 overflow-y-auto shadow-inner border-4 border-gray-800">
                {importing && <p className="animate-pulse">{'>'.repeat(3)} Lendo arquivo CSV e registrando no banco...</p>}
                {importLogs.map((l, i) => <p key={i} className="mb-1">{l}</p>)}
                {importLogs.length === 0 && !importing && <p className="opacity-50">Aguardando upload...</p>}
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;