import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../../components/Icons';
import { db } from '../../services/mockSupabase';
import { Testimonial } from '../../types';

const Home: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    db.getTestimonials(true).then(setTestimonials);
  }, []);

  const services = [
    { icon: Icons.Users, title: 'Jardinagem', desc: 'Paisagismo inteligente e manutenção verde.' },
    { icon: Icons.Zap, title: 'Elétrica', desc: 'Sistemas seguros e eficiência energética.' },
    { icon: Icons.Droplet, title: 'Hidráulica', desc: 'Soluções preventivas e reparos precisos.' },
    { icon: Icons.Monitor, title: 'T.I. & Computadores', desc: 'Manutenção de PCs, notebooks, redes e wi-fi.' },
    { icon: Icons.Hammer, title: 'Carpintaria', desc: 'Acabamentos nobres e estruturas duráveis.' },
    { icon: Icons.Sparkles, title: 'Decoração Natalina', desc: 'Projetos luminosos e montagem festiva.' },
    { icon: Icons.Building, title: 'Predial', desc: 'Gestão completa da infraestrutura.' },
    { icon: Icons.Wrench, title: 'Geral', desc: 'Manutenção ágil para demandas diárias.' },
  ];

  const steps = [
    { num: '01', title: 'Solicitação Digital', desc: 'Abra chamados em segundos pelo app ou web.' },
    { num: '02', title: 'Análise Inteligente', desc: 'Triagem rápida para definir a melhor solução.' },
    { num: '03', title: 'Execução Técnica', desc: 'Profissionais certificados no local agendado.' },
    { num: '04', title: 'Rastreio Total', desc: 'Acompanhe em tempo real até a conclusão.' },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-jlm-darker text-white overflow-hidden pt-20">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-jlm-blue rounded-full blur-[120px] opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 -left-20 w-[500px] h-[500px] bg-jlm-accent rounded-full blur-[100px] opacity-10"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-jlm-accent text-sm font-semibold mb-6">
              🚀 A Revolução na Manutenção Predial
            </div>
            <h1 className="text-4xl md:text-7xl font-extrabold font-heading mb-6 leading-tight tracking-tight">
              Gestão Predial <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-jlm-blue to-jlm-accent">
                Inteligente
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-xl leading-relaxed mx-auto md:mx-0">
              Conectamos tecnologia e serviços essenciais. Jardinagem, elétrica, T.I. e manutenção com controle total na palma da sua mão.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/login" className="bg-gradient-to-r from-jlm-blue to-blue-600 hover:shadow-glow text-white text-lg font-bold py-4 px-8 rounded-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
                Começar Agora <Icons.TrendingUp size={20} />
              </Link>
              <Link to="/login" className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 text-white text-lg font-bold py-4 px-8 rounded-xl transition flex items-center justify-center">
                Área do Cliente
              </Link>
            </div>
          </div>
          
          <div className="hidden md:block relative">
            <div className="relative z-10 bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl transform rotate-3 hover:rotate-0 transition duration-500">
               {/* Mockup UI Element */}
               <div className="flex items-center gap-3 border-b border-gray-700 pb-4 mb-4">
                 <div className="flex gap-1.5">
                   <div className="w-3 h-3 rounded-full bg-red-500"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                   <div className="w-3 h-3 rounded-full bg-green-500"></div>
                 </div>
                 <div className="h-2 w-32 bg-gray-700 rounded-full"></div>
               </div>
               <div className="space-y-3">
                 <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><Icons.Zap size={18} /></div>
                      <div>
                        <div className="text-sm font-bold text-gray-200">Manutenção Elétrica</div>
                        <div className="text-xs text-gray-500">Bloco B • Urgente</div>
                      </div>
                    </div>
                    <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded">Em Andamento</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 opacity-60">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg"><Icons.Monitor size={18} /></div>
                      <div>
                        <div className="text-sm font-bold text-gray-200">Suporte de Rede</div>
                        <div className="text-xs text-gray-500">Portaria • Agendado</div>
                      </div>
                    </div>
                    <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded">Pendente</span>
                 </div>
               </div>
            </div>
            {/* Decorative floaters */}
            <div className="absolute -top-10 -right-10 bg-jlm-blue p-4 rounded-2xl shadow-glow animate-bounce delay-700">
              <Icons.CheckCircle className="text-white" size={32} />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-jlm-light relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-jlm-dark mb-4">Ecosistema de Serviços</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Centralizamos todas as necessidades do seu condomínio em uma plataforma única.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 border border-gray-100 group cursor-default">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-jlm-blue group-hover:text-white transition-colors duration-300 text-jlm-dark">
                  <s.icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-jlm-dark group-hover:text-jlm-blue transition-colors">{s.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
               <h2 className="text-3xl md:text-4xl font-bold font-heading text-jlm-dark mb-6">Fluxo de Trabalho Simplificado</h2>
               <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                 Eliminamos a burocracia e as planilhas. Nosso processo é 100% digital, transparente e auditável.
               </p>
               <div className="space-y-8">
                 {steps.map((step, idx) => (
                   <div key={idx} className="flex gap-6 group">
                     <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 text-jlm-blue font-bold flex items-center justify-center border-2 border-transparent group-hover:border-jlm-blue transition-all">
                       {step.num}
                     </div>
                     <div>
                       <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-jlm-blue transition-colors">{step.title}</h3>
                       <p className="text-gray-500 text-sm">{step.desc}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
            <div className="w-full md:w-1/2 relative">
               <div className="absolute inset-0 bg-gradient-to-tr from-jlm-blue to-jlm-accent blur-3xl opacity-20 rounded-full"></div>
               <div className="relative bg-jlm-darker rounded-3xl p-8 shadow-2xl border border-gray-800 text-white">
                 <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                    <span className="font-heading font-bold text-xl">Timeline do Serviço</span>
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Ao vivo</span>
                 </div>
                 <div className="space-y-6">
                    <div className="flex gap-4">
                       <div className="w-8 flex flex-col items-center">
                          <div className="w-3 h-3 bg-jlm-blue rounded-full ring-4 ring-blue-900"></div>
                          <div className="w-0.5 h-full bg-gray-800 my-1"></div>
                       </div>
                       <div className="pb-4">
                          <p className="text-sm text-gray-400">09:00</p>
                          <p className="font-bold">Técnico chegou ao local</p>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <div className="w-8 flex flex-col items-center">
                          <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                          <div className="w-0.5 h-full bg-gray-800 my-1"></div>
                       </div>
                       <div className="pb-4 opacity-50">
                          <p className="text-sm text-gray-400">09:30</p>
                          <p className="font-bold">Início do reparo elétrico</p>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <div className="w-8 flex flex-col items-center">
                          <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                       </div>
                       <div className="opacity-50">
                          <p className="text-sm text-gray-400">--:--</p>
                          <p className="font-bold">Finalização e Assinatura</p>
                       </div>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-jlm-dark relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-900/20 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
           <h2 className="text-3xl font-bold font-heading mb-8">Por que a JLM Facilities?</h2>
           <div className="grid md:grid-cols-3 gap-8">
             <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition">
               <h3 className="text-xl font-bold text-jlm-accent mb-4">Tecnologia</h3>
               <p className="text-gray-300 text-sm">Plataforma própria para gestão transparente de cada chamado.</p>
             </div>
             <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition">
               <h3 className="text-xl font-bold text-jlm-accent mb-4">Qualidade</h3>
               <p className="text-gray-300 text-sm">Profissionais verificados, uniformizados e avaliados constantemente.</p>
             </div>
             <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition">
               <h3 className="text-xl font-bold text-jlm-accent mb-4">Segurança</h3>
               <p className="text-gray-300 text-sm">Rastreabilidade total e seguro de responsabilidade civil.</p>
             </div>
           </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-heading text-jlm-dark">Experiência do Cliente</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.length > 0 ? (
              testimonials.map((t) => (
                <div key={t.id} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition border border-gray-100 relative group">
                   <Icons.Quote className="absolute top-6 right-6 text-gray-200 group-hover:text-jlm-blue transition-colors" size={40} />
                   <div className="flex gap-1 mb-6">
                     {[...Array(5)].map((_, i) => (
                       <Icons.Star key={i} size={18} className={i < t.rating ? "text-yellow-400 fill-current" : "text-gray-200"} />
                     ))}
                   </div>
                   <p className="text-gray-600 mb-8 leading-relaxed">"{t.message}"</p>
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-jlm-blue to-purple-600 flex items-center justify-center text-white font-bold">
                        {t.author_name.charAt(0)}
                     </div>
                     <div>
                       <p className="font-bold text-gray-900">{t.author_name}</p>
                       <p className="text-xs text-jlm-blue font-medium uppercase tracking-wide">{t.condo_name}</p>
                     </div>
                   </div>
                </div>
              ))
            ) : (
              <p className="text-center col-span-3 text-gray-400">Carregando depoimentos...</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;