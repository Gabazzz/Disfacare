import React from 'react';

interface BadgeProps {
  level: 'alto' | 'médio' | 'baixo';
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ level, pulse = false }) => {
  const styles = {
    alto: {
      bg: 'bg-red-50 text-[#DC2626] border border-red-200',
      dot: 'bg-[#DC2626]',
      label: 'ALTO RISCO',
      pulseClass: 'animate-pulse-red'
    },
    'médio': {
      bg: 'bg-amber-50 text-[#D97706] border border-amber-200',
      dot: 'bg-[#D97706]',
      label: 'MÉDIO RISCO',
      pulseClass: 'animate-pulse-orange'
    },
    baixo: {
      bg: 'bg-emerald-50 text-[#16A34A] border border-emerald-200',
      dot: 'bg-[#16A34A]',
      label: 'BAIXO RISCO',
      pulseClass: 'animate-pulse-green'
    }
  };

  const current = styles[level] || styles.baixo;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-badge font-label-badge ${current.bg} ${
        pulse ? current.pulseClass : ''
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${current.dot} shrink-0`} />
      <span>{current.label}</span>
    </span>
  );
};

export default Badge;
