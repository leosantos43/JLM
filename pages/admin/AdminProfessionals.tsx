
import React, { useEffect, useState } from 'react';
import { db } from '../../services/mockSupabase';
import { Professional } from '../../types';
import { Icons } from '../../components/Icons';

const AdminProfessionals: React.FC = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Professional | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await db.getProfessionals();
    setProfessionals(data);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const prof: any = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      specialty: formData.get('specialty') as string,
      active: formData.get('active') === 'on'
    };
    
    // Only add ID if editing, otherwise leave undefined for insert
    if (editing) {
      prof.id = editing.id;
    }

    try {
      await db.saveProfessional(prof);
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      alert('Erro ao salvar: ' + err.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-heading text-jlm-dark">Gerenciar Profissionais</h1>
        <button 
          onClick={() => { setEditing(null); setIsModalOpen(true); }}
          className="bg-jlm-blue text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Icons.Plus size={18} /> Novo Profissional
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {professionals.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-gray-100 p-3 rounded-full">
                <Icons.User size={24} className="text-gray-600" />
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold ${p.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {p.active ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <h3 className="font-bold text-lg">{p.name}</h3>
            <p className="text-jlm-blue text-sm font-medium mb-2">{p.specialty}</p>
            <p className="text-gray-500 text-sm flex items-center gap-2 mb-4">
              <Icons.Phone size={14} /> {p.phone}
            </p>
            <button 
              onClick={() => { setEditing(p); setIsModalOpen(true); }}
              className="mt-auto border border-gray-200 py-2 rounded text-sm text-gray-600 hover:bg-gray-50"
            >
              Editar
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="font-bold text-xl mb-4">{editing ? 'Editar' : 'Novo'} Profissional</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Nome</label>
                <input name="name" defaultValue={editing?.name} required className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Especialidade</label>
                <input name="specialty" defaultValue={editing?.specialty} required className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Telefone</label>
                <input name="phone" defaultValue={editing?.phone} required className="w-full border rounded p-2" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="active" defaultChecked={editing ? editing.active : true} />
                <label>Ativo</label>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-500 px-4 py-2">Cancelar</button>
                <button type="submit" className="bg-jlm-blue text-white px-4 py-2 rounded">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfessionals;
