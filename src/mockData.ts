import { Patient, SymptomLog, CaregiverLog, Reminder, ChatMessage, SessionHistory, ClinicalEvolutionPoint } from './types';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pt-1',
    name: 'Joaquim de Oliveira',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    diagnosis: 'Disfagia Orofaringea Pós-AVC',
    riskLevel: 'alto',
    lastUpdated: '10 min atrás',
    consistencies: ['Pastosa Homogênea', 'Líquidos Espessados (Néctar)'],
    age: 81,
    gender: 'Masculino',
    therapistNotes: 'Apresenta penetração laringea esporádica para líquidos finos. Dieta restrita a pastosos. Recomenda-se acompanhamento constante do cuidador durante refeições.',
    historyOfStroke: true,
    evolutionScore: 45
  },
  {
    id: 'pt-2',
    name: 'Maria Souza',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    diagnosis: 'Disfagia Neurogênica (Esclerose Lateral Amiotrófica)',
    riskLevel: 'alto',
    lastUpdated: '2 horas atrás',
    consistencies: ['Pastosa Líquida', 'Líquidos Espessados (Mel)'],
    age: 67,
    gender: 'Feminino',
    therapistNotes: 'Redução da força de ejeção oral. Riscos de aspiração silente. Cuidador relatou nova tosse frequente recente.',
    historyOfStroke: false,
    evolutionScore: 58
  },
  {
    id: 'pt-3',
    name: 'João dos Santos',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    diagnosis: 'Disfagia Orofaringea (Doença de Parkinson)',
    riskLevel: 'médio',
    lastUpdated: '1 dia atrás',
    consistencies: ['Sólida Macia (Cortados)', 'Líquidos Livres (com queixo no peito)'],
    age: 78,
    gender: 'Masculino',
    therapistNotes: 'Tremor reduz controle do bolo alimentar. Necessita de pausas frequentes. Postura com queixo no peito durante a deglutição de líquidos.',
    historyOfStroke: false,
    evolutionScore: 72
  },
  {
    id: 'pt-4',
    name: 'Geraldo Alencar',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    diagnosis: 'Disfagia Mecânica (Pós-Cirurgia de Cabeça e Pescoço)',
    riskLevel: 'baixo',
    lastUpdated: '3 dias atrás',
    consistencies: ['Dieta Regular Macia', 'Líquidos Livres'],
    age: 64,
    gender: 'Masculino',
    therapistNotes: 'Evoluindo muito bem após ressecção parcial. Pequena restrição em abertura de mandíbula, mas deglutição segura.',
    historyOfStroke: false,
    evolutionScore: 88
  }
];

export const INITIAL_SYMPTOM_LOGS: SymptomLog[] = [
  {
    id: 'sym-1',
    patientId: 'pt-3', // João
    timestamp: '2026-06-17T14:30:00Z',
    symptoms: {
      choke: false,
      cough: true,
      pain: false
    },
    notes: 'Tosse leve após engolir água com gás.'
  },
  {
    id: 'sym-2',
    patientId: 'pt-2', // Maria Souza
    timestamp: '2026-06-17T18:15:00Z',
    symptoms: {
      choke: true,
      cough: true,
      pain: false
    },
    notes: 'Nova tosse frequente no jantar e engasgo leve na primeira colherada.'
  }
];

export const INITIAL_CAREGIVER_LOGS: CaregiverLog[] = [
  {
    id: 'cl-1',
    patientId: 'pt-1', // Joaquim
    timestamp: '2026-06-17T12:30:00Z',
    meal: 'Almoço (Purê de batata com frango desfiado espessado)',
    choke: false,
    notes: 'Comeu toda a porção de 200g. Postura ereta mantida por 30 minutos após a refeição.',
    caregiverName: 'Lúcia (Cuidadora)'
  },
  {
    id: 'cl-2',
    patientId: 'pt-1', // Joaquim
    timestamp: '2026-06-16T19:00:00Z',
    meal: 'Jantar (Sopa batida espessada)',
    choke: true,
    notes: 'Houve engasgo na terceira colherada. Velocidade estava muito rápida, diminuímos o ritmo e correu tudo bem.',
    caregiverName: 'Lúcia (Cuidadora)'
  },
  {
    id: 'cl-3',
    patientId: 'pt-3', // João
    timestamp: '2026-06-17T08:00:00Z',
    meal: 'Café da Manhã (Mamão amassado e pão umedecido)',
    choke: false,
    notes: 'Sem intercorrências. Respeitou o tempo de mastigação.',
    caregiverName: 'Pedro (Filho/Cuidador)'
  }
];

