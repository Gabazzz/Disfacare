import React, { useState } from 'react';
import { Patient, Reminder, SymptomLog } from '../types';
import StatusBadge, { StatusType } from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';
import Card from '../components/Card';
import { Clock, ShieldAlert, CheckCircle, Activity, HeartHandshake, Smile, MessageSquare, Flame, Droplet, Pill } from 'lucide-react';

interface PatientDashboardProps {
  patient: Patient;
  reminders: Reminder[];
  onToggleReminder: (reminderId: string) => void;
  onAddSymptomLog: (symptoms: { choke: boolean; cough: boolean; pain: boolean }, notes: string) => void;
  onOpenChat: () => void;
  focusSection?: 'dashboard' | 'exercicios' | 'dieta';
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  patient,
  reminders,
  onToggleReminder,
  onAddSymptomLog,
  onOpenChat,
  focusSection = 'dashboard'
}) => {
  const [coughActive, setCoughActive] = useState(false);
  const [chokeActive, setChokeActive] = useState(false);
  const [painActive, setPainActive] = useState(false);
  const [logNotes, setLogNotes] = useState('');
  const [symptomMessage, setSymptomMessage] = useState<string | null>(null);

  // Filter reminders for this patient
  const patientReminders = reminders.filter(r => r.patientId === patient.id);
  const completedReminders = patientReminders.filter(r => r.completed).length;
  const totalReminders = patientReminders.length;
  const progressPercent = totalReminders > 0 ? Math.round((completedReminders / totalReminders) * 100) : 0;

  // Reminders by category
  const dietReminders = patientReminders.filter(r => r.type === 'diet');
  const exerciseReminders = patientReminders.filter(r => r.type === 'exercise');
  const hydrationReminders = patientReminders.filter(r => r.type === 'hydration');
  const medicationReminders = patientReminders.filter(r => r.type === 'medication');

  const handleLogSymptom = (type: 'cough' | 'choke' | 'pain') => {
    if (type === 'cough') setCoughActive(!coughActive);
    if (type === 'choke') setChokeActive(!chokeActive);
    if (type === 'pain') setPainActive(!painActive);
  };

  const submitSymptoms = () => {
    if (!coughActive && !chokeActive && !painActive && !logNotes) return;

    onAddSymptomLog(
      {
        choke: chokeActive,
        cough: coughActive,
        pain: painActive
      },
      logNotes || 'Sintomas registrados pelo painel do paciente.'
    );

    // Reset state & show success confirmation
    setSymptomMessage('Sintomas salvos e enviados para a Dra. Ana!');
    setCoughActive(false);
    setChokeActive(false);
    setPainActive(false);
    setLogNotes('');

    setTimeout(() => {
      setSymptomMessage(null);
    }, 4000);
  };

  const getStatusText = () => {
    if (patient.riskLevel === 'alto') return 'Crítico';
    if (patient.riskLevel === 'médio') return 'Em alerta';
    return 'Estável';
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in pb-20 md:pb-6">
      
      {/* 1. Patient Greeting & Status Badge in top layout */}
      <div className="bg-gradient-to-r from-primary to-[#2A6690] text-white p-6 rounded-card shadow-premium relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none" />
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={patient.avatar}
              alt={patient.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-tertiary/60 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black tracking-tight text-white">
                  Olá, {patient.name.split(' ')[0]}!
                </h1>
                <Smile className="w-6 h-6 text-tertiary animate-bounce" />
              </div>
              <p className="text-xs text-sky-100 mt-1 font-medium">
                Hoje é um ótimo dia para treinar a deglutição com segurança!
              </p>
            </div>
          </div>
          
          {/* Status Indicator at top */}
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-btn border border-white/10 flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-100">Status Clínico:</span>
            <StatusBadge status={getStatusText()} className="bg-white/90 shadow-sm" />
          </div>
        </div>
      </div>

      {/* 2. Semantic High Risk Alert Banner */}
      {patient.riskLevel === 'alto' && (
        <div className="bg-red-50 border border-red-250 p-4 rounded-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm animate-pulse-slow">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-critical shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-extrabold text-critical">Alerta Clínico Importante</h4>
              <p className="text-xs text-text-primary mt-0.5 leading-relaxed font-medium">
                Suas orientações foram revisadas. Certifique-se de seguir a consistência <strong>{patient.consistencies.join(' ou ')}</strong> e manter a postura recomendada. Qualquer engasgo ou tosse deve ser reportado abaixo.
              </p>
            </div>
          </div>
          <Button 
            variant="outlined" 
            className="!border-critical !text-critical hover:!bg-red-50/50 !h-10 !py-2 !px-4 text-xs shrink-0 font-bold"
            onClick={onOpenChat}
          >
            Falar com Dra. Ana
          </Button>
        </div>
      )}

      {/* 3. Bento Progress Card */}
      <Card className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white">
        <div className="flex-1">
          <h3 className="text-sm font-extrabold text-primary uppercase tracking-wider mb-1">Seu Progresso Clínico de Hoje</h3>
          <p className="text-xs text-text-secondary font-medium">Complete seus lembretes e exercícios diários para aumentar seu índice de segurança.</p>
        </div>
        <div className="flex items-center gap-4 min-w-[200px] sm:justify-end">
          <div className="text-right">
            <span className="text-2xl font-black text-primary">{progressPercent}%</span>
            <span className="text-[10px] block font-bold text-text-secondary uppercase">Concluído</span>
          </div>
          <div className="w-32">
            <ProgressBar value={progressPercent} />
          </div>
        </div>
      </Card>

      {/* Grid Layout */}
      <div className="grid md:grid-cols-12 gap-6">
        
        {/* Left Column: Categorized Secondary Cards (7 cols) */}
        <div className="md:col-span-7 flex flex-col gap-6">
          
          {/* Card: Dieta (Dieta Recomendada) */}
          <Card className={`flex flex-col gap-4 transition-all duration-300 ${focusSection === 'dieta' ? 'border-primary ring-2 ring-primary/20 shadow-md scale-[1.01]' : ''}`}>
            <h2 className="text-base font-extrabold text-primary uppercase tracking-wider flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-tertiary" />
              1. Minhas Orientações e Dieta
            </h2>
            
            <div className="p-4 bg-surface-soft/60 rounded-btn border border-sky-100 flex flex-col gap-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Consistências Alimentares Permitidas
              </span>
              <div className="flex flex-wrap gap-1.5 mt-0.5">
                {patient.consistencies.map((cons, idx) => (
                  <span key={idx} className="text-xs font-bold px-2.5 py-1 bg-white text-primary rounded-badge border border-sky-150 shadow-sm">
                    {cons}
                  </span>
                ))}
              </div>
              <p className="text-xs text-text-secondary mt-1 font-medium leading-relaxed">
                Recomendação Clínica: Mastigue devagar. Evite fiapos ou pedaços sólidos que não estejam completamente amassados.
              </p>
            </div>

            {dietReminders.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Rotina Alimentar</span>
                <div className="grid sm:grid-cols-2 gap-3">
                  {dietReminders.map(rem => (
                    <div 
                      key={rem.id}
                      onClick={() => onToggleReminder(rem.id)}
                      className={`cursor-pointer rounded-btn p-3.5 border transition-all flex items-center justify-between gap-3 ${
                        rem.completed ? 'bg-emerald-50/60 border-emerald-250 text-[#16A34A]' : 'bg-gray-50 border-gray-200 text-text-primary'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">{rem.time} - {rem.label}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${rem.completed ? 'border-[#16A34A] bg-[#16A34A] text-white' : 'border-gray-300'}`}>
                        {rem.completed && <CheckCircle className="w-3 h-3" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Card: Exercícios (Tarefas de Reabilitação) */}
          <Card className={`flex flex-col gap-4 transition-all duration-300 ${focusSection === 'exercicios' ? 'border-primary ring-2 ring-primary/20 shadow-md scale-[1.01]' : ''}`}>
            <h2 className="text-base font-extrabold text-primary uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-5 h-5 text-tertiary" />
              2. Exercícios de Reabilitação
            </h2>

            <div className="p-4 bg-emerald-50/50 rounded-btn border border-emerald-100 flex flex-col gap-2">
              <span className="text-xs font-bold text-success uppercase tracking-wider">
                Manobras Posturais e de Ejeção
              </span>
              <ul className="list-disc list-inside text-xs font-semibold text-text-primary flex flex-col gap-1.5 leading-relaxed">
                <li>Manobra de Masako (engolir com a língua presa entre os dentes)</li>
                <li>Exercício Shaker (deitar e elevar a cabeça para ver a ponta dos pés)</li>
              </ul>
              <p className="text-xs text-text-secondary italic">
                Faça 3 séries de 5 repetições antes das refeições principais.
              </p>
            </div>

            {exerciseReminders.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Rotina de Treino</span>
                <div className="grid sm:grid-cols-2 gap-3">
                  {exerciseReminders.map(rem => (
                    <div 
                      key={rem.id}
                      onClick={() => onToggleReminder(rem.id)}
                      className={`cursor-pointer rounded-btn p-3.5 border transition-all flex items-center justify-between gap-3 ${
                        rem.completed ? 'bg-emerald-50/60 border-emerald-250 text-[#16A34A]' : 'bg-gray-50 border-gray-200 text-text-primary'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">{rem.time} - {rem.label}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${rem.completed ? 'border-[#16A34A] bg-[#16A34A] text-white' : 'border-gray-300'}`}>
                        {rem.completed && <CheckCircle className="w-3 h-3" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Card: Hidratação Segura */}
          <Card className="flex flex-col gap-4">
            <h2 className="text-base font-extrabold text-primary uppercase tracking-wider flex items-center gap-2">
              <Droplet className="w-5 h-5 text-secondary" />
              3. Hidratação Segura
            </h2>
            <p className="text-xs text-text-secondary font-medium leading-relaxed">
              Ingerir líquidos finos (água pura) pode gerar tosse. Certifique-se de usar o espessante alimentar na dosagem indicada pela fonoaudióloga ou utilize a manobra de queixo no peito.
            </p>

            {hydrationReminders.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-3">
                {hydrationReminders.map(rem => (
                  <div 
                    key={rem.id}
                    onClick={() => onToggleReminder(rem.id)}
                    className={`cursor-pointer rounded-btn p-3.5 border transition-all flex items-center justify-between gap-3 ${
                      rem.completed ? 'bg-emerald-50/60 border-emerald-250 text-[#16A34A]' : 'bg-gray-50 border-gray-200 text-text-primary'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">{rem.time} - {rem.label}</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${rem.completed ? 'border-[#16A34A] bg-[#16A34A] text-white' : 'border-gray-300'}`}>
                      {rem.completed && <CheckCircle className="w-3 h-3" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Card: Medicação */}
          {medicationReminders.length > 0 && (
            <Card className="flex flex-col gap-4">
              <h2 className="text-base font-extrabold text-primary uppercase tracking-wider flex items-center gap-2">
                <Pill className="w-5 h-5 text-warning" />
                4. Medicação Prescrita
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {medicationReminders.map(rem => (
                  <div 
                    key={rem.id}
                    onClick={() => onToggleReminder(rem.id)}
                    className={`cursor-pointer rounded-btn p-3.5 border transition-all flex items-center justify-between gap-3 ${
                      rem.completed ? 'bg-emerald-50/60 border-emerald-250 text-[#16A34A]' : 'bg-gray-50 border-gray-200 text-text-primary'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">{rem.time} - {rem.label}</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${rem.completed ? 'border-[#16A34A] bg-[#16A34A] text-white' : 'border-gray-300'}`}>
                      {rem.completed && <CheckCircle className="w-3 h-3" />}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

        </div>
 
        {/* Right Column: Tactile Symptom Logger & Help chat (5 cols) */}
        <div className="md:col-span-5 flex flex-col gap-6">
          
          {/* Symptom Logger Card */}
          <Card className="flex flex-col gap-4">
            <div>
              <h2 className="text-base font-extrabold text-primary uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-5 h-5 text-tertiary" />
                Registrar Sintomas de Hoje
              </h2>
              <p className="text-xs text-text-secondary mt-1 font-medium leading-relaxed">
                Teve alguma dificuldade para engolir hoje? Clique nos botões abaixo para registrar de forma rápida e tátil.
              </p>
            </div>

            {symptomMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-[#16A34A] text-xs font-semibold p-3.5 rounded-btn text-center animate-pulse-green">
                {symptomMessage}
              </div>
            )}

            {/* Tactile Big Buttons (Min 48px height) */}
            <div className="flex flex-col gap-3">
              <button
                id="symptom-choke-btn"
                onClick={() => handleLogSymptom('choke')}
                className={`touch-target rounded-btn border-2 transition-all font-bold text-sm select-none cursor-pointer flex items-center justify-center gap-2 ${
                  chokeActive
                    ? 'bg-critical border-critical text-white shadow-sm'
                    : 'bg-white border-red-150 text-critical hover:bg-red-50/50'
                }`}
                style={{ minHeight: '52px' }}
              >
                😮 Engasgo
              </button>

              <button
                id="symptom-cough-btn"
                onClick={() => handleLogSymptom('cough')}
                className={`touch-target rounded-btn border-2 transition-all font-bold text-sm select-none cursor-pointer flex items-center justify-center gap-2 ${
                  coughActive
                    ? 'bg-warning border-warning text-white shadow-sm'
                    : 'bg-white border-amber-150 text-warning hover:bg-amber-50/50'
                }`}
                style={{ minHeight: '52px' }}
              >
                🗣️ Tosse Frequente
              </button>

              <button
                id="symptom-pain-btn"
                onClick={() => handleLogSymptom('pain')}
                className={`touch-target rounded-btn border-2 transition-all font-bold text-sm select-none cursor-pointer flex items-center justify-center gap-2 ${
                  painActive
                    ? 'bg-primary border-primary text-white shadow-sm'
                    : 'bg-white border-sky-150 text-primary hover:bg-sky-50/50'
                }`}
                style={{ minHeight: '52px' }}
              >
                💥 Dor ao Engolir
              </button>
            </div>

            {/* Note text field */}
            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Observações adicionais:</label>
              <textarea
                id="symptom-notes-input"
                value={logNotes}
                onChange={(e) => setLogNotes(e.target.value)}
                placeholder="Ex: tossi ao tomar suco de laranja..."
                className="w-full text-xs p-3 rounded-btn border border-gray-250 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none h-20"
              />
            </div>

            {/* Submit Button */}
            <Button
              id="symptom-submit-btn"
              onClick={submitSymptoms}
              variant="primary"
              className="w-full !h-12 text-xs"
            >
              Enviar Registro de Sintomas
            </Button>
          </Card>

          {/* Quick Chat Support widget */}
          <Card className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-tertiary rounded-full shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-primary">Falar com a Fono</h4>
                <p className="text-[11px] text-text-secondary font-medium">Dra. Ana está disponível para apoio.</p>
              </div>
            </div>
            <Button
              onClick={onOpenChat}
              variant="outlined"
              className="!py-2 !px-3 !h-9 text-xs"
            >
              Enviar Dúvida
            </Button>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
