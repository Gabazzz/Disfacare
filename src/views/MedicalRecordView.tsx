import React, { useState } from 'react';
import { Patient, SessionHistory, ClinicalEvolutionPoint } from '../types';
import LineChart from '../components/LineChart';
import Avatar from '../components/Avatar';
import StatusBadge, { StatusType } from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';
import Card from '../components/Card';
import Button from '../components/Button';
import { Calendar, Activity, FileText, PlusCircle, CheckCircle, Shield } from 'lucide-react';

interface MedicalRecordViewProps {
  patient: Patient;
  sessionHistory: SessionHistory[];
  evolutionData: ClinicalEvolutionPoint[];
  onAddSessionNote: (patientId: string, notes: string) => void;
  isProfessional: boolean;
}

export const MedicalRecordView: React.FC<MedicalRecordViewProps> = ({
  patient,
  sessionHistory,
  evolutionData,
  onAddSessionNote,
  isProfessional
}) => {
  const [newNote, setNewNote] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filter history for this patient
  const filteredHistory = sessionHistory.filter(h => h.patientId === patient.id);

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote) return;

    onAddSessionNote(patient.id, newNote);
    setNewNote('');
    setShowForm(false);
    setSuccessMsg('Nova sessão clínica registrada com sucesso no prontuário!');

    setTimeout(() => {
      setSuccessMsg(null);
    }, 4000);
  };

  const getStatus = (): StatusType => {
    if (patient.riskLevel === 'alto') return 'Crítico';
    if (patient.riskLevel === 'médio') return 'Em alerta';
    return 'Estável';
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in pb-20 md:pb-6">
      
      {/* Patient header banner details */}
      <div className="bg-white p-6 rounded-card shadow-premium border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <Avatar src={patient.avatar} alt={patient.name} size="lg" riskLevel={patient.riskLevel} />
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl md:text-2xl font-black text-primary leading-none">
                {patient.name}
              </h1>
              <span className="text-xs font-bold text-text-secondary bg-gray-100 px-2.5 py-0.5 rounded-full">
                {patient.age} anos
              </span>
            </div>
            <p className="text-xs font-medium text-text-secondary mt-2">{patient.diagnosis}</p>
            <p className="text-xs text-text-secondary font-semibold mt-0.5">ID: {patient.id} | Gênero: {patient.gender}</p>
          </div>
        </div>

        {/* Progress and Risk status in header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full md:w-auto">
          {/* Swallowing Safety Score ProgressBar */}
          <div className="flex flex-col gap-1 w-full sm:w-44 shrink-0">
            <div className="flex justify-between items-center text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
              <span>Segurança de Deglutição:</span>
              <span className="text-primary font-extrabold">{patient.evolutionScore}%</span>
            </div>
            <ProgressBar value={patient.evolutionScore} />
          </div>

          <div className="flex flex-col items-start gap-1 shrink-0">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Classificação de Risco</span>
            <StatusBadge status={getStatus()} />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        
        {/* Left Column: Diagnostics, Consistencies and Evolution Chart (8 cols) */}
        <div className="md:col-span-8 flex flex-col gap-6">
          
          {/* Diagnostics and Treatment Plan */}
          <Card className="flex flex-col gap-4">
            <h2 className="text-base font-extrabold text-primary uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-5 h-5 text-tertiary" />
              Diagnóstico e Plano Terapêutico
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Histórico Clínico</span>
                <p className="text-xs text-text-primary leading-relaxed bg-gray-50 p-3.5 rounded-btn border border-gray-100 font-medium">
                  {patient.historyOfStroke 
                    ? 'Paciente apresenta sequelas motoras decorrentes de Acidente Vascular Cerebral (AVC). Comprometimento focal na fase faríngea da deglutição.' 
                    : 'Deglutição prejudicada devido à progressão neuromuscular da patologia base. Fraqueza muscular do complexo hiolíngeo.'}
                </p>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Metas Terapêuticas</span>
                <p className="text-xs text-text-primary leading-relaxed bg-gray-50 p-3.5 rounded-btn border border-gray-100 font-medium">
                  Fortalecimento de musculatura supra-hióidea; aprimoramento da proteção laringea e coordenação respiração-deglutição. Manutenção do estado nutricional.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
              <span className="text-xs font-bold text-text-primary uppercase tracking-wider">Consistências Permitidas</span>
              <div className="flex flex-wrap gap-2">
                {patient.consistencies.map((cons, index) => (
                  <span 
                    key={index} 
                    className="text-xs font-bold px-3 py-1.5 bg-surface-soft text-primary rounded-badge border border-sky-100"
                  >
                    {cons}
                  </span>
                ))}
              </div>
            </div>
          </Card>

          {/* Clinical Evolution Graph */}
          <LineChart data={evolutionData} title="Evolução Clínica de Deglutição" />
        </div>

        {/* Right Column: Sessions History (4 cols) */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-bold text-text-primary">Sessões Clínicas</h2>
            {isProfessional && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="text-primary hover:text-[#153F5C] transition-colors flex items-center gap-1.5 text-xs font-extrabold cursor-pointer"
              >
                <PlusCircle className="w-4.5 h-4.5" />
                Registrar
              </button>
            )}
          </div>

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-250 text-[#16A34A] text-xs font-semibold p-3.5 rounded-btn text-center animate-pulse flex items-center justify-center gap-2 shadow-sm">
              <CheckCircle className="w-4 h-4" />
              {successMsg}
            </div>
          )}

          {/* Session register form */}
          {showForm && (
            <form onSubmit={handleAddSession} className="bg-white p-5 rounded-card border border-primary/20 shadow-md flex flex-col gap-4 animate-slide-up">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Registrar Nova Sessão</h3>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Descreva a evolução do paciente na sessão, manobras testadas e conduta sugerida..."
                className="w-full text-xs p-3 rounded-btn border border-gray-250 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none h-32 font-medium"
                required
              />
              <div className="flex gap-2">
                <Button type="submit" variant="primary" className="flex-1 !h-10 !py-2 text-xs">
                  Salvar
                </Button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-text-secondary text-xs font-bold py-2 rounded-btn transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {/* Timeline History */}
          <div className="flex flex-col gap-3 max-h-[450px] overflow-y-auto pr-1">
            {filteredHistory.length === 0 ? (
              <div className="bg-white rounded-card p-6 shadow-premium text-center text-text-secondary text-xs">
                Nenhuma nota de sessão registrada.
              </div>
            ) : (
              filteredHistory.map((hist) => (
                <div key={hist.id} className="bg-white rounded-card p-4.5 shadow-premium border border-gray-100 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-[10px] text-text-secondary font-extrabold uppercase tracking-wide">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      {hist.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-tertiary" />
                      {hist.therapist}
                    </span>
                  </div>
                  
                  <p className="text-xs text-text-primary leading-relaxed bg-gray-50/50 p-2.5 rounded-btn border border-gray-50 font-medium">
                    {hist.notes}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordView;
