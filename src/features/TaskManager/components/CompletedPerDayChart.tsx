"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type Point = { date: string; count: number };

// Formata data de "2025-01-15" para "15/01"
const formatDateForChart = (dateStr: string) => {
  const [, month, day] = dateStr.split('-');
  return `${day}/${month}`;
};

export default function CompletedPerDayChart({ data, title }: { data: Point[]; title?: string }) {
  // Formata os dados para exibição
  const formattedData = data.map(point => ({
    ...point,
    dateFormatted: formatDateForChart(point.date),
    originalDate: point.date
  }));

  return (
    <div className="w-full h-64 sm:h-72 md:h-80 lg:h-96">
      <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold mb-3 sm:mb-4 mt-2 sm:mt-3 md:mt-4">
        {title ?? "Tarefas concluídas por dia"}
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="dateFormatted" 
            tick={{ fontSize: 10, fill: '#666' }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            allowDecimals={false} 
            tick={{ fontSize: 10, fill: '#666' }}
          />
          <Tooltip 
            contentStyle={{ fontSize: '12px' }}
            labelFormatter={(_, payload) => payload?.[0]?.payload?.originalDate || ''}
            formatter={(value) => [`${value} tarefas`, 'Concluídas']}
          />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#22c55e" 
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}