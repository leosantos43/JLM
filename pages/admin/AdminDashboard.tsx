import React, { useEffect, useState } from 'react';
import { db } from '../../services/mockSupabase';
import { ServiceRequest, RequestStatus } from '../../types';
import { Icons } from '../../components/Icons';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const AdminDashboard: React.FC = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.getServiceRequests().then((data) => {
      setRequests(data);
      setLoading(false);
    });
  }, []);

  // Stats
  const total = requests.length;
  const open = requests.filter(r => r.status === RequestStatus.OPEN).length;
  const inProgress = requests.filter(r => r.status === RequestStatus.IN_PROGRESS).length;
  const completed = requests.filter(r => r.status === RequestStatus.COMPLETED).length;

  // Chart Data
  const typeData = requests.reduce((acc: any[], curr) => {
    const existing = acc.find(x => x.name === curr.type);
    if(existing) existing.value++;
    else acc.push({ name: curr.type, value: 1 });
    return acc;
  }, []);

  const statusData = [
    { name: 'Aberto', value: open },
    { name: 'Andamento', value: inProgress },
    { name: 'Concluído', value: completed },
  ];

  // Mock activity data
  const activityData = [
    { name: 'Seg', calls: 4 },
    { name: 'Ter', calls: 3 },
    { name: 'Qua', calls: 7 },
    { name: 'Qui', calls: 5 },
    { name: 'Sex', calls: 8 },
    { name: 'Sáb', calls: 2 },
    { name: 'Dom', calls: 1 },
  ];

  const COLORS = ['#F59E0B', '#1A73E8', '#3BB273', '#EF4444'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          <h1 className="text-3xl font-extrabold font-heading text-gray-900 tracking-tight">Dashboard Geral</h1>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/users" className="hidden md:flex items-center gap-2 bg-white text-gray-600 border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition shadow-sm font-medium">
            <Icons.UserPlus size={18} /> Novo Usuário
          </Link>
          <button className="flex items-center gap-2 bg-jlm-dark text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-gray-400/20 transition font-medium">
            <Icons.FileText size={18} /> Relatórios
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-full w-1 bg-jlm-blue opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
               <Icons.ClipboardList size={22} />
            </div>
            <span className="text-xs font-bold bg-green-50 text-green-600 px-2 py-1 rounded-full">+12%</span>
          </div>
          <p className="text-sm font-medium text-gray-400">Total de Chamados</p>
          <h3 className="text-3xl font-bold text-gray-800 mt-1">{total}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(245,158,11,0.1)] border border-gray-100 relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-full w-1 bg-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
               <Icons.AlertTriangle size={22} />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-400">Pendentes</p>
          <h3 className="text-3xl font-bold text-gray-800 mt-1">{open}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(59,178,115,0.1)] border border-gray-100 relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-full w-1 bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
               <Icons.CheckCircle size={22} />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-400">Finalizados</p>
          <h3 className="text-3xl font-bold text-gray-800 mt-1">{completed}</h3>
        </div>

        <div className="bg-gradient-to-br from-jlm-dark to-gray-900 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-jlm-blue rounded-full blur-[60px] opacity-20"></div>
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
              <Icons.Activity size={20} className="text-jlm-accent" />
            </div>
            <span className="font-bold">System Health</span>
          </div>
          <div className="space-y-4 relative z-10">
             <div className="flex justify-between text-sm text-gray-300">
               <span>Server Load</span>
               <span className="text-green-400 font-mono">12%</span>
             </div>
             <div className="w-full bg-white/10 rounded-full h-1.5">
               <div className="bg-green-400 h-1.5 rounded-full" style={{ width: '12%' }}></div>
             </div>
             
             <div className="flex justify-between text-sm text-gray-300">
               <span>Database</span>
               <span className="text-blue-400 font-mono">OK</span>
             </div>
             <div className="w-full bg-white/10 rounded-full h-1.5">
               <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: '98%' }}></div>
             </div>
          </div>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-gray-800">Fluxo de Solicitações (7 dias)</h3>
             <select className="bg-gray-50 border-none text-sm font-medium text-gray-500 rounded-lg p-2 outline-none">
               <option>Última Semana</option>
               <option>Último Mês</option>
             </select>
           </div>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1A73E8" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#1A73E8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                  />
                  <Area type="monotone" dataKey="calls" stroke="#1A73E8" strokeWidth={3} fillOpacity={1} fill="url(#colorCalls)" />
                </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6">Status Geral</h3>
          <div className="h-48 relative">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                  <Pie
                    data={statusData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
               </PieChart>
             </ResponsiveContainer>
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
               <span className="block text-2xl font-bold text-gray-800">{total}</span>
               <span className="text-xs text-gray-400 uppercase">Total</span>
             </div>
          </div>
          <div className="space-y-3 mt-4">
             {statusData.map((item, idx) => (
               <div key={idx} className="flex justify-between items-center text-sm">
                 <div className="flex items-center gap-2">
                   <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: COLORS[idx]}}></div>
                   <span className="text-gray-600">{item.name}</span>
                 </div>
                 <span className="font-bold text-gray-800">{item.value}</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Últimas Atividades</h3>
          <Link to="/admin/requests" className="text-sm text-jlm-blue font-medium hover:underline">Ver tudo</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-xs font-bold uppercase text-gray-400">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Solicitante</th>
                <th className="px-6 py-4">Serviço</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {requests.slice(0, 5).map(r => (
                <tr key={r.id} className="hover:bg-blue-50/20 transition group">
                  <td className="px-6 py-4">
                     <span className={`flex items-center gap-2 font-medium ${
                        r.status === 'Concluído' ? 'text-green-600' : 
                        r.status === 'Em Andamento' ? 'text-blue-600' : 'text-yellow-600'
                     }`}>
                       <div className={`w-1.5 h-1.5 rounded-full ${
                          r.status === 'Concluído' ? 'bg-green-600' : 
                          r.status === 'Em Andamento' ? 'bg-blue-600' : 'bg-yellow-600'
                       }`}></div>
                       {r.status}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                        {r.syndic_name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">{r.condo_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{r.type}</td>
                  <td className="px-6 py-4 text-gray-400 text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/admin/request/${r.id}`} className="text-gray-400 hover:text-jlm-blue transition">
                      <Icons.MoreHorizontal size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;