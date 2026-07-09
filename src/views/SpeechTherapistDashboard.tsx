import React, { useState } from 'react';
import { Patient, SymptomLog, CaregiverLog, ClinicalEvolutionPoint } from '../types';
import PatientCard from '../components/PatientCard';
import LineChart from '../components/LineChart';
import StatusBadge from '../components/StatusBadge';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import FAB from '../components/FAB';
import Card from '../components/Card';
import { Users, Calendar, ArrowRight, MessageSquare, ShieldAlert, Search, Filter } from 'lucide-react';

interface SpeechTherapistDashboardProps {
  patients: Patient[];
  symptomLogs: SymptomLog[];
  caregiverLogs: CaregiverLog[];
  evolutionData: Record<string, ClinicalEvolutionPoint[]>;
  onSelectPatient: (patient: Patient) => void;
  onOpenChat: (patientId: string) => void;
}

export const SpeechTherapistDashboard: React.FC<SpeechTherapistDashboardProps> = ({
  patients,
  symptomLogs,
  caregiverLogs,
  evolutionData,
  onSelectPatient,
  onOpenChat
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'todos' | 'alto' | 'médio' | 'baixo'>('todos');
  
  // Find selected patient object
  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // System high-priority alerts:
  const activeAlerts = [
    {
      id: 'alert-1',
      patientId: 'pt-2',
      patientName: 'Maria Souza',
      symptom: 'Nova tosse frequente e engasgo leve na primeira colherada',
      timestamp: '2 horas atrás',
      risk: 'alto' as const
    },
    {
      id: 'alert-2',
      patientId: 'pt-1',
      patientName: 'Joaquim de Oliveira',
      symptom: 'Engasgo na colherada inicial durante o jantar anterior',
      timestamp: 'Ontem às 19:00',
      risk: 'alto' as const
    }
  ];

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatientId(patient.id);
  };

  // Filter patients caseload
  const filteredPatients = patients.filter(pt => {
    const matchesSearch = pt.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pt.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = riskFilter === 'todos' || pt.riskLevel === riskFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in pb-20 md:pb-6">
      
      {/* Header welcome banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-card shadow-premium border border-gray-100">
        <div>
          <span className="text-xs font-bold text-tertiary uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-250">
            PAINEL DO PROFISSIONAL
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary mt-3">
            Bem-vinda, Dra. Ana!
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Aqui está o acompanhamento diário dos seus pacientes disfágicos.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-surface-soft text-primary px-4 py-2.5 rounded-btn border border-sky-100">
          <Users className="w-5 h-5 text-tertiary" />
          <span className="text-sm font-bold">{patients.length} Pacientes Monitorados</span>
        </div>
      </div>

      {/* Grid: Alert Center & Patient List */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left column: Alerts and List (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Active Alerts Box */}
          <div className="bg-red-50/40 border border-red-150 rounded-card p-6 shadow-premium flex flex-col gap-4">
            <div className="flex items-center gap-2 text-critical">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
              <h2 className="text-base font-bold uppercase tracking-wider">Centro de Alertas Críticos</h2>
            </div>
            
            <div className="flex flex-col gap-3">
              {activeAlerts.map((alert) => (
                <div 
                  key={alert.id}
                  className="bg-white rounded-btn p-4 border-l-4 border-critical shadow-sm flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-critical uppercase tracking-wider">
                      ALERTA ALTO RISCO
                    </span>
                    <p className="text-sm font-semibold text-text-primary">
                      {alert.symptom} em <span className="underline font-bold">{alert.patientName}</span>.
                    </p>
                    <span className="text-[11px] text-text-secondary">{alert.timestamp}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      onClick={() => {
                        const targetPt = patients.find(p => p.id === alert.patientId);
                        if (targetPt) {
                          handleSelectPatient(targetPt);
                          onSelectPatient(targetPt);
                        }
                      }}
                      className="!py-1.5 !px-3 !h-9 text-xs !bg-[#DC2626] hover:!bg-[#B91C1C] !text-white font-bold transition-all shadow-sm rounded-btn border-none"
                    >
                      Verificar
                    </Button>
                    <button
                      onClick={() => onOpenChat(alert.patientId)}
                      className="bg-white hover:bg-gray-50 text-text-secondary hover:text-primary p-2.5 rounded-btn transition-colors duration-205 border border-gray-200 cursor-pointer"
                      title="Enviar Mensagem"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Patients Caseload Filter & Search */}
          <div className="bg-white rounded-card p-5 border border-gray-100 shadow-premium flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <h2 className="text-lg font-bold text-text-primary">Meus Pacientes</h2>
              
              {/* Search bar */}
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Buscar paciente..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9.5 pr-4 py-2 text-xs border border-gray-200 rounded-btn bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-2 border-t border-gray-50 pt-3">
              <span className="text-xs font-bold text-text-secondary flex items-center gap-1.5 mr-1">
                <Filter className="w-3.5 h-3.5 text-primary" />
                Filtrar Risco:
              </span>
              {(['todos', 'alto', 'médio', 'baixo'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setRiskFilter(filter)}
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-all select-none cursor-pointer ${
                    riskFilter === filter
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Patients Listing */}
          <div className="flex flex-col gap-3">
            {filteredPatients.length === 0 ? (
              <div className="bg-white rounded-card p-8 text-center text-text-secondary text-xs shadow-premium border border-gray-100">
                Nenhum paciente encontrado com os filtros aplicados.
              </div>
            ) : (
              filteredPatients.map((pt) => (
                <PatientCard
                  key={pt.id}
                  patient={pt}
                  onSelect={handleSelectPatient}
                  isActive={selectedPatientId === pt.id}
                  evolutionData={evolutionData[pt.id] || []}
                />
              ))
            )}
          </div>
        </div>

        {/* Right column: Patient Evolution View & Medical Records preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {selectedPatient ? (
            <div className="flex flex-col gap-6 animate-fade-in">
              
              {/* Selected Patient Info Card */}
              <div className="bg-white rounded-card p-6 shadow-premium border border-gray-100 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <Avatar 
                    src={selectedPatient.avatar} 
                    alt={selectedPatient.name} 
                    size="lg" 
                    riskLevel={selectedPatient.riskLevel} 
                  />
                  <div>
                    <h3 className="text-lg font-extrabold text-primary">{selectedPatient.name}</h3>
                    <p className="text-xs font-medium text-text-secondary">{selectedPatient.diagnosis}</p>
                    <p className="text-xs font-semibold text-text-secondary mt-0.5">{selectedPatient.gender}, {selectedPatient.age} anos</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2">Consistências Permitidas</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPatient.consistencies.map((cons, index) => (
                      <span 
                        key={index}
                        className="text-xs font-bold px-2.5 py-1 bg-surface-soft text-primary rounded-badge border border-sky-100"
                      >
                        {cons}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-btn border border-gray-100">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Nota Terapêutica</h4>
                  <p className="text-xs text-text-secondary leading-relaxed font-medium">
                    {selectedPatient.therapistNotes}
                  </p>
                </div>

                <div className="flex gap-3 mt-2">
                  <Button
                    onClick={() => onSelectPatient(selectedPatient)}
                    variant="primary"
                    className="flex-1"
                  >
                    Ver Prontuário Completo
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </Button>
                  <Button
                    onClick={() => onOpenChat(selectedPatient.id)}
                    variant="inverted"
                    className="!p-3 shrink-0"
                    title="Abrir Chat"
                  >
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </Button>
                </div>
              </div>

              {/* Line chart widget */}
              <LineChart
                data={evolutionData[selectedPatient.id] || []}
                title={`Índice de Segurança — ${selectedPatient.name.split(' ')[0]}`}
              />

            </div>
          ) : (
            <div className="bg-white rounded-card p-8 shadow-premium border border-gray-100 text-center text-text-secondary flex flex-col items-center justify-center h-80">
              <Users className="w-12 h-12 text-gray-300 mb-3 animate-pulse" />
              <p className="text-sm font-semibold">Selecione um paciente na lista para ver a evolução e prontuário.</p>
            </div>
          )}
        </div>
      </div>

      {/* FAB Component for simulation of adding a patient */}
      <FAB 
        onClick={() => alert('Abrindo formulário de cadastro de novo paciente (Simulação B2B DISFACARE)...')} 
        title="Novo Paciente" 
      />
    </div>
  );
};

export default SpeechTherapistDashboard;
