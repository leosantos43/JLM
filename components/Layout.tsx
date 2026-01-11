

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Icons } from './Icons';
import { User, UserRole, Notification } from '../types';
import { db } from '../services/mockSupabase';

interface LayoutProps {
  children: React.ReactNode;
  user?: User | null;
  onLogout?: () => void;
}

// Internal Toast Component
const Toast: React.FC<{ message: string; onClose: () => void; link?: string }> = ({ message, onClose, link }) => {
  const navigate = useNavigate();
  return (
    <div className="fixed top-24 right-4 z-[100] animate-in slide-in-from-right fade-in duration-300">
      <div className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-2xl rounded-2xl p-4 max-w-sm flex gap-3 items-start relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-jlm-blue"></div>
        <div className="bg-blue-50 text-jlm-blue p-2 rounded-full mt-0.5">
          <Icons.Bell size={18} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-gray-900 mb-1">Nova Notificação</h4>
          <p className="text-sm text-gray-600 leading-snug cursor-pointer hover:text-jlm-blue transition" onClick={() => {
            if(link) {
               navigate(link);
               onClose();
            }
          }}>
            {message}
          </p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <Icons.X size={16} />
        </button>
      </div>
    </div>
  );
};

export const PublicLayout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm h-16' : 'bg-transparent h-20'}`}>
        <div className="container mx-auto px-4 h-full flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className={`p-2 rounded-lg transition-colors ${scrolled ? 'bg-jlm-blue text-white' : 'bg-white text-jlm-blue'}`}>
              <Icons.Building size={24} />
            </div>
            <span className={`text-xl md:text-2xl font-bold font-heading tracking-tight ${scrolled ? 'text-jlm-dark' : 'text-white'}`}>
              JLM <span className={scrolled ? 'text-jlm-blue' : 'text-jlm-accent'}>Facilities</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className={`font-medium transition hover:text-jlm-accent ${scrolled ? 'text-gray-600' : 'text-gray-200'}`}>Home</Link>
            <Link to="/how-it-works" className={`font-medium transition hover:text-jlm-accent ${scrolled ? 'text-gray-600' : 'text-gray-200'}`}>Como Funciona</Link>
            <Link to="/about" className={`font-medium transition hover:text-jlm-accent ${scrolled ? 'text-gray-600' : 'text-gray-200'}`}>Sobre</Link>
            <Link to="/login" className={`${scrolled ? 'bg-jlm-dark text-white' : 'bg-white text-jlm-blue'} hover:scale-105 px-6 py-2 rounded-full font-bold transition shadow-md`}>
              Já sou cliente
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button className={`md:hidden ${scrolled ? 'text-jlm-dark' : 'text-white'}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <Icons.X size={28} /> : <Icons.Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 absolute w-full shadow-xl">
            <div className="flex flex-col p-6 space-y-6 text-center">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-gray-800 font-medium py-2">Home</Link>
              <Link to="/how-it-works" onClick={() => setIsMenuOpen(false)} className="text-gray-800 font-medium py-2">Como Funciona</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-gray-800 font-medium py-2">Sobre</Link>
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="bg-jlm-blue text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30">
                Já sou cliente
              </Link>
            </div>
          </div>
        )}
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-jlm-darker text-white py-16 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
               <div className="flex items-center gap-2 mb-6">
                <div className="bg-jlm-blue text-white p-2 rounded-lg">
                  <Icons.Building size={20} />
                </div>
                <span className="text-xl font-bold font-heading">
                  JLM <span className="text-jlm-accent">Facilities</span>
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                Transformando a gestão de condomínios com tecnologia de ponta e profissionais qualificados. Simplifique sua rotina.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-white">Contato</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li className="flex items-center gap-3"><Icons.Phone size={16} className="text-jlm-blue" /> (11) 99999-9999</li>
                <li className="flex items-center gap-3"><Icons.Mail size={16} className="text-jlm-blue" /> contato@jlmfacilities.com</li>
                <li className="flex items-center gap-3"><Icons.MapPin size={16} className="text-jlm-blue" /> Av. Paulista, 1000 - SP</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-white">Acesso Rápido</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/login" className="text-gray-400 hover:text-jlm-accent transition">Área do Cliente</Link></li>
                <li><Link to="/how-it-works" className="text-gray-400 hover:text-jlm-accent transition">Como Funciona</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-jlm-accent transition">Sobre Nós</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} JLM Facilities. Tech driven management.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
               <Icons.Instagram className="hover:text-white cursor-pointer transition" size={20} />
               <Icons.Linkedin className="hover:text-white cursor-pointer transition" size={20} />
               <Icons.Facebook className="hover:text-white cursor-pointer transition" size={20} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const AppLayout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(user?.push_enabled || false);
  const [activeToast, setActiveToast] = useState<Notification | null>(null);
  
  const prevNotifCountRef = useRef(0);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const loadNotifs = async () => {
        const data = await db.getNotifications(user.id);
        const unread = data.filter(n => !n.read);
        
        // Check for new notifications to trigger Toast
        if (unread.length > prevNotifCountRef.current && unread.length > 0) {
          const latest = unread[0];
          setActiveToast(latest);
          setTimeout(() => setActiveToast(null), 5000);
        }
        
        prevNotifCountRef.current = unread.length;
        setNotifications(unread);
      };

      loadNotifs();
      const interval = setInterval(loadNotifs, 5000); 
      return () => clearInterval(interval);
    }
  }, [user]);

  const togglePush = async () => {
    if(!user) return;
    const newState = !pushEnabled;
    const updatedUser = await db.updateUserPushPreference(user.id, newState);
    if(updatedUser) setPushEnabled(updatedUser.push_enabled || false);
  };

  const isAdmin = user?.role === UserRole.ADMIN;
  const isSyndic = user?.role === UserRole.SYNDIC;
  
  let menuItems = [];

  if (isAdmin) {
    menuItems = [
      { label: 'Dashboard', path: '/admin', icon: Icons.LayoutDashboard },
      { label: 'Chamados', path: '/admin/requests', icon: Icons.ClipboardList },
      { label: 'Condomínios', path: '/admin/condos', icon: Icons.Building2 },
      { label: 'Usuários', path: '/admin/users', icon: Icons.Users },
      { label: 'Profissionais', path: '/admin/professionals', icon: Icons.Briefcase },
      { label: 'Depoimentos', path: '/admin/testimonials', icon: Icons.MessageSquare },
      { label: 'Configurações', path: '/admin/settings', icon: Icons.Settings },
    ];
  } else if (isSyndic) {
    menuItems = [
      { label: 'Dashboard', path: '/app', icon: Icons.LayoutDashboard },
      { label: 'Novo Serviço', path: '/app/new-request', icon: Icons.PlusCircle },
      { label: 'Histórico', path: '/app/history', icon: Icons.History },
      { label: 'Configurações', path: '/app/settings', icon: Icons.Settings },
    ];
  } else {
    // Resident Menu
    menuItems = [
      { label: 'Meus Chamados', path: '/resident', icon: Icons.Home },
      { label: 'Solicitar Serviço', path: '/resident/new-request', icon: Icons.PlusCircle },
      { label: 'Configurações', path: '/resident/settings', icon: Icons.Settings },
    ];
  }

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans relative">
      {/* Toast Notification */}
      {activeToast && (
        <Toast 
          message={activeToast.message} 
          link={activeToast.link}
          onClose={() => setActiveToast(null)} 
        />
      )}

      {/* Modern Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-jlm-darker text-white shadow-2xl z-20 relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 z-0"></div>
        <div className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-jlm-blue rounded-full blur-[80px] opacity-20"></div>

        <div className="h-24 flex items-center px-8 z-10">
           <div className="flex items-center gap-3">
             <div className="bg-gradient-to-tr from-jlm-blue to-blue-500 p-2 rounded-lg shadow-lg shadow-blue-500/20">
               <Icons.Building size={20} className="text-white" />
             </div>
             <span className="text-lg font-bold font-heading tracking-wide">JLM Panel</span>
           </div>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2 z-10">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive 
                    ? 'bg-jlm-blue text-white shadow-lg shadow-blue-900/50' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={20} className={isActive ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
                <span className="font-medium tracking-wide">{item.label}</span>
                {isActive && <div className="absolute right-0 top-0 h-full w-1 bg-white/30"></div>}
              </Link>
            )
          })}
        </nav>

        <div className="p-6 border-t border-gray-800 z-10 bg-black/20 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600 flex items-center justify-center shadow-lg">
                <span className="font-bold text-sm">{user?.name.charAt(0)}</span>
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate text-white">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">
                  {isAdmin ? 'Administrador' : user?.role === 'resident' ? `${user.block} - ${user.apartment}` : user?.condo_name}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4 bg-white/5 p-2 rounded-lg">
            <div className="flex items-center gap-2 text-xs text-gray-400">
               <Icons.Bell size={14} />
               <span>Push Notif.</span>
            </div>
            <button 
              onClick={togglePush}
              className={`w-10 h-5 rounded-full relative transition-colors ${pushEnabled ? 'bg-green-500' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${pushEnabled ? 'left-6' : 'left-1'}`}></div>
            </button>
          </div>

          <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-medium transition hover:translate-x-1">
            <Icons.LogOut size={16} /> Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F8FAFC]">
        {/* Glass Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200/50 flex items-center justify-between px-8 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-600" onClick={() => setIsSidebarOpen(true)}>
              <Icons.Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-800 font-heading hidden md:block">
              {menuItems.find(i => i.path === location.pathname)?.label || 'Portal'}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               <span className="text-xs font-medium text-gray-600">Sistema Online</span>
            </div>

            <div className="relative">
              <button 
                className="relative p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition hover:text-jlm-blue"
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              >
                <Icons.Bell size={22} />
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {showNotifDropdown && (
                <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <div className="px-5 py-3 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 text-sm">Notificações</h3>
                    <span className="text-xs bg-blue-50 text-jlm-blue px-2 py-0.5 rounded-full">{notifications.length} novas</span>
                  </div>
                  
                  {!pushEnabled && (
                    <div className="p-3 bg-blue-50 mx-4 mt-2 rounded-lg border border-blue-100">
                      <p className="text-xs text-blue-700 mb-2 font-medium">Ative notificações push para atualizações em tempo real.</p>
                      <button 
                        onClick={togglePush}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 rounded transition"
                      >
                        Ativar Agora
                      </button>
                    </div>
                  )}

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-gray-400 text-sm flex flex-col items-center gap-2">
                        <Icons.BellOff size={24} opacity={0.5} />
                        Tudo limpo por aqui
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="px-5 py-4 hover:bg-gray-50 border-b border-gray-50 last:border-0 cursor-pointer transition-colors relative" onClick={() => {
                          db.markNotificationRead(n.id);
                          setNotifications(prev => prev.filter(x => x.id !== n.id));
                          prevNotifCountRef.current = Math.max(0, prevNotifCountRef.current - 1);
                          if(n.link) navigate(n.link);
                        }}>
                          <div className="flex gap-3">
                            <div className="mt-1 w-2 h-2 bg-jlm-blue rounded-full flex-shrink-0"></div>
                            <div>
                              <p className="text-sm text-gray-800 font-medium leading-snug">{n.message}</p>
                              <p className="text-xs text-gray-400 mt-1.5">{new Date(n.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity" onClick={() => setIsSidebarOpen(false)}>
          <div className="w-72 bg-jlm-darker h-full shadow-2xl p-6 relative" onClick={e => e.stopPropagation()}>
             <div className="flex justify-between items-center mb-8">
                <span className="text-white font-bold text-xl">Menu</span>
                <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400"><Icons.X /></button>
             </div>
             <nav className="space-y-3">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition"
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
                
                <div className="px-4 py-3 flex items-center justify-between text-gray-300 border-t border-gray-700 mt-4 pt-4">
                  <span className="text-sm font-medium">Notificações Push</span>
                  <button 
                    onClick={togglePush}
                    className={`w-10 h-5 rounded-full relative transition-colors ${pushEnabled ? 'bg-green-500' : 'bg-gray-600'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${pushEnabled ? 'left-6' : 'left-1'}`}></div>
                  </button>
                </div>

                <button onClick={handleLogout} className="flex w-full items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 mt-8">
                  <Icons.LogOut size={20} /> Sair
                </button>
             </nav>
          </div>
        </div>
      )}
    </div>
  );
};
