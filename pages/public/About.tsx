import React from 'react';
import { Icons } from '../../components/Icons';

const About: React.FC = () => {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-white py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-7xl font-bold font-heading text-jlm-dark mb-8 tracking-tight">
              A nova era da <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-jlm-blue to-jlm-accent">
                 Gestão de Facilities
              </span>
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed mb-12">
              A JLM Facilities chega ao mercado com um propósito inovador: unir a excelência técnica da manutenção predial com a transparência e agilidade da tecnologia moderna. Somos novos, somos ágeis e estamos prontos.
            </p>
          </div>
        </div>
      </section>

      {/* Stats - Credibilidade baseada em capacidade e não tempo */}
      <section className="py-16 bg-jlm-blue relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="flex justify-center mb-3 text-jlm-accent"><Icons.Cpu size={32} /></div>
              <div className="text-2xl font-bold font-heading mb-1">100% Digital</div>
              <p className="text-sm opacity-80 uppercase tracking-wide">Plataforma Própria</p>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="flex justify-center mb-3 text-jlm-accent"><Icons.Shield size={32} /></div>
              <div className="text-2xl font-bold font-heading mb-1">NR-10 / NR-35</div>
              <p className="text-sm opacity-80 uppercase tracking-wide">Equipe Certificada</p>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="flex justify-center mb-3 text-jlm-accent"><Icons.Clock size={32} /></div>
              <div className="text-2xl font-bold font-heading mb-1">Ágil</div>
              <p className="text-sm opacity-80 uppercase tracking-wide">Resposta Rápida</p>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="flex justify-center mb-3 text-jlm-accent"><Icons.Star size={32} /></div>
              <div className="text-2xl font-bold font-heading mb-1">Premium</div>
              <p className="text-sm opacity-80 uppercase tracking-wide">Padrão de Qualidade</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-jlm-blue transition duration-300 group">
                <div className="w-16 h-16 bg-blue-50 text-jlm-blue rounded-2xl flex items-center justify-center mb-6 group-hover:bg-jlm-blue group-hover:text-white transition-colors">
                   <Icons.Target size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Nossa Missão</h3>
                <p className="text-gray-500 leading-relaxed">
                  Proporcionar tranquilidade para síndicos e moradores através de serviços de manutenção que resolvem problemas reais com eficiência e organização impecável.
                </p>
             </div>
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-jlm-blue transition duration-300 group">
                <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                   <Icons.Zap size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Energia de Inovação</h3>
                <p className="text-gray-500 leading-relaxed">
                  Somos uma empresa jovem com mentalidade moderna. Não nos prendemos a processos arcaicos; buscamos a melhor solução tecnológica para cada desafio.
                </p>
             </div>
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-jlm-blue transition duration-300 group">
                <div className="w-16 h-16 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-600 group-hover:text-white transition-colors">
                   <Icons.Award size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Compromisso</h3>
                <p className="text-gray-500 leading-relaxed">
                  Segurança em primeiro lugar, transparência nos orçamentos e respeito absoluto pelo patrimônio dos nossos clientes.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* Team/Culture */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
           <div className="w-full md:w-1/2">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-4 mt-8">
                    <div className="h-64 bg-gray-200 rounded-2xl bg-[url('https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                    <div className="h-40 bg-gray-100 rounded-2xl bg-[url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                 </div>
                 <div className="space-y-4">
                    <div className="h-40 bg-gray-100 rounded-2xl bg-[url('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center"></div>
                    <div className="h-64 bg-gray-200 rounded-2xl bg-[url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                 </div>
              </div>
           </div>
           <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold font-heading text-jlm-dark mb-6">Equipe Qualificada e Humanizada</h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Nossa força está na seleção rigorosa dos nossos profissionais. Montamos um time de especialistas dedicados que passam por constante treinamento técnico e comportamental.
              </p>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Entendemos que entrar no seu condomínio é uma questão de confiança. Por isso, todos os nossos colaboradores trabalham devidamente uniformizados, identificados e segurados.
              </p>
              <div className="flex flex-col gap-4">
                 <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <div className="text-jlm-blue"><Icons.CheckCircle size={24} /></div>
                    <span className="font-bold text-gray-800">Treinamento Técnico (Elétrica, Hidráulica, etc)</span>
                 </div>
                 <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <div className="text-jlm-blue"><Icons.CheckCircle size={24} /></div>
                    <span className="font-bold text-gray-800">Seguro de Responsabilidade Civil</span>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default About;