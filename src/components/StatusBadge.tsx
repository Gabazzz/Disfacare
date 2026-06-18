import React from 'react';
import { CheckCircle, AlertTriangle, AlertCircle, Eye } from 'lucide-react';

export type StatusType = 'Estável' | 'Evoluindo bem' | 'Em alerta' | 'Observação' | 'Crítico';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const config: Record<StatusType, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
    'Estável': {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: <CheckCircle className="w-3.5 h-3.5" />
    },
    'Evoluindo bem': {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: <CheckCircle className="w-3.5 h-3.5" />
    },
    'Em alerta': {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: <AlertTriangle className="w-3.5 h-3.5" />
    },
    'Observação': {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: <Eye className="w-3.5 h-3.5" />
    },
    'Crítico': {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      icon: <AlertCircle className="w-3.5 h-3.5" />
    }
  };

  const item = config[status] || {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    icon: null
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-badge border text-xs font-semibold ${item.bg} ${item.text} ${item.border} ${className}`}
    >
      {item.icon}
      <span>{status}</span>
    </span>
  );
};

export default StatusBadge;
