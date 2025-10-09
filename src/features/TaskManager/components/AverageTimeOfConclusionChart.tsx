"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// Formata data de "2025-01-15" para "15/01"
const formatDateForChart = (dateStr: string) => {
  const [, month, day] = dateStr.split('-');
  return `${day}/${month}`;
};

export default function AverageTimeOfConclusionChart({ 
    data, 
    title 
}: { 
    data: { date: string; averageTime: number }[], 
    title?: string
}) {
    // Formata os dados para exibição
    const formattedData = data.map(point => ({
        ...point,
        dateFormatted: formatDateForChart(point.date),
        originalDate: point.date
    }));

    return (
        <div className="w-full h-64 sm:h-72 md:h-80 lg:h-96">
            <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold mb-3 sm:mb-4 mt-2 sm:mt-3 md:mt-4">
                {title ?? "Tempo médio de conclusão das tarefas"}
            </h2>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis 
                        dataKey="dateFormatted"
                        tick={{ fontSize: 10, fill: '#666' }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                    />
                    <YAxis 
                        allowDecimals={true}
                        tick={{ fontSize: 10, fill: '#666' }}
                        label={{ 
                            value: 'Dias', 
                            angle: -90, 
                            position: 'insideLeft',
                            style: { fontSize: 11, fill: '#666' }
                        }}
                    />
                    <Tooltip 
                        contentStyle={{ fontSize: '12px' }}
                        formatter={(value) => [`${Number(value).toFixed(1)} dias`, 'Tempo médio']}
                        labelFormatter={(_, payload) => `Data: ${payload?.[0]?.payload?.originalDate || ''}`}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="averageTime" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}