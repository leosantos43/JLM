import React from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../../components/Icons';

const HowItWorks: React.FC = () => {
  const steps = [
    { 
      icon: Icons.Smartphone, 
      title: "1. Solicitação Online", 
      desc: "Abra chamados em segundos pela nossa plataforma web (celular ou computador). Descreva o problema, adicione fotos e defina a prioridade sem instalar nada.",
      color: "blue"
    },
    { 
      icon: Icons.Cpu, 
      title: "2. Triagem Inteligente", 
      desc: "Nosso sistema analisa a demanda e a encaminha automaticamente para o departamento técnico especializado (Elétrica, Hidráulica, etc).",
      color: "purple" 
    },
    { 
      icon: Icons.User, 
      title: "3. Atribuição de Profissional", 
      desc: "Um técnico qualificado é designado. Você recebe a identificação completa do profissional na plataforma antes da chegada.",
      color: "yellow"
    },
    { 
      icon: Icons.Wrench, 
      title: "4. Execução e Monitoramento", 
      desc: "O serviço é realizado com registro digital. Acompanhe a mudança de status em tempo real pela timeline do chamado no seu navegador.",
      color: "green"
    },
    { 
      icon: Icons.Star, 
      title: "5. Aprovação e Feedback", 
      desc: "Após a conclusão, o síndico valida o serviço e avalia o profissional, garantindo nosso alto padrão de qualidade desde o primeiro atendimento.",
      color: "red"
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-jlm-darker text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-jlm-blue/20 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
           <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-jlm-accent text-sm font-semibold mb-6">
              ⚙️ Processo Transparente
            </div>
           <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 leading-tight">
             Tecnologia que <span className="text-jlm-blue">simplifica</span> o dia a dia.
           </h1>
           <p className="text-xl text-gray-400 leading-relaxed mb-10">
             Esqueça as planilhas e a burocracia. Utilize nossa plataforma web exclusiva para gerenciar manutenções com agilidade e controle total.
           </p>
           <a 
             href="https://wa.me/5511999999999" 
             target="_blank" 
             rel="noopener noreferrer"
             className="bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-green-500/50 transition transform hover:-translate-y-1 inline-flex items-center gap-2"
           >
             <Icons.Phone size={20} /> Falar com Consultor
           </a>
           <p className="text-sm text-gray-500 mt-4">Central de Atendimento: (11) 99999-9999</p>
        </div>
      </section>

      {/* Timeline Steps */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
           <div className="max-w-5xl mx-auto relative">
             {/* Vertical Line */}
             <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-1 bg-gray-200 transform md:-translate-x-1/2 hidden md:block"></div>
             
             <div className="space-y-16">
               {steps.map((step, idx) => (
                 <div key={idx} className={`flex flex-col md:flex-row items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                   {/* Content */}
                   <div className="w-full md:w-1/2">
                      <div className={`bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 relative group text-left ${idx % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                         <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                         <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                         <div className={`absolute top-0 ${idx % 2 === 0 ? 'left-0' : 'right-0'} w-1 h-full rounded-full transition-all bg-${step.color}-500 opacity-0 group-hover:opacity-100`}></div>
                      </div>
                   </div>

                   {/* Icon Center */}
                   <div className="relative z-10 flex-shrink-0">
                      <div className={`w-14 h-14 rounded-full border-4 border-white shadow-lg flex items-center justify-center bg-${step.color}-500 text-white`}>
                        <step.icon size={24} />
                      </div>
                   </div>

                   {/* Empty Space for alignment */}
                   <div className="w-full md:w-1/2 hidden md:block"></div>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </section>

      {/* Web Platform Feature */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2 flex justify-center">
               {/* Visual representando a responsividade - Scaled for Small Screens */}
               <div className="transform scale-[0.85] sm:scale-100 origin-center transition-transform duration-300">
                 <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
                    <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                    <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
                    <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                    <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                    <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                    <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white flex flex-col">
                       {/* Browser Address Bar Mockup */}
                       <div className="bg-gray-100 p-3 border-b border-gray-200 flex items-center justify-center gap-2">
                          <Icons.Lock size={12} className="text-gray-500" />
                          <span className="text-xs text-gray-500 font-medium">app.jlmfacilities.com.br</span>
                       </div>
                       {/* Mock App Screen */}
                       <div className="bg-jlm-blue p-6 pt-6 text-white">
                          <div className="flex justify-between items-center mb-6">
                             <Icons.Menu size={24} />
                             <Icons.Bell size={24} />
                          </div>
                          <h2 className="text-xl font-bold mb-2">Olá, João</h2>
                          <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
                             <p className="text-xs opacity-80">Chamado Aberto</p>
                             <p className="font-bold text-lg">Manutenção Elétrica</p>
                          </div>
                       </div>
                       <div className="p-4 space-y-4 flex-1 bg-gray-50">
                          <div className="bg-white p-4 rounded-xl flex items-center gap-4 shadow-sm">
                             <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <Icons.CheckCircle size={20} />
                             </div>
                             <div>
                                <p className="font-bold text-sm">Técnico em rota</p>
                                <p className="text-xs text-gray-500">Chegada em 15min</p>
                             </div>
                          </div>
                          <div className="bg-white p-4 rounded-xl flex items-center gap-4 shadow-sm">
                             <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <Icons.MessageCircle size={20} />
                             </div>
                             <div>
                                <p className="font-bold text-sm">Nova mensagem</p>
                                <p className="text-xs text-gray-500">Admin: Precisa de peça?</p>
                             </div>
                          </div>
                       </div>
                       <div className="p-6 bg-white border-t border-gray-100">
                          <div className="bg-jlm-dark text-white py-3 rounded-xl text-center text-sm font-bold shadow-lg">
                             Novo Chamado
                          </div>
                       </div>
                    </div>
                 </div>
               </div>
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-jlm-dark mb-6">Acesse de onde estiver</h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Não é necessário baixar aplicativos pesados. Nossa plataforma web é 100% otimizada para funcionar perfeitamente no navegador do seu celular, tablet ou computador.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                   <div className="bg-blue-100 p-2 rounded-lg text-jlm-blue"><Icons.Globe size={20} /></div>
                   <span className="font-medium text-gray-700">Sem instalações: Acesso direto pelo navegador</span>
                </li>
                <li className="flex items-center gap-3">
                   <div className="bg-green-100 p-2 rounded-lg text-green-600"><Icons.Check size={20} /></div>
                   <span className="font-medium text-gray-700">Chat Direto com a Central</span>
                </li>
                <li className="flex items-center gap-3">
                   <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><Icons.Image size={20} /></div>
                   <span className="font-medium text-gray-700">Envio de fotos e histórico completo</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;