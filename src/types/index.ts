export interface Patient {
  id: string;
  name: string;
  avatar: string;
  diagnosis: string;
  riskLevel: 'alto' | 'médio' | 'baixo';
  lastUpdated: string;
  consistencies: string[];
  age: number;
  gender: string;
  therapistNotes: string;
  historyOfStroke: boolean;
  evolutionScore: number; // 0 to 100 representing swallowing safety score
}

export interface SymptomLog {
  id: string;
  patientId: string;
  timestamp: string;
  symptoms: {
    choke: boolean;  // Engasgo
    cough: boolean;  // Tosse
    pain: boolean;   // Dor ao engolir
  };
  notes?: string;
}

export interface CaregiverLog {
  id: string;
  patientId: string;
  timestamp: string;
  meal: string;      // ex: Almoço, Café da manhã, Lanche
  choke: boolean;     // houve engasgo? (sim/não)
  notes?: string;
  caregiverName: string;
}

export interface Reminder {
  id: string;
  patientId: string;
  label: string;
  time: string;
  completed: boolean;
  type: 'diet' | 'exercise' | 'medication' | 'hydration';
}

export interface ChatMessage {
  id: string;
  senderRole: 'profissional' | 'paciente' | 'cuidador';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface SessionHistory {
  id: string;
  patientId: string;
  date: string;
  notes: string;
  therapist: string;
}

export interface ClinicalEvolutionPoint {
  day: string; // Day of month e.g. "01/06"
  safetyIndex: number; // Swallowing clinical safety score (0 - 100)
}
