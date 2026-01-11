
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../../services/mockSupabase';
import { User, UserRole, Condominium } from '../../types';
import { Icons } from '../../components/Icons';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'default' | 'resident'>('default');
  
  // Default Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Resident Login State
  const [residentEmail, setResidentEmail] = useState('');
  const [residentStep, setResidentStep] = useState<1 | 2>(1);
  const [residentData, setResidentData] = useState<User | null>(null);
  
  // Verification Options State
  const [condoOptions, setCondoOptions] = useState<string[]>([]);
  const [blockOptions, setBlockOptions] = useState<string[]>([]);
  const [aptOptions, setAptOptions] = useState<string[]>([]);

  // Selected Answers
  const [confirmCondo, setConfirmCondo] = useState('');
  const [confirmBlock, setConfirmBlock] = useState('');
  const [confirmApt, setConfirmApt] = useState('');
  
  const [condosList, setCondosList] = useState<Condominium[]>([]);

  // Common State
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load condos for potential decoys
    db.getCondominiums().then(setCondosList);
  }, []);

  // Helper to shuffle array
  const shuffleArray = (array: string[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleDefaultLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { user, error } = await db.login(email, password);
      
      if (error) {
        setError(error);
      } else if (user) {
        onLogin(user);
        if (user.role === UserRole.ADMIN) navigate('/admin');
        else if (user.role === UserRole.SYNDIC) navigate('/app');
        else navigate('/resident');
      }
    } catch (err) {
      setError('Erro ao conectar com servidor.');
    } finally {
      setLoading(false);
    }
  };

  // Dev function to bootstrap admin
  const createInitialAdmin = async () => {
    if(!window.confirm('Criar usuário admin@jlm.com / 123?')) return;
    try {
      setLoading(true);
      await db.createUser({
        name: 'Super Admin',
        email: 'admin@jlm.com',
        password: '123',
        role: UserRole.ADMIN
      });
      alert('Admin criado com sucesso! Use: admin@jlm.com / 123');
      setEmail('admin@jlm.com');
      setPassword('123');
    } catch (e: any) {
      alert('Erro: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const generateDecoys = (correctValue: string, type: 'condo' | 'block' | 'apt', allCondos: Condominium[]) => {
    let pool: string[] = [];

    if (type === 'condo') {
      // Get other condo names
      pool = allCondos.map(c => c.name).filter(n => n !== correctValue);
      // If not enough real condos, add fakes
      const fakes = ['Residencial Solar', 'Edifício Vivert', 'Condomínio Imperial', 'Vila das Acácias'];
      pool = [...pool, ...fakes];
    } else if (type === 'block') {
      pool = ['A', 'B', 'C', '1', '2', '3', 'Norte', 'Sul', 'Leste', 'Único'];
    } else if (type === 'apt') {
      pool = ['11', '12', '101', '102', '202', '54', '81', '303', '41', '10'];
    }

    // Filter out the correct value from pool to avoid duplicates
    const filteredPool = pool.filter(v => v !== correctValue);
    
    // Pick 2 random decoys
    const decoys = filteredPool.sort(() => 0.5 - Math.random()).slice(0, 2);
    
    // Combine with correct value and shuffle
    return shuffleArray([correctValue, ...decoys]);
  };

  const handleResidentEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Find resident by email
      const { user, error } = await db.getResidentByEmail(residentEmail);
      if (error || !user) {
        setError(error || 'Morador não encontrado.');
        setLoading(false);
        return;
      }

      // Generate Options for Step 2
      setResidentData(user);
      
      setCondoOptions(generateDecoys(user.condo_name || '', 'condo', condosList));
      setBlockOptions(generateDecoys(user.block || '', 'block', condosList));
      setAptOptions(generateDecoys(user.apartment || '', 'apt', condosList));

      // Reset selections
      setConfirmCondo('');
      setConfirmBlock('');
      setConfirmApt('');

      setResidentStep(2);
    } catch (err) {
       setError('Erro ao buscar cadastro.');
    } finally {
      setLoading(false);
    }
  };

  const handleResidentConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!residentData) return;
    setLoading(true);
    setError('');

    // Logic: Verify if input matches stored user data
    const isCondoMatch = residentData.condo_name === confirmCondo;
    const isBlockMatch = residentData.block?.toLowerCase() === confirmBlock.trim().toLowerCase();
    const isAptMatch = residentData.apartment === confirmApt.trim();

    // Simulate processing time
    await new Promise(r => setTimeout(r, 800));

    if (isCondoMatch && isBlockMatch && isAptMatch) {
       onLogin(residentData);
       navigate('/resident');
    } else {
       setError('Dados incorretos. Acesso negado por segurança.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image/Brand */}
      <div className="hidden lg:flex w-1/2 bg-jlm-darker relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-jlm-blue/40 to-jlm-darker z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-50"></div>
        
        <div className="relative z-20 text-white p-12 max-w-lg">
          <div className="mb-6 inline-block p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
             <Icons.Building size={40} className="text-jlm-accent" />
          </div>
          <h1 className="text-5xl font-bold font-heading mb-6">Bem-vindo à JLM Facilities</h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Plataforma integrada para condomínios inteligentes. Conectamos moradores, síndicos e profissionais em um só lugar.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-jlm-blue mb-8 transition w-fit">
              <Icons.ArrowLeft size={20} /> Voltar para Home
            </Link>
            
            <h2 className="text-3xl font-bold text-gray-900 font-heading mb-2">Acesse sua Conta</h2>
            <p className="text-gray-500">Selecione seu perfil abaixo para continuar.</p>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
            <button
              onClick={() => { setActiveTab('default'); setError(''); }}
              className={`flex-1 py-3 text-sm font-bold rounded-lg transition ${
                activeTab === 'default' 
                  ? 'bg-white text-jlm-blue shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Síndico / Admin / Staff
            </button>
            <button
              onClick={() => { setActiveTab('resident'); setError(''); setResidentStep(1); }}
              className={`flex-1 py-3 text-sm font-bold rounded-lg transition ${
                activeTab === 'resident' 
                  ? 'bg-white text-jlm-blue shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sou Morador
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center gap-3 border border-red-100 animate-in fade-in slide-in-from-top-2">
              <Icons.AlertTriangle size={20} />
              {error}
            </div>
          )}

          {activeTab === 'default' ? (
            /* DEFAULT LOGIN FORM */
            <div>
              <form onSubmit={handleDefaultLogin} className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-mail Corporativo</label>
                  <div className="relative">
                    <Icons.Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
                    <input
                      type="email"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-jlm-blue focus:border-jlm-blue outline-none transition"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                  <div className="relative">
                    <Icons.Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
                    <input
                      type="password"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-jlm-blue focus:border-jlm-blue outline-none transition"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-jlm-dark hover:bg-jlm-blue text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {loading ? 'Autenticando...' : <>Entrar <Icons.ArrowRight size={20} /></>}
                </button>
              </form>
              
              <button 
                type="button" 
                onClick={createInitialAdmin} 
                className="mt-6 text-xs text-gray-300 hover:text-gray-500 text-center w-full transition-colors"
              >
                (Dev) Criar Admin Inicial
              </button>
            </div>
          ) : (
            /* RESIDENT LOGIN FLOW */
            <div className="animate-in fade-in duration-300">
               {residentStep === 1 ? (
                 <form onSubmit={handleResidentEmailSubmit} className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-800 text-sm mb-4">
                      <p>Digite seu e-mail cadastrado. No próximo passo, solicitaremos a confirmação da sua unidade para sua segurança.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">E-mail Cadastrado</label>
                      <div className="relative">
                        <Icons.Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
                        <input
                          type="email"
                          required
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-jlm-blue focus:border-jlm-blue outline-none transition"
                          placeholder="morador@email.com"
                          value={residentEmail}
                          onChange={(e) => setResidentEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-jlm-blue hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                      {loading ? 'Verificando...' : <>Continuar <Icons.ArrowRight size={20} /></>}
                    </button>
                 </form>
               ) : (
                 <form onSubmit={handleResidentConfirm} className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <button type="button" onClick={() => setResidentStep(1)} className="text-sm text-gray-500 hover:text-jlm-blue flex items-center gap-1">
                        <Icons.ArrowLeft size={14} /> Voltar
                      </button>
                      <span className="text-sm text-gray-300">|</span>
                      <span className="text-sm text-gray-700 font-medium">Olá, {residentData?.name.split(' ')[0]}</span>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-yellow-800 text-sm mb-4">
                      <strong>Verificação de Segurança:</strong><br/>
                      Selecione abaixo os dados corretos da sua residência.
                    </div>

                    {/* Question 1: Condo */}
                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-gray-700">Qual é o seu condomínio?</label>
                      <div className="grid grid-cols-1 gap-2">
                        {condoOptions.map((option, idx) => (
                           <button
                             key={idx}
                             type="button"
                             onClick={() => setConfirmCondo(option)}
                             className={`text-left p-3 rounded-xl border transition-all ${
                               confirmCondo === option 
                                 ? 'bg-blue-50 border-jlm-blue text-jlm-blue ring-1 ring-jlm-blue' 
                                 : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                             }`}
                           >
                             <div className="flex items-center gap-3">
                               <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${confirmCondo === option ? 'border-jlm-blue bg-jlm-blue' : 'border-gray-400'}`}>
                                  {confirmCondo === option && <Icons.Check size={10} className="text-white" />}
                               </div>
                               <span className="text-sm font-medium">{option}</span>
                             </div>
                           </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       {/* Question 2: Block */}
                       <div className="space-y-3">
                          <label className="block text-sm font-bold text-gray-700">Seu Bloco</label>
                          <div className="grid grid-cols-1 gap-2">
                            {blockOptions.map((option, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setConfirmBlock(option)}
                                className={`text-center p-2 rounded-lg border transition-all ${
                                  confirmBlock === option 
                                    ? 'bg-blue-50 border-jlm-blue text-jlm-blue font-bold' 
                                    : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                       </div>

                       {/* Question 3: Apt */}
                       <div className="space-y-3">
                          <label className="block text-sm font-bold text-gray-700">Seu Apartamento</label>
                          <div className="grid grid-cols-1 gap-2">
                            {aptOptions.map((option, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setConfirmApt(option)}
                                className={`text-center p-2 rounded-lg border transition-all ${
                                  confirmApt === option 
                                    ? 'bg-blue-50 border-jlm-blue text-jlm-blue font-bold' 
                                    : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                       </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !confirmCondo || !confirmBlock || !confirmApt}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-6"
                    >
                      {loading ? 'Validando...' : <>Confirmar Acesso <Icons.CheckCircle size={20} /></>}
                    </button>
                 </form>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
