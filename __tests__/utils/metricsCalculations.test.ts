import { 
    calculateCompletedPerDay, 
    calculateAverageTimeOfConclusion,
    type TaskForMetrics 
} from "utils/metricsCalculations";

describe("metricsCalculations", () => {
    describe("calculateCompletedPerDay", () => {
        it("calcula tarefas concluídas por dia corretamente", () => {
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            
            const tasks: TaskForMetrics[] = [
                {
                    completedAt: today,
                    createdAt: yesterday
                },
                {
                    completedAt: today,
                    createdAt: yesterday
                },
                {
                    completedAt: yesterday,
                    createdAt: yesterday
                }
            ];

            const result = calculateCompletedPerDay(tasks, 3);
            
            // Encontra os dias específicos no resultado
            const todayStr = today.toISOString().slice(0, 10);
            const yesterdayStr = yesterday.toISOString().slice(0, 10);
            
            const todayResult = result.find(r => r.date === todayStr);
            const yesterdayResult = result.find(r => r.date === yesterdayStr);
            
            expect(todayResult?.count).toBe(2);
            expect(yesterdayResult?.count).toBe(1);
            expect(result).toHaveLength(3); // 3 dias de dados
        });

        it("retorna zero para dias sem tarefas concluídas", () => {
            const tasks: TaskForMetrics[] = [
                {
                    completedAt: null, // Tarefa não concluída
                    createdAt: new Date("2025-01-01T10:00:00Z")
                }
            ];

            const result = calculateCompletedPerDay(tasks, 2);
            
            // Todos os dias devem ter count = 0
            expect(result.every(r => r.count === 0)).toBe(true);
        });
    });

    describe("calculateAverageTimeOfConclusion", () => {
        it("calcula tempo médio de conclusão corretamente", () => {
            const today = new Date();
            const twoDaysAgo = new Date(today);
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
            
            const tasks: TaskForMetrics[] = [
                {
                    createdAt: twoDaysAgo,
                    completedAt: today // 2 dias
                }
            ];

            const result = calculateAverageTimeOfConclusion(tasks, 3);
            
            // Encontra o dia de hoje
            const todayStr = today.toISOString().slice(0, 10);
            const todayResult = result.find(r => r.date === todayStr);
            
            expect(todayResult?.averageTime).toBe(2); // 2 dias
        });

        it("retorna zero quando não há tarefas concluídas", () => {
            const tasks: TaskForMetrics[] = [
                {
                    createdAt: new Date("2025-01-01T10:00:00Z"),
                    completedAt: null // Não concluída
                }
            ];

            const result = calculateAverageTimeOfConclusion(tasks, 2);
            
            // Todos os dias devem ter averageTime = 0
            expect(result.every(r => r.averageTime === 0)).toBe(true);
        });

        it("calcula média correta quando múltiplas tarefas são concluídas no mesmo dia", () => {
            const today = new Date();
            const oneDayAgo = new Date(today);
            oneDayAgo.setDate(oneDayAgo.getDate() - 1);
            
            const tasks: TaskForMetrics[] = [
                {
                    createdAt: oneDayAgo,
                    completedAt: today // 1 dia
                },
                {
                    createdAt: oneDayAgo,
                    completedAt: today // 1 dia
                }
            ];

            const result = calculateAverageTimeOfConclusion(tasks, 3);
            
            const todayStr = today.toISOString().slice(0, 10);
            const todayResult = result.find(r => r.date === todayStr);
            expect(todayResult?.averageTime).toBe(1); // (1+1)/2 = 1 dia
        });
    });
});
