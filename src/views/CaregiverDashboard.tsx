import React, { useState } from 'react';
import { Patient, CaregiverLog } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import { MessageSquare, Clipboard, User, Coffee, Utensils, Moon, CheckCircle2 } from 'lucide-react';

interface CaregiverDashboardProps {
  patient: Patient;
  caregiverLogs: CaregiverLog[];
  onAddCaregiverLog: (meal: string, choke: boolean, notes: string) => void;
  onOpenChat: () => void;
}

export const CaregiverDashboard: React.FC<CaregiverDashboardProps> = ({
  patient,
  caregiverLogs,
  onAddCaregiverLog,
  onOpenChat
}) => {
  const [mealDescription, setMealDescription] = useState('');
  const [choked, setChoked] = useState<boolean | null>(null);
  const [caregiverNotes, setCaregiverNotes] = useState('');
  const [mealCategory, setMealCategory] = useState('Almoço');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filter logs for this patient
  const filteredLogs = caregiverLogs.filter(log => log.patientId === patient.id);

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealDescription || choked === null) return;

    const fullMealString = `${mealCategory} (${mealDescription})`;
    onAddCaregiverLog(fullMealString, choked, caregiverNotes || 'Nenhuma intercorrência detalhada.');

    // Reset Form
    setMealDescription('');
    setChoked(null);
    setCaregiverNotes('');
    setSuccessMsg('Registro alimentar gravado e compartilhado com a fonoaudióloga!');

    setTimeout(() => {
      setSuccessMsg(null);
    }, 4000);
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in pb-20 md:pb-6">
      
      {/* Caregiver Header Banner */}
      <div className="bg-white p-6 rounded-card shadow-premium border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Avatar src={patient.avatar} alt={patient.name} size="md" riskLevel={patient.riskLevel} />
          <div>
            <span className="text-[10px] font-bold text-warning uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              PAINEL DO CUIDADOR
            </span>
            <h1 className="text-xl font-extrabold text-primary mt-2">
              Acompanhamento de {patient.name}
            </h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Registre as refeições e intercorrências clínicas de deglutição do paciente.
            </p>
          </div>
        </div>

        {/* Contact Fono button */}
        <Button
          onClick={onOpenChat}
          className="!bg-warning hover:!bg-[#B46205] text-white flex items-center gap-2 shrink-0 !py-2.5 !px-5 !h-11"
        >
          <MessageSquare className="w-4.5 h-4.5" />
          Contatar Dra. Ana
        </Button>
      </div>

      <div className="grid md:grid-cols-12 gap-6 items-start">
        {/* Left Side: Logger Form (7 cols) */}
        <div className="md:col-span-7 flex flex-col gap-6">
          <Card className="bg-white p-6">
            <h2 className="text-base font-extrabold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clipboard className="w-5 h-5 text-tertiary" />
              Registrar Nova Refeição
            </h2>

            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-250 text-[#16A34A] text-xs font-semibold p-4 rounded-btn text-center mb-5 animate-pulse flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5" />
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSaveLog} className="flex flex-col gap-4">
              {/* Category selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Refeição:</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'Café', label: 'Café', icon: Coffee },
                    { id: 'Almoço', label: 'Almoço', icon: Utensils },
                    { id: 'Lanche', label: 'Lanche', icon: Coffee },
                    { id: 'Jantar', label: 'Jantar', icon: Moon }
                  ].map((cat) => {
                    const CatIcon = cat.icon;
                    const isSelected = mealCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setMealCategory(cat.id)}
                        className={`py-2.5 px-1 rounded-btn text-xs font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-primary text-white border-primary shadow-sm scale-102 font-extrabold'
                            : 'bg-white text-text-secondary border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <CatIcon className="w-4 h-4" />
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Meal description text input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Descrição do alimento/consistência:</label>
                <input
                  id="caregiver-meal-input"
                  type="text"
                  required
                  value={mealDescription}
                  onChange={(e) => setMealDescription(e.target.value)}
                  placeholder="Ex: purê de batata doce com carne líquida batida no mixer"
                  className="w-full text-xs p-3 rounded-btn border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>

              {/* Choke Selector - RED/GREY toggle states per spec */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Houve engasgo ou tosse?</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    id="caregiver-choke-yes-btn"
                    type="button"
                    onClick={() => setChoked(true)}
                    className={`touch-target rounded-btn border transition-all font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                      choked === true
                        ? 'bg-critical border-critical text-white shadow-sm'
                        : 'bg-gray-100 border-gray-200 text-text-secondary hover:bg-gray-200'
                    }`}
                    style={{ minHeight: '48px' }}
                  >
                    ⚠️ SIM, HOUVE
                  </button>
                  <button
                    id="caregiver-choke-no-btn"
                    type="button"
                    onClick={() => setChoked(false)}
                    className={`touch-target rounded-btn border transition-all font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                      choked === false
                        ? 'bg-success border-success text-white shadow-sm'
                        : 'bg-gray-100 border-gray-200 text-text-secondary hover:bg-gray-200'
                    }`}
                    style={{ minHeight: '48px' }}
                  >
                    ✅ NÃO HOUVE
                  </button>
                </div>
              </div>

              {/* Observation free field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Observações/sintomas percebidos:</label>
                <textarea
                  id="caregiver-notes-input"
                  value={caregiverNotes}
                  onChange={(e) => setCaregiverNotes(e.target.value)}
                  placeholder="Ex: comeu devagar, manteve a postura adequada, engoliu sem dificuldade"
                  className="w-full text-xs p-3 rounded-btn border border-gray-250 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none h-24 font-medium"
                />
              </div>

              <Button
                id="caregiver-submit-btn"
                type="submit"
                variant="primary"
                className="w-full !h-12 text-xs font-bold mt-2"
              >
                Salvar Registro no Diário
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Side: Log History List (5 cols) */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-text-primary px-1">Histórico de Refeições</h2>
          
          <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredLogs.length === 0 ? (
              <div className="bg-white rounded-card p-6 shadow-premium text-center text-text-secondary text-xs">
                Nenhuma refeição registrada para este paciente ainda.
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div 
                  key={log.id}
                  className={`bg-white rounded-card p-4 shadow-premium border-l-4 transition-all duration-200 hover:-translate-y-0.5 ${
                    log.choke ? 'border-critical' : 'border-success'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-text-secondary uppercase">
                      {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(log.timestamp).toLocaleDateString()}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      log.choke ? 'bg-red-50 text-critical' : 'bg-emerald-50 text-success'
                    }`}>
                      {log.choke ? 'Engasgo' : 'Sem Engasgo'}
                    </span>
                  </div>
                  
                  <h4 className="text-sm font-bold text-primary mt-2 leading-tight">
                    {log.meal}
                  </h4>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed font-medium">
                    {log.notes}
                  </p>
                  
                  <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-gray-50 text-[10px] text-text-secondary font-bold">
                    <User className="w-3.5 h-3.5 text-primary" />
                    <span>Registrado por: {log.caregiverName}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaregiverDashboard;
