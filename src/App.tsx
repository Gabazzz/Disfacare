import { useState, useEffect } from 'react';
import { 
  INITIAL_PATIENTS, 
  INITIAL_SYMPTOM_LOGS, 
  INITIAL_CAREGIVER_LOGS, 
  INITIAL_REMINDERS, 
  INITIAL_CHAT_MESSAGES, 
  INITIAL_SESSION_HISTORY, 
  EVOLUTION_DATA_MAP 
} from './mockData';
import { Patient, SymptomLog, CaregiverLog, Reminder, ChatMessage, SessionHistory } from './types';

// Views
import LandingPage from './views/LandingPage';
import SpeechTherapistDashboard from './views/SpeechTherapistDashboard';
import PatientDashboard from './views/PatientDashboard';
import CaregiverDashboard from './views/CaregiverDashboard';
import MedicalRecordView from './views/MedicalRecordView';
import ChatView from './views/ChatView';

// Components
import Sidebar from './components/Sidebar';
import BottomNav, { NavItem } from './components/BottomNav';
import AlertModal from './components/AlertModal';
import Button from './components/Button';

// Icons
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Heart, 
  Clipboard, 
  LogOut, 
  Activity, 
  Users, 
  ShieldAlert,
  Menu,
  Sparkles,
  User
} from 'lucide-react';

