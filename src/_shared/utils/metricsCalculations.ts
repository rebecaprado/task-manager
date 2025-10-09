// Funções puras para cálculos de métricas (sem Prisma)

export interface TaskForMetrics {
  completedAt: Date | null;
  createdAt: Date;
}

export interface CompletedPerDayData {
  date: string;
  count: number;
}

export interface AverageTimeData {
  date: string;
  averageTime: number;
}

/**
 * Calcula quantas tarefas foram concluídas por dia nos últimos N dias
 */
export function calculateCompletedPerDay(
  tasks: TaskForMetrics[], 
  days = 30
): CompletedPerDayData[] {
  const counts: Record<string, number> = {};
  
  // Inicializa contadores para todos os dias
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().slice(0, 10);
    counts[dateStr] = 0;
  }

  // Conta tarefas concluídas por dia
  tasks.forEach(task => {
    if (task.completedAt) {
      const dateStr = task.completedAt.toISOString().slice(0, 10);
      if (counts[dateStr] !== undefined) {
        counts[dateStr]++;
      }
    }
  });

  return Object.entries(counts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Calcula o tempo médio de conclusão das tarefas por dia nos últimos N dias
 */
export function calculateAverageTimeOfConclusion(
  tasks: TaskForMetrics[], 
  days = 30
): AverageTimeData[] {
  const dailyData: Record<string, { totalTime: number; count: number }> = {};
  
  // Inicializa dados para todos os dias
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().slice(0, 10);
    dailyData[dateStr] = { totalTime: 0, count: 0 };
  }

  // Calcula tempo de conclusão para cada tarefa
  tasks.forEach(task => {
    if (task.completedAt && task.createdAt) {
      const dateStr = task.completedAt.toISOString().slice(0, 10);
      if (dailyData[dateStr]) {
        const timeToComplete = task.completedAt.getTime() - task.createdAt.getTime();
        const timeInDays = timeToComplete / (1000 * 60 * 60 * 24); // Converter para dias
        
        dailyData[dateStr].totalTime += timeInDays;
        dailyData[dateStr].count += 1;
      }
    }
  });

  return Object.entries(dailyData)
    .map(([date, data]) => ({
      date,
      averageTime: data.count > 0 ? Number((data.totalTime / data.count).toFixed(1)) : 0
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
