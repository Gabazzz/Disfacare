import React from 'react';
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { ClinicalEvolutionPoint } from '../types';

interface LineChartProps {
  data: ClinicalEvolutionPoint[];
  title?: string;
}

export const LineChart: React.FC<LineChartProps> = ({ data, title }) => {
  return (
    <div className="bg-white p-5 rounded-card shadow-premium border border-gray-100 flex flex-col gap-4 w-full h-[320px]">
      {title && (
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-primary-main uppercase tracking-wider">
            {title}
          </h4>
          <span className="text-xs text-text-secondary">Últimos 30 dias</span>
        </div>
      )}

      <div className="w-full" style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height={220}>
          <RechartsLineChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis 
              dataKey="day" 
              tick={{ fill: '#6B7280', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fill: '#6B7280', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1B4F72',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              labelFormatter={(label) => `Data: ${label}`}
              formatter={(value) => [`${value}% Segura`, 'Deglutição']}
            />
            <Line
              type="monotone"
              dataKey="safetyIndex"
              name="Índice de Deglutição Segura"
              stroke="#1B4F72" // azul petróleo
              strokeWidth={3}
              dot={{ fill: '#5DCAA5', stroke: '#1B4F72', strokeWidth: 2, r: 5 }} // pontos teal
              activeDot={{ r: 7, strokeWidth: 1 }}
              isAnimationActive={true}
              animationDuration={1500}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChart;