function App() {
  // App States
  const [role, setRole] = useState<'profissional' | 'paciente' | 'cuidador'>('profissional');
  const [activeTab, setActiveTab] = useState<string>('landing'); // 'landing' or dynamic tabs
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Clinical Database state
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [symptomLogs, setSymptomLogs] = useState<SymptomLog[]>(INITIAL_SYMPTOM_LOGS);
  const [caregiverLogs, setCaregiverLogs] = useState<CaregiverLog[]>(INITIAL_CAREGIVER_LOGS);
  const [reminders, setReminders] = useState<Reminder[]>(INITIAL_REMINDERS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [sessionHistory, setSessionHistory] = useState<SessionHistory[]>(INITIAL_SESSION_HISTORY);
  const [evolutionData, setEvolutionData] = useState(EVOLUTION_DATA_MAP);

  // Selected patient for medical record/caregiver view
  const [selectedPatientId, setSelectedPatientId] = useState<string>('pt-1'); // Default Joaquim

  // Alert Modal state
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertData, setAlertData] = useState({
    title: '',
    message: '',
    patientName: '',
    onConfirm: () => {}
  });

  // When changing roles, assign corresponding default patients
  const handleRoleChange = (newRole: 'profissional' | 'paciente' | 'cuidador') => {
    setIsLoading(true);
    setRole(newRole);
    if (newRole === 'paciente') {
      setSelectedPatientId('pt-3'); // João dos Santos
    } else if (newRole === 'cuidador') {
      setSelectedPatientId('pt-1'); // Joaquim de Oliveira
    } else {
      setSelectedPatientId('pt-1');
    }
    // Simple skeleton loading animation for premium feel
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  // Switch tabs
  const handleTabChange = (tabId: string) => {
    if (tabId === 'landing') {
      setActiveTab('landing');
    } else {
      setIsLoading(true);
      setActiveTab(tabId);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  // Add symptom log (triggered from Patient view)
  const handleAddSymptomLog = (symptoms: { choke: boolean; cough: boolean; pain: boolean }, notes: string) => {
    const newLog: SymptomLog = {
      id: `sym-${Date.now()}`,
      patientId: selectedPatientId,
      timestamp: new Date().toISOString(),
      symptoms,
      notes
    };
    
    setSymptomLogs(prev => [newLog, ...prev]);

    // Update patient's last active stamp
    setPatients(prev => 
      prev.map(p => p.id === selectedPatientId ? { ...p, lastUpdated: 'Agora mesmo' } : p)
    );

    // If severe symptom (choke or cough), trigger professional alert and pop modal for demo
    if (symptoms.choke || symptoms.cough) {
      // Deglutição safety level drops slightly in chart
      setEvolutionData(prev => {
        const currentData = [...(prev[selectedPatientId] || [])];
        if (currentData.length > 0) {
          const lastPoint = currentData[currentData.length - 1];
          const newScore = Math.max(lastPoint.safetyIndex - 10, 20);
          
          // Add new point for today
          const todayStr = new Date().toLocaleDateString([], {day: '2-digit', month: '2-digit'});
          currentData.push({ day: todayStr, safetyIndex: newScore });
        }
        return { ...prev, [selectedPatientId]: currentData };
      });

      // Update patient risk to Alto
      setPatients(prev => 
        prev.map(p => p.id === selectedPatientId ? { ...p, riskLevel: 'alto' } : p)
      );

      // Trigger high priority modal immediately to show system capability
      setAlertData({
        title: symptoms.choke ? 'ALERTA: Engasgo Agudo Registrado' : 'ALERTA: Tosse Persistente Registrada',
        message: `O paciente relatou um sintoma respiratório durante o acompanhamento diário. A consistência alimentar permitida deve ser revisada e o canal de suporte acionado em caso de desconforto respiratório contínuo.`,
        patientName: patients.find(p => p.id === selectedPatientId)?.name || 'Paciente',
        onConfirm: () => {
          // Trigger support call simulation
          alert('Ligando para a equipe de Fonoaudiologia de plantão...');
        }
      });
      setAlertModalOpen(true);
    }
  };

  // Add caregiver log
  const handleAddCaregiverLog = (meal: string, choke: boolean, notes: string) => {
    const newLog: CaregiverLog = {
      id: `cl-${Date.now()}`,
      patientId: selectedPatientId,
      timestamp: new Date().toISOString(),
      meal,
      choke,
      notes,
      caregiverName: 'Lúcia (Cuidadora)'
    };

    setCaregiverLogs(prev => [newLog, ...prev]);

    // Update patient's last active stamp
    setPatients(prev => 
      prev.map(p => p.id === selectedPatientId ? { ...p, lastUpdated: 'Agora mesmo' } : p)
    );

    // If caregiver reported choke, drop safety index and raise risk to alto
    if (choke) {
      setEvolutionData(prev => {
        const currentData = [...(prev[selectedPatientId] || [])];
        if (currentData.length > 0) {
          const lastPoint = currentData[currentData.length - 1];
          const newScore = Math.max(lastPoint.safetyIndex - 15, 20);
          const todayStr = new Date().toLocaleDateString([], {day: '2-digit', month: '2-digit'});
          currentData.push({ day: todayStr, safetyIndex: newScore });
        }
        return { ...prev, [selectedPatientId]: currentData };
      });

      setPatients(prev => 
        prev.map(p => p.id === selectedPatientId ? { ...p, riskLevel: 'alto' } : p)
      );

      // Open Modal
      setAlertData({
        title: 'ALERTA: Intercorrência Alimentar Importante',
        message: `O cuidador reportou engasgo na refeição recente: "${meal}". Recomenda-se suspender sólidos temporariamente e contatar a fonoaudióloga.`,
        patientName: patients.find(p => p.id === selectedPatientId)?.name || 'Paciente',
        onConfirm: () => {
          handleTabChange('chat');
        }
      });
      setAlertModalOpen(true);
    } else {
      // Good intake, increase safety score slightly!
      setEvolutionData(prev => {
        const currentData = [...(prev[selectedPatientId] || [])];
        if (currentData.length > 0) {
          const lastPoint = currentData[currentData.length - 1];
          const newScore = Math.min(lastPoint.safetyIndex + 3, 98);
          const todayStr = new Date().toLocaleDateString([], {day: '2-digit', month: '2-digit'});
          currentData.push({ day: todayStr, safetyIndex: newScore });
        }
        return { ...prev, [selectedPatientId]: currentData };
      });
    }
  };

  // Toggle checklist reminders
  const handleToggleReminder = (reminderId: string) => {
    setReminders(prev => 
      prev.map(r => r.id === reminderId ? { ...r, completed: !r.completed } : r)
    );
  };

  // Add reminder
  const handleAddReminder = (label: string, time: string, type: 'diet' | 'exercise' | 'medication' | 'hydration') => {
    const newRem: Reminder = {
      id: `rem-${Date.now()}`,
      patientId: selectedPatientId,
      label,
      time,
      completed: false,
      type
    };
    setReminders(prev => [...prev, newRem]);
  };

  // Delete reminder
  const handleDeleteReminder = (reminderId: string) => {
    setReminders(prev => prev.filter(r => r.id !== reminderId));
  };

  // Add chat message
  const handleSendMessage = (text: string) => {
    const senderNames = {
      profissional: 'Dra. Ana (Fonoaudióloga)',
      paciente: patients.find(p => p.id === selectedPatientId)?.name.split(' ')[0] + ' (Paciente)' || 'Paciente',
      cuidador: 'Lúcia (Cuidadora)'
    };

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderRole: role,
      senderName: senderNames[role],
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newMsg]);
  };

  // Add clinical session note
  const handleAddSessionNote = (patientId: string, notes: string) => {
    const newSession: SessionHistory = {
      id: `sh-${Date.now()}`,
      patientId,
      date: new Date().toLocaleDateString(),
      notes,
      therapist: 'Dra. Ana'
    };

    setSessionHistory(prev => [newSession, ...prev]);

    // Increase safety evolution score on successful session!
    setEvolutionData(prev => {
      const currentData = [...(prev[patientId] || [])];
      if (currentData.length > 0) {
        const lastPoint = currentData[currentData.length - 1];
        const newScore = Math.min(lastPoint.safetyIndex + 8, 95);
        const todayStr = new Date().toLocaleDateString([], {day: '2-digit', month: '2-digit'});
        currentData.push({ day: todayStr, safetyIndex: newScore });
      }
      return { ...prev, [patientId]: currentData };
    });

    // Lower risk slightly after therapeutic review if it was high
    setPatients(prev => 
      prev.map(p => p.id === patientId && p.riskLevel === 'alto' ? { ...p, riskLevel: 'médio' } : p)
    );
  };

  // Active patient object
  const currentPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Dynamic Navigation Items based on active simulated profile
  const navItemsByRole: Record<'profissional' | 'paciente' | 'cuidador', NavItem[]> = {
    profissional: [
      { id: 'dashboard', label: 'Painel', icon: LayoutDashboard },
      { id: 'prontuario', label: 'Prontuários', icon: FileText },
      { id: 'chat', label: 'Chat & Alertas', icon: MessageSquare },
    ],
    paciente: [
      { id: 'dashboard', label: 'Início', icon: Heart },
      { id: 'exercicios', label: 'Exercícios', icon: Activity },
      { id: 'dieta', label: 'Dieta', icon: Clipboard },
      { id: 'chat', label: 'Mensagens', icon: MessageSquare },
      { id: 'perfil', label: 'Perfil', icon: User },
    ],
    cuidador: [
      { id: 'dashboard', label: 'Refeições', icon: Clipboard },
      { id: 'prontuario', label: 'Prontuário', icon: FileText },
      { id: 'chat', label: 'Chat Apoio', icon: MessageSquare },
    ]
  };

  const activeNavItems = navItemsByRole[role];

  // Landing Page layout
  if (activeTab === 'landing') {
    return (
      <LandingPage 
        onEnterApp={(selectedRole) => {
          handleRoleChange(selectedRole);
          handleTabChange('dashboard');
        }} 
      />
    );
  }

  return (
    <div className="flex bg-appBg min-h-screen text-text-primary overflow-x-hidden font-sans">
      
      {/* 1. Desktop collapsible sidebar navigation */}
      <Sidebar
        items={activeNavItems}
        activeTab={activeTab}
        onChangeTab={handleTabChange}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        currentRole={role}
        onChangeRole={handleRoleChange}
      />

      {/* Main app body */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
        
        {/* 2. Mobile Responsive Glassmorphic Header */}
        <header className="flex md:hidden glassmorphism items-center justify-between px-5 h-16 fixed top-0 left-0 right-0 z-40">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="DISFACARE Logo"
              className="w-8 h-8 rounded-full object-cover shadow"
            />
            <span className="text-base font-extrabold text-primary-main tracking-tight">DISFACARE</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick role preview chip for testing on mobile */}
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
              role === 'profissional' ? 'bg-primary-main/10 text-primary-main' : role === 'paciente' ? 'bg-health/10 text-health' : 'bg-amber-100 text-amber-600'
            }`}>
              {role === 'profissional' ? 'Fono' : role === 'paciente' ? 'Paciente' : 'Cuidador'}
            </span>
            
            <button
              onClick={() => handleTabChange('landing')}
              className="text-text-secondary hover:text-[#E24B4A] transition-colors duration-200 p-1.5 hover:bg-red-50 rounded-full"
              title="Voltar para Landing Page"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </header>

        {/* Floating Simulation Selector on Mobile so reviewers can swap personas easily */}
        <div className="md:hidden fixed bottom-18 right-4 z-40">
          <div className="relative group">
            <button 
              className="w-11 h-11 bg-primary-main text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
              onClick={() => {
                const rolesArray: ('profissional' | 'paciente' | 'cuidador')[] = ['profissional', 'paciente', 'cuidador'];
                const nextIdx = (rolesArray.indexOf(role) + 1) % rolesArray.length;
                handleRoleChange(rolesArray[nextIdx]);
              }}
              title="Trocar Perfil (Simulação)"
            >
              <Sparkles className="w-5 h-5 text-health" />
            </button>
          </div>
        </div>

        {/* 3. Main Content Area */}
        <main className="flex-1 pt-20 pb-24 md:pt-8 md:pb-8 px-4 md:px-8 overflow-y-auto max-w-[1400px] mx-auto w-full">
          
          {/* Skeletons Loading Simulation */}
          {isLoading ? (
            <div className="flex flex-col gap-6 w-full">
              {/* Header skeleton */}
              <div className="bg-white p-6 rounded-card border border-gray-100 flex justify-between items-center">
                <div className="flex flex-col gap-2 w-1/3">
                  <div className="h-4 bg-gray-200 rounded animate-skeleton w-3/4" />
                  <div className="h-8 bg-gray-200 rounded animate-skeleton" />
                  <div className="h-3 bg-gray-200 rounded animate-skeleton w-1/2" />
                </div>
                <div className="h-10 bg-gray-200 rounded animate-skeleton w-32" />
              </div>
              
              {/* Body grid skeletons */}
              <div className="grid md:grid-cols-12 gap-6">
                <div className="md:col-span-7 flex flex-col gap-5">
                  <div className="h-44 bg-white rounded-card animate-skeleton" />
                  <div className="h-64 bg-white rounded-card animate-skeleton" />
                </div>
                <div className="md:col-span-5 flex flex-col gap-5">
                  <div className="h-64 bg-white rounded-card animate-skeleton" />
                  <div className="h-44 bg-white rounded-card animate-skeleton" />
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Render dynamic screens based on active tab and role */}
              {activeTab === 'dashboard' && role === 'profissional' && (
                <SpeechTherapistDashboard
                  patients={patients}
                  symptomLogs={symptomLogs}
                  caregiverLogs={caregiverLogs}
                  evolutionData={evolutionData}
                  onSelectPatient={(pt) => {
                    setSelectedPatientId(pt.id);
                    handleTabChange('prontuario');
                  }}
                  onOpenChat={(ptId) => {
                    setSelectedPatientId(ptId);
                    handleTabChange('chat');
                  }}
                />
              )}

              {(activeTab === 'dashboard' || activeTab === 'exercicios' || activeTab === 'dieta') && role === 'paciente' && (
                <PatientDashboard
                  patient={currentPatient}
                  reminders={reminders}
                  onToggleReminder={handleToggleReminder}
                  onAddSymptomLog={handleAddSymptomLog}
                  onOpenChat={() => handleTabChange('chat')}
                  focusSection={activeTab as any}
                />
              )}

              {activeTab === 'perfil' && role === 'paciente' && (
                <div className="bg-white rounded-card p-6 shadow-premium border border-gray-100 max-w-md mx-auto flex flex-col items-center text-center gap-4 animate-fade-in">
                  <div className="relative shrink-0">
                    <img
                      src={currentPatient.avatar}
                      alt={currentPatient.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm ring-2 ring-primary ring-offset-1"
                    />
                    <span className="absolute bottom-0 right-0 w-4.5 h-4.5 rounded-full border-2 border-white bg-success" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-primary">{currentPatient.name}</h2>
                    <p className="text-xs font-semibold text-text-secondary mt-1">{currentPatient.diagnosis}</p>
                    <span className="inline-block mt-2 text-[10px] font-bold px-3 py-1 bg-sky-50 text-primary rounded-full border border-sky-100">
                      Paciente ID: {currentPatient.id}
                    </span>
                  </div>
                  <div className="w-full border-t border-gray-100 pt-4 flex flex-col gap-2.5 text-left text-xs font-semibold text-text-secondary">
                    <p><strong>Idade:</strong> {currentPatient.age} anos</p>
                    <p><strong>Gênero:</strong> {currentPatient.gender}</p>
                    <p><strong>Fonoaudióloga Responsável:</strong> Dra. Ana</p>
                    <p><strong>Clínica:</strong> DISFACARE CareLink B2B</p>
                  </div>
                  <Button variant="outlined" className="w-full mt-2 !h-10 !py-2 text-xs" onClick={() => handleRoleChange('profissional')}>
                    Trocar Perfil (Simulação)
                  </Button>
                </div>
              )}

              {activeTab === 'dashboard' && role === 'cuidador' && (
                <CaregiverDashboard
                  patient={currentPatient}
                  caregiverLogs={caregiverLogs}
                  onAddCaregiverLog={handleAddCaregiverLog}
                  onOpenChat={() => handleTabChange('chat')}
                />
              )}

              {activeTab === 'prontuario' && (
                <MedicalRecordView
                  patient={currentPatient}
                  sessionHistory={sessionHistory}
                  evolutionData={evolutionData[currentPatient.id] || []}
                  onAddSessionNote={handleAddSessionNote}
                  isProfessional={role === 'profissional'}
                />
              )}

              {activeTab === 'chat' && (
                <ChatView
                  currentPatient={currentPatient}
                  chatMessages={chatMessages}
                  reminders={reminders}
                  onSendMessage={handleSendMessage}
                  onAddReminder={handleAddReminder}
                  onDeleteReminder={handleDeleteReminder}
                  onToggleReminder={handleToggleReminder}
                  currentRole={role}
                />
              )}
            </>
          )}
        </main>

        {/* 4. Mobile Bottom Navigation */}
        <BottomNav
          items={activeNavItems}
          activeTab={activeTab}
          onChangeTab={handleTabChange}
        />

        {/* Exit back to landing footer in desktop */}
        <div className="hidden md:flex justify-end p-4 border-t border-gray-150 bg-white/40 shrink-0">
          <button
            onClick={() => handleTabChange('landing')}
            className="text-xs text-text-secondary hover:text-[#E24B4A] transition-colors flex items-center gap-1.5 font-bold"
          >
            <LogOut className="w-4 h-4" />
            Sair para Landing Page
          </button>
        </div>
      </div>

      {/* Global Alerts modal */}
      <AlertModal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        title={alertData.title}
        message={alertData.message}
        patientName={alertData.patientName}
        onConfirmAction={alertData.onConfirm}
      />
    </div>
  );
}

export default App;