export const INITIAL_REMINDERS: Reminder[] = [
  // Joaquim reminders
  { id: 'rem-1', patientId: 'pt-1', label: 'Alimentação Pastosa', time: '12:00', completed: true, type: 'diet' },
  { id: 'rem-2', patientId: 'pt-1', label: 'Tomar Água Espessada (200ml)', time: '14:00', completed: false, type: 'hydration' },
  { id: 'rem-3', patientId: 'pt-1', label: 'Exercício de Deglutição (Masako)', time: '16:00', completed: false, type: 'exercise' },
  { id: 'rem-4', patientId: 'pt-1', label: 'Jantar Pastoso', time: '19:00', completed: false, type: 'diet' },
  
  // João reminders
  { id: 'rem-5', patientId: 'pt-3', label: 'Exercício Shaker (Fortalecimento)', time: '10:00', completed: true, type: 'exercise' },
  { id: 'rem-6', patientId: 'pt-3', label: 'Almoço Regular Macio', time: '12:00', completed: true, type: 'diet' },
  { id: 'rem-7', patientId: 'pt-3', label: 'Tomar Água Queixo no Peito (250ml)', time: '15:00', completed: false, type: 'hydration' },
  { id: 'rem-8', patientId: 'pt-3', label: 'Medicação (Prolopa)', time: '18:00', completed: false, type: 'medication' }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    senderRole: 'profissional',
    senderName: 'Dra. Ana (Fonoaudióloga)',
    text: 'Olá Lúcia! Como foi o almoço do Sr. Joaquim hoje? Ele conseguiu comer o purê na consistência adequada?',
    timestamp: '13:00'
  },
  {
    id: 'msg-2',
    senderRole: 'cuidador',
    senderName: 'Lúcia (Cuidadora)',
    text: 'Olá Dra. Ana! O almoço foi ótimo hoje. Ele comeu toda a porção sem engasgar. Mantivemos ele sentado por 30 minutos depois, como orientado.',
    timestamp: '13:05'
  },
  {
    id: 'msg-3',
    senderRole: 'profissional',
    senderName: 'Dra. Ana (Fonoaudióloga)',
    text: 'Excelente! Amanhã na sessão vamos avaliar a ingestão de líquidos de consistência de néctar.',
    timestamp: '13:10'
  },
  {
    id: 'msg-4',
    senderRole: 'paciente',
    senderName: 'João dos Santos',
    text: 'Dra. Ana, senti uma leve tosse após tomar água hoje à tarde. Devo colocar mais espessante?',
    timestamp: '15:15'
  },
  {
    id: 'msg-5',
    senderRole: 'profissional',
    senderName: 'Dra. Ana (Fonoaudióloga)',
    text: 'Olá João! Tente inclinar o queixo mais em direção ao peito ao engolir a água. Caso a tosse continue mesmo assim, amanhã faremos um ajuste. Não aumente o espessante sem antes medirmos na sessão, tudo bem?',
    timestamp: '15:30'
  }
];

export const INITIAL_SESSION_HISTORY: SessionHistory[] = [
  {
    id: 'sh-1',
    patientId: 'pt-1',
    date: '15/06/2026',
    notes: 'Realizado treino de deglutição com consistência pastosa homogênea. Apresentou bom trânsito oral e ausência de sinais clínicos de penetração/aspiração. Orientado cuidador a manter o volume da colher em nível médio (metade da colher de sobremesa).',
    therapist: 'Dra. Ana'
  },
  {
    id: 'sh-2',
    patientId: 'pt-1',
    date: '08/06/2026',
    notes: 'Sessão com foco em manobras de proteção laringea. Introduzido exercício de Masako e manobra de Mendelsohn. Paciente apresentou fadiga rápida, porém compreende os comandos e consegue executar com auxílio de pistas visuais.',
    therapist: 'Dra. Ana'
  },
  {
    id: 'sh-3',
    patientId: 'pt-3',
    date: '10/06/2026',
    notes: 'Treinamento de postura compensatória de queixo no peito (chin tuck) durante deglutição de líquidos. Boa eficácia demonstrada com redução imediata do escape prematuro e tosse protetora.',
    therapist: 'Dra. Ana'
  }
];

// 30-day clinical safety evolution charts for patients
export const EVOLUTION_DATA_MAP: Record<string, ClinicalEvolutionPoint[]> = {
  'pt-1': [ // Joaquim (High risk, but improving slowly)
    { day: '18/05', safetyIndex: 30 },
    { day: '22/05', safetyIndex: 32 },
    { day: '26/05', safetyIndex: 35 },
    { day: '30/05', safetyIndex: 38 },
    { day: '03/06', safetyIndex: 38 },
    { day: '07/06', safetyIndex: 40 },
    { day: '11/06', safetyIndex: 42 },
    { day: '15/06', safetyIndex: 45 }
  ],
  'pt-2': [ // Maria Souza (Critical risk, declining slightly)
    { day: '18/05', safetyIndex: 65 },
    { day: '22/05', safetyIndex: 64 },
    { day: '26/05', safetyIndex: 62 },
    { day: '30/05', safetyIndex: 60 },
    { day: '03/06', safetyIndex: 61 },
    { day: '07/06', safetyIndex: 59 },
    { day: '11/06', safetyIndex: 58 },
    { day: '15/06', safetyIndex: 58 }
  ],
  'pt-3': [ // João (Medium risk, improving well)
    { day: '18/05', safetyIndex: 60 },
    { day: '22/05', safetyIndex: 62 },
    { day: '26/05', safetyIndex: 65 },
    { day: '30/05', safetyIndex: 68 },
    { day: '03/06', safetyIndex: 70 },
    { day: '07/06', safetyIndex: 68 },
    { day: '11/06', safetyIndex: 70 },
    { day: '15/06', safetyIndex: 72 }
  ],
  'pt-4': [ // Geraldo (Low risk, close to fully safe)
    { day: '18/05', safetyIndex: 75 },
    { day: '22/05', safetyIndex: 78 },
    { day: '26/05', safetyIndex: 82 },
    { day: '30/05', safetyIndex: 85 },
    { day: '03/06', safetyIndex: 84 },
    { day: '07/06', safetyIndex: 86 },
    { day: '11/06', safetyIndex: 88 },
    { day: '15/06', safetyIndex: 88 }
  ]
};
