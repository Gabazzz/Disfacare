import React from 'react';
import { Patient, ClinicalEvolutionPoint } from '../types';
import StatusBadge, { StatusType } from './StatusBadge';
import MiniBarChart from './MiniBarChart';
import Avatar from './Avatar';
import Button from './Button';
import { Calendar } from 'lucide-react';

interface PatientCardProps {
  patient: Patient;
  onSelect: (patient: Patient) => void;
  isActive?: boolean;
  evolutionData?: ClinicalEvolutionPoint[];
}

export const PatientCard: React.FC<PatientCardProps> = ({ 
  patient, 
  onSelect, 
  isActive = false,
  evolutionData = [] 
}) => {
  // Map risk level to semantic status badge strings
  const getStatus = (): StatusType => {
    if (patient.riskLevel === 'alto') return 'Crítico';
    if (patient.riskLevel === 'médio') return 'Em alerta';
    return 'Estável';
  };

  // Calculate evolution percentage variation based on last 2 points
  const getEvolutionVariation = () => {
    if (!evolutionData || evolutionData.length < 2) return null;
    const points = evolutionData.slice(-2);
    const diff = points[1].safetyIndex - points[0].safetyIndex;
    
    return {
      value: diff,
      text: diff > 0 ? `+${diff}%` : diff < 0 ? `${diff}%` : '0%',
      isPositive: diff > 0,
      isNegative: diff < 0
    };
  };

  const trend = getEvolutionVariation();

  return (
    <div
      onClick={() => onSelect(patient)}
      className={`bg-white rounded-card p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-2 transition-all duration-300 shadow-premium ${
        isActive 
          ? 'border-primary bg-surface-soft/20 shadow-md translate-x-1' 
          : 'border-transparent hover:border-surface-soft'
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Avatar Component */}
        <Avatar 
          src={patient.avatar} 
          alt={patient.name} 
          size="md" 
          riskLevel={patient.riskLevel} 
        />

        {/* Details */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-extrabold text-text-primary leading-tight">
              {patient.name}
            </h3>
            <span className="text-[11px] font-bold text-text-secondary bg-gray-100 px-2.5 py-0.5 rounded-full">
              {patient.age} anos
            </span>
          </div>
          <p className="text-xs text-text-secondary line-clamp-1 font-medium">
            {patient.diagnosis}
          </p>
          <div className="flex items-center gap-2.5 mt-1 flex-wrap">
            <StatusBadge status={getStatus()} />
            <span className="text-[11px] font-semibold text-text-secondary flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              {patient.lastUpdated}
            </span>
          </div>
        </div>
      </div>

      {/* Evolution MiniBarChart & Details Button */}
      <div className="flex items-center justify-between sm:justify-end gap-5 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 shrink-0">
        {/* MiniBarChart and Trend */}
        <div className="flex items-center gap-2.5">
          {evolutionData && evolutionData.length > 0 && (
            <div className="flex flex-col items-end gap-1">
              <MiniBarChart data={evolutionData} />
              {trend && (
                <span className={`text-[10px] font-extrabold tracking-wide ${
                  trend.isPositive 
                    ? 'text-success' 
                    : trend.isNegative 
                      ? 'text-critical' 
                      : 'text-text-secondary'
                }`}>
                  {trend.text} evolução
                </span>
              )}
            </div>
          )}
        </div>

        {/* View Details B2B Action Button */}
        <Button 
          variant={isActive ? 'primary' : 'outlined'} 
          className="!py-2 !px-4 !h-10 text-xs shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(patient);
          }}
        >
          Ver Detalhes
        </Button>
      </div>
    </div>
  );
};

export default PatientCard;
