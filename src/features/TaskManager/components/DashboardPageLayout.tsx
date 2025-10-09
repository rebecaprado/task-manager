import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CompletedPerDayChart from "./CompletedPerDayChart";
import AverageTimeOfConclusionChart from "./AverageTimeOfConclusionChart";
import { 
    calculateCompletedPerDay, 
    calculateAverageTimeOfConclusion,
    type TaskForMetrics 
} from "utils/metricsCalculations";

async function getTasksCompletedPerDay(userId: string, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const tasks = await prisma.task.findMany({
        where: {
            userId,
            status: "CONCLUIDO",
            completedAt: {
                gte: startDate
            }
        },
        select: {
            completedAt: true,
            createdAt: true
        }
    });

    return calculateCompletedPerDay(tasks as TaskForMetrics[], days);
}

async function getAverageTimeOfConclusion(userId: string, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const tasks = await prisma.task.findMany({
        where: {
            userId,
            status: "CONCLUIDO",
            completedAt: {
                gte: startDate,
                not: null
            }
        },
        select: {
            completedAt: true,
            createdAt: true
        }
    });

    return calculateAverageTimeOfConclusion(tasks as TaskForMetrics[], days);
}

export default async function DashboardPageLayout() {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const data = await getTasksCompletedPerDay(userId, 30);
    const averageTimeOfConclusion = await getAverageTimeOfConclusion(userId);

    return (
        <main className="p-3 sm:p-4 md:p-6">
            <div className="mb-4 sm:mb-6">
                <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">Métricas de produtividade</h1>
            </div>
            <div className="space-y-6 sm:space-y-8 md:space-y-10">
                <CompletedPerDayChart data={data} title="Tarefas concluídas por dia" />
                <AverageTimeOfConclusionChart data={averageTimeOfConclusion} title="Tempo médio de conclusão das tarefas" />
            </div>
      </main>
    );
}