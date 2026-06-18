import React from 'react';
import { AlertOctagon, X, PhoneCall, CheckCircle } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  patientName: string;
  onConfirmAction: () => void; // ex: Call caregiver / contact fono
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  patientName,
  onConfirmAction
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-[#1F2937]/50 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative bg-[#FFF5F5] border-2 border-[#DC2626] rounded-card w-full max-w-md p-6 shadow-2xl z-10 animate-slide-up overflow-hidden">
        {/* Decorative corner pulse */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#DC2626]/5 rounded-bl-full pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#DC2626]/60 hover:text-[#DC2626] transition-colors duration-200 p-1 hover:bg-[#DC2626]/10 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-start gap-4">
          <div className="bg-[#DC2626]/10 text-[#DC2626] p-3 rounded-full animate-bounce shrink-0">
            <AlertOctagon className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#DC2626] leading-tight">
              {title}
            </h3>
            <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 bg-[#DC2626]/10 text-[#DC2626] rounded-full">
              Paciente: {patientName}
            </span>
          </div>
        </div>

        {/* Message */}
        <p className="mt-4 text-sm text-[#1F2937] leading-relaxed">
          {message}
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              onConfirmAction();
              onClose();
            }}
            className="flex-1 touch-target bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold py-2 px-4 rounded-btn transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:scale-[0.98] active:scale-[0.95]"
          >
            <PhoneCall className="w-4 h-4" />
            Contatar Canal de Apoio
          </button>
          
          <button
            onClick={onClose}
            className="flex-1 touch-target bg-white border border-gray-300 hover:bg-gray-50 text-text-primary font-semibold py-2 px-4 rounded-btn transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[0.98] active:scale-[0.95]"
          >
            <CheckCircle className="w-4 h-4 text-text-secondary" />
            Ciente / Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
