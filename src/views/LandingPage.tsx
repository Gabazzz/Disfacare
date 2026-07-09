import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Activity, Users, ShieldAlert, Award, FileText, CheckCircle2, Stethoscope, Heart, UserRound, X, ArrowLeft, Lock } from 'lucide-react';
import Button from '../components/Button';

interface LandingPageProps {
  onEnterApp: (role: 'profissional' | 'paciente' | 'cuidador' | 'administrador') => void;
}

/* ─────────────────────────────────────────
   Role Selector Modal
───────────────────────────────────────── */
interface RoleModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (role: 'profissional' | 'paciente' | 'cuidador' | 'administrador') => void;
}

const RoleModal: React.FC<RoleModalProps> = ({ open, onClose, onSelect }) => {
  const [visible, setVisible] = useState(false);
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      setShowAdminLogin(false);
      setAdminUser('');
      setAdminPass('');
      setLoginError('');
    }
  }, [open]);

  if (!open) return null;

  const roles = [
    {
      id: 'profissional' as const,
      label: 'Fonoaudiólogo',
      description: 'Gerencie pacientes, prescreva protocolos e receba alertas clínicos.',
      icon: Stethoscope,
      tailwindGradient: 'from-[#1B4F72] to-[#2E86AB]',
      cssGradient: 'linear-gradient(135deg, #1B4F72, #2E86AB)',
      badge: 'Profissional',
      badgeBg: 'bg-blue-100 text-[#1B4F72]',
    },
    {
      id: 'paciente' as const,
      label: 'Paciente',
      description: 'Acompanhe sua reabilitação, exercícios e evolução de deglutição.',
      icon: Heart,
      tailwindGradient: 'from-[#5DCAA5] to-[#2E86AB]',
      cssGradient: 'linear-gradient(135deg, #5DCAA5, #2E86AB)',
      badge: 'Paciente',
      badgeBg: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 'cuidador' as const,
      label: 'Cuidador',
      description: 'Registre refeições, monitore sintomas e comunique-se com a equipe.',
      icon: UserRound,
      tailwindGradient: 'from-[#D97706] to-[#F59E0B]',
      cssGradient: 'linear-gradient(135deg, #D97706, #F59E0B)',
      badge: 'Cuidador',
      badgeBg: 'bg-amber-100 text-amber-700',
    },
    {
      id: 'administrador' as const,
      label: 'Administrador',
      description: 'Gerencie clínicas, usuários, logs e permissões globais.',
      icon: ShieldAlert,
      tailwindGradient: 'from-gray-700 to-gray-900',
      cssGradient: 'linear-gradient(135deg, #4B5563, #1F2937)',
      badge: 'Admin',
      badgeBg: 'bg-gray-150 text-gray-700',
    },
  ];

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUser.trim() && adminPass.trim()) {
      // Allow simulated log in for simplicity
      onSelect('administrador');
    } else {
      setLoginError('Por favor, preencha o usuário e a senha.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Selecione seu perfil de acesso"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />

      {/* Panel */}
      <div
        className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-8 flex flex-col gap-6"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
          transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          id="modal-close-btn"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 cursor-pointer"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {!showAdminLogin ? (
          <>
            {/* Header */}
            <div className="flex flex-col gap-1 pr-8">
              <h2 className="text-2xl font-extrabold text-[#1B4F72] tracking-tight">Como você deseja entrar?</h2>
              <p className="text-sm text-gray-500">Selecione o perfil correspondente ao seu acesso.</p>
            </div>

            {/* Role Cards */}
            <div className="flex flex-col gap-3">
              {roles.map((role, i) => {
                const IconComp = role.icon;
                const isHovered = hoveredRole === role.id;
                return (
                  <button
                    key={role.id}
                    id={`role-btn-${role.id}`}
                    onClick={() => {
                      if (role.id === 'administrador') {
                        setShowAdminLogin(true);
                      } else {
                        onSelect(role.id);
                      }
                    }}
                    onMouseEnter={() => setHoveredRole(role.id)}
                    onMouseLeave={() => setHoveredRole(null)}
                    className="flex items-center gap-4 p-4 rounded-2xl border-2 text-left w-full group cursor-pointer"
                    style={{
                      borderColor: isHovered ? 'transparent' : '#F0F2F5',
                      background: isHovered ? role.cssGradient : 'white',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      opacity: 0,
                      animation: `fadeSlideUp 0.45s cubic-bezier(0.4,0,0.2,1) ${i * 80}ms forwards`,
                    }}
                  >
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${role.tailwindGradient}`}
                      style={{
                        transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
                      }}
                    >
                      <IconComp className="w-6 h-6 text-white" />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className="font-extrabold text-base"
                          style={{ color: isHovered ? 'white' : '#1B2A3B' }}
                        >
                          {role.label}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isHovered ? 'bg-white/20 text-white' : role.badgeBg}`}
                          style={{ transition: 'all 0.3s ease' }}
                        >
                          {role.badge}
                        </span>
                      </div>
                      <p
                        className="text-xs leading-relaxed"
                        style={{
                          color: isHovered ? 'rgba(255,255,255,0.8)' : '#6B7280',
                          transition: 'color 0.3s ease',
                        }}
                      >
                        {role.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <ArrowRight
                      className="w-4 h-4 shrink-0"
                      style={{
                        color: isHovered ? 'white' : '#D1D5DB',
                        transform: isHovered ? 'translateX(2px)' : 'translateX(0)',
                        transition: 'all 0.3s ease',
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <form onSubmit={handleAdminSubmit} className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center gap-2 pr-8">
              <button
                type="button"
                onClick={() => setShowAdminLogin(false)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                title="Voltar"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </button>
              <div>
                <h2 className="text-xl font-extrabold text-[#1B4F72] tracking-tight">Login Administrativo</h2>
                <p className="text-xs text-gray-500">Informe suas credenciais para gerenciar a plataforma.</p>
              </div>
            </div>

            {loginError && (
              <div className="text-xs text-critical bg-red-50 p-2.5 rounded-btn font-semibold border border-red-100 text-center">
                {loginError}
              </div>
            )}

            <div className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Usuário</label>
                <input
                  type="text"
                  placeholder="admin"
                  value={adminUser}
                  onChange={(e) => setAdminUser(e.target.value)}
                  className="w-full text-xs p-3 rounded-btn border border-gray-250 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Senha</label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    className="w-full text-xs p-3 rounded-btn border border-gray-250 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold pr-10"
                    required
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full !h-11 !py-3 text-xs mt-2">
              Entrar como Administrador
            </Button>
          </form>
        )}
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

/* ─────────────────────────────────────────
   Main Landing Page
───────────────────────────────────────── */
export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const [typedText, setTypedText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const fullText = 'E se engolir não fosse automático?';

  // Smooth typing effect
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index + 1));
      index++;
      if (index >= fullText.length) clearInterval(interval);
    }, 55);
    return () => clearInterval(interval);
  }, []);

  // Intersection Observer for scroll-reveal
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
            (entry.target as HTMLElement).style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.12 }
    );
    sectionRefs.current.forEach((ref) => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, []);

  const addSectionRef = (el: HTMLDivElement | null) => {
    if (el && !sectionRefs.current.includes(el)) sectionRefs.current.push(el);
  };

  const handleEnter = () => setShowModal(true);
  const handleSelect = (role: 'profissional' | 'paciente' | 'cuidador' | 'administrador') => {
    setShowModal(false);
    onEnterApp(role);
  };

  return (
    <>
      <RoleModal open={showModal} onClose={() => setShowModal(false)} onSelect={handleSelect} />


      <div className="bg-appBg min-h-screen flex flex-col font-sans select-none overflow-x-hidden">
        {/* ── Header ── */}
        <header className="fixed top-0 left-0 right-0 z-50 glassmorphism h-20 flex items-center justify-between px-6 md:px-12">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="DISFACARE Logo" className="w-10 h-10 rounded-full object-cover shadow-md" />
            <span className="text-xl font-extrabold text-primary-main tracking-tight">DISFACARE</span>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={handleEnter}
              variant="primary"
              className="!py-2 !px-5 !h-10 text-sm shrink-0"
              id="header-enter-btn"
            >
              Entrar
            </Button>
          </div>
        </header>

        {/* ── Hero ── */}
        <section className="pt-32 pb-20 px-6 md:px-12 flex flex-col items-center justify-center text-center max-w-4xl mx-auto min-h-[80vh] flex-shrink-0">
          {/* Typing heading — corrected text */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-text-primary leading-tight tracking-tight min-h-[2.5em] md:min-h-[1.8em]">
            {typedText}
            <span className="inline-block w-[3px] h-[1em] bg-[#5DCAA5] ml-1 align-middle animate-[blink_1s_step-end_infinite]" />
          </h1>

          <p
            className="text-lg md:text-xl text-text-secondary max-w-2xl mt-6 leading-relaxed"
            style={{
              opacity: 0,
              animation: 'fadeSlideUp 0.7s cubic-bezier(0.4,0,0.2,1) 1.8s forwards',
            }}
          >
            O DISFACARE conecta fonoaudiólogos, cuidadores e pacientes em um único protocolo digital de acompanhamento da disfagia.
          </p>

          {/* CTA */}
          <div
            className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            style={{
              opacity: 0,
              animation: 'fadeSlideUp 0.7s cubic-bezier(0.4,0,0.2,1) 2s forwards',
            }}
          >
            <Button
              onClick={handleEnter}
              variant="primary"
              className="px-8 group"
              id="cta-enter"
            >
              Entrar na plataforma
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform shrink-0" />
            </Button>
            <Button
              onClick={() => {
                document.getElementById('section-solution')?.scrollIntoView({ behavior: 'smooth' });
              }}
              variant="inverted"
              className="px-8"
              id="cta-learn-more"
            >
              Saiba mais
            </Button>
          </div>
        </section>

        {/* ── Problema ── */}
        <section
          ref={addSectionRef}
          className="py-20 bg-white px-6 md:px-12"
          style={{
            opacity: 0,
            transform: 'translateY(40px)',
            transition: 'opacity 0.9s cubic-bezier(0.4,0,0.2,1), transform 0.9s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-extrabold text-primary-main">A Fragmentação do Cuidado Clínico</h2>
              <p className="text-text-secondary mt-4">
                Fonoaudiólogos, cuidadores e pacientes enfrentam gargalos comunicativos graves, gerando riscos silenciosos de aspiração e pneumonia.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: ShieldAlert,
                  bg: 'bg-red-100',
                  color: 'text-[#E24B4A]',
                  title: 'Fonoaudiólogo Isolado',
                  desc: 'Profissionais dependem de relatórios retrospectivos e imprecisos do que aconteceu entre uma sessão clínica e outra.',
                },
                {
                  icon: Users,
                  bg: 'bg-amber-100',
                  color: 'text-[#EF9F27]',
                  title: 'Cuidador Sobrecarregado',
                  desc: 'Cuidadores muitas vezes não sabem identificar sinais silenciosos de disfagia, nem o que registrar na rotina alimentar diária.',
                },
                {
                  icon: Activity,
                  bg: 'bg-blue-100',
                  color: 'text-primary-main',
                  title: 'Paciente Exposto',
                  desc: 'Dieta inadequada e falta de consistência nas manobras de reabilitação expõem o paciente a infecções respiratórias graves.',
                },
              ].map((item, i) => {
                const IconComp = item.icon;
                return (
                  <div
                    key={i}
                    className="p-6 bg-appBg rounded-card flex flex-col gap-4"
                    style={{
                      opacity: 0,
                      animation: 'fadeSlideUp 0.55s cubic-bezier(0.4,0,0.2,1) forwards',
                      animationDelay: `${i * 120}ms`,
                    }}
                  >
                    <div className={`w-12 h-12 rounded-full ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-text-primary">{item.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Solução ── */}
        <section
          id="section-solution"
          ref={addSectionRef}
          className="py-20 px-6 md:px-12 bg-appBg"
          style={{
            opacity: 0,
            transform: 'translateY(40px)',
            transition: 'opacity 0.9s cubic-bezier(0.4,0,0.2,1), transform 0.9s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold text-health tracking-widest uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                NOSSA SOLUÇÃO
              </span>
              <h2 className="text-3xl font-extrabold text-primary-main mt-4">Uma Plataforma de Monitoramento Integrada</h2>
              <p className="text-text-secondary mt-2">
                Transformamos papel e incerteza em registros digitais estruturados em tempo real.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { title: 'Protocolo Digital', desc: 'Fonoaudiólogos prescrevem planos de dieta, consistências permitidas e exercícios em minutos.', icon: FileText },
                { title: 'Registro de Sintomas', desc: 'Botões táteis acessíveis no celular do paciente ou cuidador facilitam o reporte imediato de engasgos.', icon: Activity },
                { title: 'Diário Alimentar', desc: 'Cuidadores registram o nível de deglutição em cada refeição, sinalizando intercorrências em tempo real.', icon: CheckCircle2 },
                { title: 'Alertas Clínicos', desc: 'O sistema dispara avisos visuais imediatos ao profissional se múltiplos episódios de risco forem detectados.', icon: Award },
              ].map((sol, i) => {
                const IconComp = sol.icon;
                return (
                  <div
                    key={i}
                    className="premium-card p-6 bg-white flex flex-col gap-4 hover:-translate-y-2 cursor-default"
                    style={{
                      opacity: 0,
                      animation: 'fadeSlideUp 0.55s cubic-bezier(0.4,0,0.2,1) forwards',
                      animationDelay: `${i * 120}ms`,
                      transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s ease',
                    }}
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

        {/* ── Dados ── */}
        <section
          ref={addSectionRef}
          className="py-20 bg-[#1B4F72] text-white px-6 md:px-12"
          style={{
            opacity: 0,
            transform: 'translateY(40px)',
            transition: 'opacity 0.9s cubic-bezier(0.4,0,0.2,1), transform 0.9s cubic-bezier(0.4,0,0.2,1)',
          }}
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
                  dos distúrbios de deglutição em idosos institucionalizados decorrem de condições clínicas tratáveis.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Depoimento ── */}
        <section
          ref={addSectionRef}
          className="py-20 bg-white px-6 md:px-12"
          style={{
            opacity: 0,
            transform: 'translateY(40px)',
            transition: 'opacity 0.9s cubic-bezier(0.4,0,0.2,1), transform 0.9s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <div className="max-w-4xl mx-auto bg-surface-soft/40 border border-surface-soft p-8 md:p-12 rounded-card flex flex-col md:flex-row gap-8 items-center shadow-sm">
            <div className="relative shrink-0">
              <img
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=200"
                alt="Cuidadora de Joaquim"
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-health text-white flex items-center justify-center shadow font-bold text-lg">
                "
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

        {/* ── CTA Final ── */}
        <section
          ref={addSectionRef}
          className="py-20 bg-gradient-to-b from-white to-appBg px-6 md:px-12 text-center"
          style={{
            opacity: 0,
            transform: 'translateY(40px)',
            transition: 'opacity 0.9s cubic-bezier(0.4,0,0.2,1), transform 0.9s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <div className="max-w-3xl mx-auto flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary-main leading-tight">
              Pronto para garantir um cuidado seguro?
            </h2>
            <p className="text-text-secondary mt-4 max-w-xl leading-relaxed">
              Seja você um fonoaudiólogo buscando controle clínico total ou uma família cuidando de quem ama.
            </p>

            <div className="mt-8">
              <Button
                onClick={handleEnter}
                variant="primary"
                className="px-10 group"
                id="cta-final-enter"
              >
                Escolher meu acesso
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform shrink-0" />
              </Button>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="bg-[#1F2937] text-white py-12 px-6 md:px-12 mt-auto border-t border-gray-800">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="DISFACARE Logo" className="w-8 h-8 rounded-full object-cover" />
              <span className="text-base font-extrabold tracking-wider">DISFACARE</span>
            </div>

            <p className="text-xs text-gray-400">
              © 2026 DISFACARE. Todos os direitos reservados.
            </p>

            <div className="flex gap-4 text-xs text-gray-400">
              <a href="#" className="hover:text-health transition-colors duration-200">Termos de Uso</a>
              <a href="#" className="hover:text-health transition-colors duration-200">Privacidade</a>
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </>
  );
};

export default LandingPage;
