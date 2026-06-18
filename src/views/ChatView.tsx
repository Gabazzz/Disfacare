import React, { useState, useRef, useEffect } from 'react';
import { Patient, ChatMessage, Reminder } from '../types';
import Button from '../components/Button';
import Card from '../components/Card';
import { Send, Clock, Plus, Trash2, CheckSquare, MessageSquare, AlertCircle } from 'lucide-react';

interface ChatViewProps {
  currentPatient: Patient;
  chatMessages: ChatMessage[];
  reminders: Reminder[];
  onSendMessage: (text: string) => void;
  onAddReminder: (label: string, time: string, type: 'diet' | 'exercise' | 'medication' | 'hydration') => void;
  onDeleteReminder: (reminderId: string) => void;
  onToggleReminder: (reminderId: string) => void;
  currentRole: 'profissional' | 'paciente' | 'cuidador';
}

export const ChatView: React.FC<ChatViewProps> = ({
  currentPatient,
  chatMessages,
  reminders,
  onSendMessage,
  onAddReminder,
  onDeleteReminder,
  onToggleReminder,
  currentRole
}) => {
  const [typedMessage, setTypedMessage] = useState('');
  const [remLabel, setRemLabel] = useState('');
  const [remTime, setRemTime] = useState('12:00');
  const [remType, setRemType] = useState<'diet' | 'exercise' | 'medication' | 'hydration'>('diet');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;
    onSendMessage(typedMessage);
    setTypedMessage('');
  };

  const handleAddRem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remLabel.trim()) return;
    onAddReminder(remLabel, remTime, remType);
    setRemLabel('');
  };

  const roleLabels = {
    profissional: { label: 'Dra. Ana (Fonoaudióloga)', style: 'bg-primary/10 text-primary' },
    paciente: { label: 'João (Paciente)', style: 'bg-secondary/10 text-secondary' },
    cuidador: { label: 'Lúcia (Cuidadora)', style: 'bg-warning/10 text-warning' }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6 w-full animate-fade-in pb-20 md:pb-6 items-stretch min-h-[75vh]">
      
      {/* Left panel: Clinical Chat (7 cols) */}
      <div className="lg:col-span-7 bg-white rounded-card shadow-premium border border-gray-100 flex flex-col h-[75vh] overflow-hidden">
        {/* Chat header */}
        <div className="p-4.5 border-b border-gray-150 flex items-center justify-between shrink-0 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-soft text-primary flex items-center justify-center font-extrabold shadow-sm">
              <MessageSquare className="w-5 h-5 text-tertiary" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-primary leading-tight">
                Canal de Comunicação Direta
              </h3>
              <p className="text-[10px] text-text-secondary mt-0.5 font-semibold">
                Supervisão clínica de {currentPatient.name}
              </p>
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${roleLabels[currentRole].style}`}>
            Perfil: {currentRole}
          </span>
        </div>

        {/* Message feed */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 bg-gray-50/30">
          {chatMessages.map((msg) => {
            const isMe = 
              (currentRole === 'profissional' && msg.senderRole === 'profissional') ||
              (currentRole === 'paciente' && msg.senderRole === 'paciente') ||
              (currentRole === 'cuidador' && msg.senderRole === 'cuidador');

            return (
              <div 
                key={msg.id}
                className={`flex flex-col max-w-[85%] ${
                  isMe ? 'self-end items-end' : 'self-start items-start'
                }`}
              >
                {/* Sender badge info */}
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <span className="text-[9px] font-extrabold text-text-secondary">
                    {msg.senderName}
                  </span>
                  <span className="text-[8px] text-text-secondary font-semibold">• {msg.timestamp}</span>
                </div>

                {/* Message Bubble */}
                <div 
                  className={`px-4.5 py-3 rounded-card text-xs leading-relaxed shadow-sm font-medium ${
                    isMe 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-white text-text-primary border border-gray-150 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Message Input form */}
        <form onSubmit={handleSend} className="p-4 border-t border-gray-150 bg-white flex items-center gap-2 shrink-0">
          <input
            id="chat-message-input"
            type="text"
            value={typedMessage}
            onChange={(e) => setTypedMessage(e.target.value)}
            placeholder="Digite sua mensagem clínica ou dúvida..."
            className="flex-1 text-xs p-3.5 rounded-btn border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
          />
          <button
            id="chat-send-btn"
            type="submit"
            className="bg-primary hover:bg-[#153F5C] text-white p-3 rounded-btn shadow transition-all hover:scale-105 active:scale-95 shrink-0 flex items-center justify-center cursor-pointer"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </form>
      </div>

      {/* Right panel: Clinical reminders manager (5 cols) */}
      <div className="lg:col-span-5 bg-white rounded-card shadow-premium border border-gray-100 p-6 flex flex-col h-[75vh] overflow-hidden">
        <h3 className="text-base font-extrabold text-primary uppercase tracking-wider mb-4 flex items-center gap-2 shrink-0">
          <Clock className="w-5 h-5 text-warning" />
          Lembretes do Paciente
        </h3>

        {/* Add Reminder Form */}
        <form onSubmit={handleAddRem} className="bg-gray-50 border border-gray-150 p-4 rounded-btn flex flex-col gap-3 shrink-0 mb-4">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Configurar Novo Lembrete</span>
          
          <div className="flex flex-col gap-1">
            <input
              id="reminder-label-input"
              type="text"
              required
              value={remLabel}
              onChange={(e) => setRemLabel(e.target.value)}
              placeholder="Ex: Exercício Shaker, Beber água"
              className="text-xs p-2.5 rounded-btn border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-text-secondary uppercase tracking-wider">Horário:</label>
              <input
                id="reminder-time-input"
                type="time"
                value={remTime}
                onChange={(e) => setRemTime(e.target.value)}
                className="text-xs p-2 rounded-btn border border-gray-200 bg-white focus:outline-none font-bold"
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-text-secondary uppercase tracking-wider">Categoria:</label>
              <select
                id="reminder-type-select"
                value={remType}
                onChange={(e: any) => setRemType(e.target.value)}
                className="text-xs p-2 rounded-btn border border-gray-200 bg-white focus:outline-none font-bold"
              >
                <option value="diet">Alimentação</option>
                <option value="hydration">Hidratação</option>
                <option value="exercise">Exercício</option>
                <option value="medication">Medicamento</option>
              </select>
            </div>
          </div>

          <Button
            id="reminder-submit-btn"
            type="submit"
            variant="primary"
            className="w-full !h-10 !py-2 text-xs font-bold mt-1"
          >
            <Plus className="w-4 h-4 shrink-0" />
            Adicionar Lembrete
          </Button>
        </form>

        {/* Reminders list inside viewport */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-1">
          {reminders.filter(r => r.patientId === currentPatient.id).length === 0 ? (
            <div className="text-center text-text-secondary text-xs p-6 border border-dashed border-gray-200 rounded-btn">
              Nenhum lembrete cadastrado.
            </div>
          ) : (
            reminders
              .filter(r => r.patientId === currentPatient.id)
              .map((rem) => (
                <div 
                  key={rem.id}
                  className={`p-3 rounded-btn border transition-all duration-200 flex items-center justify-between gap-3 ${
                    rem.completed 
                      ? 'bg-emerald-50/40 border-emerald-100 text-[#16A34A]' 
                      : 'bg-white border-gray-150 text-text-primary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button 
                      type="button"
                      onClick={() => onToggleReminder(rem.id)}
                      className={`p-1 rounded transition-colors cursor-pointer ${
                        rem.completed ? 'text-[#16A34A]' : 'text-gray-300 hover:text-primary'
                      }`}
                    >
                      <CheckSquare className="w-5 h-5" />
                    </button>
                    <div>
                      <span className="text-[9px] font-bold bg-gray-100 text-text-secondary px-1.5 py-0.5 rounded uppercase tracking-wider">
                        {rem.type === 'diet' ? 'Dieta' : rem.type === 'hydration' ? 'Água' : rem.type === 'exercise' ? 'Treino' : 'Medicamento'}
                      </span>
                      <p className={`text-xs font-bold leading-tight mt-1 ${rem.completed ? 'line-through opacity-70' : ''}`}>
                        {rem.label}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-bold font-mono text-primary bg-surface-soft px-2 py-0.5 rounded border border-sky-100">
                      {rem.time}
                    </span>
                    <button
                      onClick={() => onDeleteReminder(rem.id)}
                      className="text-gray-300 hover:text-critical transition-colors p-1.5 rounded-full hover:bg-red-50 cursor-pointer"
                      title="Deletar lembrete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatView;
