import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Activity, Users, ShieldAlert, Award, FileText, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button';

interface LandingPageProps {
  onEnterApp: (role: 'profissional' | 'paciente' | 'cuidador') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const [typedText, setTypedText] = useState('');
  const fullText = 'E se engolir não fosse automático?';
  
  // Typing effect on Hero mount
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText((prev) => prev + fullText.charAt(index));
      index++;
      if (index >= fullText.length) {
        clearInterval(interval);
      }
    }, 60);
    return () => clearInterval(interval);
  }, []);

  // Intersection Observer for scroll animations
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
          }
        });
      },
      { threshold: 0.15 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const addSectionRef = (el: HTMLDivElement | null) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  return (
    <div className="bg-appBg min-h-screen flex flex-col font-sans select-none overflow-x-hidden">
      {/* Landing Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glassmorphism h-20 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="DISFACARE Logo"
            className="w-10 h-10 rounded-full object-cover shadow-md"
          />
          <span className="text-xl font-extrabold text-primary-main tracking-tight">DISFACARE</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onEnterApp('profissional')}
            className="text-primary hover:text-secondary font-bold text-sm hidden sm:inline-block transition-colors"
          >
            Acesso Fonoaudiólogo
          </button>
          <Button
            onClick={() => onEnterApp('profissional')}
            variant="primary"
            className="!py-2 !px-4 !h-10 text-xs shrink-0"
          >
            Entrar no App
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 md:px-12 flex flex-col items-center justify-center text-center max-w-4xl mx-auto min-h-[80vh] flex-shrink-0">
        <div className="bg-surface-soft text-primary-main font-bold text-xs tracking-widest uppercase px-4.5 py-1.5 rounded-full mb-6 animate-pulse-slow">
          Plataforma B2B2C Avançada
        </div>
        
        {/* Typing Headings */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-text-primary leading-tight tracking-tight min-h-[2.5em] md:min-h-[1.8em]">
          {typedText}
          <span className="border-r-2 border-health ml-1 animate-ping" />
        </h1>

        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mt-6 leading-relaxed">
          O DISFACARE conecta fonoaudiólogos, cuidadores e pacientes em um único protocolo digital de acompanhamento.
        </p>

        {/* CTA Duplo */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button
            onClick={() => onEnterApp('profissional')}
            variant="primary"
            className="px-8 group"
            id="cta-professional"
          >
            Sou Profissional
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform shrink-0" />
          </Button>
          <Button
            onClick={() => onEnterApp('paciente')}
            variant="inverted"
            className="px-8"
            id="cta-patient"
          >
            Sou Paciente / Cuidador
          </Button>
        </div>
      </section>

      {/* Seção de Problema: Fragmentação do Cuidado */}
      <section 
        ref={addSectionRef}
        className="py-20 bg-white px-6 md:px-12 transition-all duration-1000 transform opacity-0 translate-y-10"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-primary-main">A Fragmentação do Cuidado Clínico</h2>
            <p className="text-text-secondary mt-4">
              Hoje, fonoaudiólogos, cuidadores e pacientes enfrentam gargalos comunicativos graves, gerando riscos silenciosos de aspiração e pneumonia.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-appBg rounded-card flex flex-col gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 text-[#E24B4A] flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">Fonoaudiólogo Isolado</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Profissionais dependem de relatórios retrospectivos e imprecisos do que aconteceu entre uma sessão clínica e outra.
              </p>
            </div>

            <div className="p-6 bg-appBg rounded-card flex flex-col gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-[#EF9F27] flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">Cuidador Sobrecarregado</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Cuidadores muitas vezes não sabem identificar sinais silenciosos de disfagia, nem o que registrar na rotina alimentar diária.
              </p>
            </div>

            <div className="p-6 bg-appBg rounded-card flex flex-col gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-primary-main flex items-center justify-center shrink-0">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">Paciente Exposto</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Dieta inadequada e falta de consistência nas manobras de reabilitação expõem o paciente a infecções respiratórias graves.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Solução: O que o App faz */}
      <section 
        ref={addSectionRef}
        className="py-20 px-6 md:px-12 bg-appBg transition-all duration-1000 transform opacity-0 translate-y-10"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-health tracking-widest uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              NOSSA SOLUÇÃO
            </span>
            <h2 className="text-3xl font-extrabold text-primary-main mt-4">Uma Plataforma de Monitoramento Integrada</h2>
            <p className="text-text-secondary mt-2">
              Transformamos o papel e a incerteza em registros digitais estruturados em tempo real.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                title: "Protocolo Digital",
                desc: "Fonoaudiólogos prescrevem planos de dieta, consistências permitidas e exercícios diários em minutos.",
                icon: FileText
              },
              {
                title: "Registro de Sintomas",
                desc: "Botões táteis acessíveis no celular do paciente ou cuidador facilitam o reporte imediato de engasgos ou tosse.",
                icon: Activity
              },
              {
                title: "Diário Alimentar",
                desc: "Cuidadores registram o nível de deglutição em cada refeição, sinalizando intercorrências em tempo real.",
                icon: CheckCircle2
              },
              {
                title: "Alertas Clínicos",
                desc: "O sistema dispara avisos visuais imediatos ao profissional se múltiplos episódios de risco forem detectados.",
                icon: Award
              }
            ].map((sol, index) => {
              const IconComp = sol.icon;
              return (
                <div 
                  key={index} 
                  className="premium-card p-6 bg-white flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 shadow-premium animate-slide-up opacity-0"
                  style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="w-10 h-10 rounded-lg bg-surface-soft text-primary-main flex items-center justify-center shrink-0">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-text-primary text-base">{sol.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{sol.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Seção de Dados e Estatísticas */}
      <section 
        ref={addSectionRef}
        className="py-20 bg-[#1B4F72] text-white px-6 md:px-12 transition-all duration-1000 transform opacity-0 translate-y-10"
      >
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold text-health tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full">
              DADOS E ESTATÍSTICAS
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-6 leading-tight">
              A gravidade silenciosa da disfagia no envelhecimento.
            </h2>
            <p className="text-surface-soft/80 mt-4 leading-relaxed">
              Dificuldade de deglutição não é apenas desconforto. É uma questão crítica de segurança alimentar e saúde respiratória que afeta milhões de idosos diariamente.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 bg-white/5 rounded-card border border-white/10 flex flex-col justify-between h-44">
              <span className="text-5xl font-black text-health">16-22%</span>
              <p className="text-xs text-surface-soft leading-normal">
                da população mundial com mais de 50 anos apresenta algum nível de disfagia orofaríngea.
              </p>
            </div>

            <div className="p-6 bg-white/5 rounded-card border border-white/10 flex flex-col justify-between h-44">
              <span className="text-5xl font-black text-health">70-90%</span>
              <p className="text-xs text-surface-soft leading-normal">
                dos distúrbios de deglutição em idosos institucionalizados ou hospitalizados decorrem de condições clínicas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimento/História real */}
      <section 
        ref={addSectionRef}
        className="py-20 bg-white px-6 md:px-12 transition-all duration-1000 transform opacity-0 translate-y-10"
      >
        <div className="max-w-4xl mx-auto bg-surface-soft/40 border border-surface-soft p-8 md:p-12 rounded-card flex flex-col md:flex-row gap-8 items-center shadow-sm">
          {/* Avatar / Photo */}
          <div className="relative shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=200" 
              alt="Cuidadora de Joaquim"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-health text-white flex items-center justify-center shadow font-bold text-lg">
              ”
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-base md:text-lg text-text-primary italic leading-relaxed font-medium">
              "Depois do AVC do Sr. Joaquim (81 anos), cada refeição parecia um campo minado de tosses e medo. O DISFACARE me deu um diário prático. Registro o almoço, e se ele engasgar, a Dra. Ana recebe o alerta imediatamente. Sentimo-nos acolhidos e seguros."
            </p>
            <div>
              <h4 className="font-extrabold text-primary-main">Lúcia Medeiros</h4>
              <span className="text-xs text-text-secondary">Cuidadora do Sr. Joaquim (Paciente Pós-AVC, 81 anos)</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section 
        ref={addSectionRef}
        className="py-20 bg-gradient-to-b from-white to-appBg px-6 md:px-12 text-center transition-all duration-1000 transform opacity-0 translate-y-10"
      >
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary-main leading-tight">
            Pronto para garantir um cuidado seguro?
          </h2>
          <p className="text-text-secondary mt-4 max-w-xl leading-relaxed">
            Seja você um fonoaudiólogo buscando controle clínico total ou uma família cuidando de quem ama.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button
              onClick={() => onEnterApp('profissional')}
              variant="primary"
              className="px-8"
            >
              Começar como Profissional
            </Button>
            <Button
              onClick={() => onEnterApp('paciente')}
              variant="inverted"
              className="px-8"
            >
              Acessar Painel do Paciente/Cuidador
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1F2937] text-white py-12 px-6 md:px-12 mt-auto border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="DISFACARE Logo"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-base font-extrabold tracking-wider">DISFACARE</span>
          </div>

          <p className="text-xs text-gray-400">
            &copy; 2026 DISFACARE. Todos os direitos reservados. Protocolo B2B2C Clinicamente Supervisionado.
          </p>
          
          <div className="flex gap-4 text-xs text-gray-400">
            <a href="#" className="hover:text-health transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-health transition-colors">Privacidade</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
