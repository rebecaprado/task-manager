import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Task } from "taskmanager/components/KanbanBoard";
import TasksListClient from "./TasksListClient";

async function getData(): Promise<Task[] | null> {
    // headers - dados da requisição HTTP que chegaram no servidor (cookie com dados da sessão/auth, tokens de auth, etc)
    const session = await auth.api.getSession({ headers: await headers()});
    if (!session?.user?.id) {
        return null;
    }
    const userId = session.user.id;

    const tasks = await prisma.task.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" }
    });

    return tasks;
  }

export default async function TasksListPage() {
    const data = await getData();

    if (!data) {
        return <div className="p-4">Você precisa estar logado.</div>;
    }
    if (data.length === 0) {
        return <div className="p-4">Você não tem nenhuma tarefa.</div>;
    }

    return <TasksListClient initialData={data} />;
}