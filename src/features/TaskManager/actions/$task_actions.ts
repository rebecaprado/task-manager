"use server";

import { taskFormSchema } from "schemas/taskSchema";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

type TaskStatus = "A_FAZER" | "EM_ANDAMENTO" | "CONCLUIDO";
type TaskPriority = "BAIXA" | "MEDIA" | "ALTA";

export const addTask = async (formData: FormData, initialStatus?: TaskStatus) => {

    // Get user id
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) throw new Error("Unauthorized");
    const userId = session.user.id;

    try {
        const rawData = {
            title: formData.get("title") as string,
            content: formData.get("content") as string,
            priority: formData.get("priority") as TaskPriority,
            status: (formData.get("status") as TaskStatus) ?? initialStatus ?? "A_FAZER",
            dueDate: formData.get("dueDate")
                ? new Date(String(formData.get("dueDate")))
                : null,
        };

        const data = taskFormSchema.parse(rawData);

        const task = await prisma.task.create({
            data: {
              title: data.title,
              content: data.content,
              priority: data.priority,
              status: initialStatus ?? data.status,
              dueDate: data.dueDate,
              userId,
            },
          });

          revalidatePath("/dashboard/tasks");

          return { success: true, message: "Tarefa criada com sucesso", task };
    } catch (error) {
        console.error("Erro ao criar tarefa:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Erro ao criar tarefa",
            task: null
        };
    }
}

export async function handleMove(taskId: string, newStatus: TaskStatus): Promise<void> {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) throw new Error("Unauthorized");
    const userId = session.user.id;
  
    const completedAt = newStatus === "CONCLUIDO" ? new Date() : null;
  
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId },
      select: { createdAt: true, priority: true },
    });
    if (!task) throw new Error("Task not found");
  
    await prisma.task.updateMany({
      where: { id: taskId, userId },
      data: { status: newStatus, completedAt },
    });
}

export const updateTask = async (taskId: string, formData: FormData) => {
    "use server";

    // Get user id
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) throw new Error("Unauthorized");
    const userId = session.user.id;

    // PostHog tracking movido para frontend

    try {
        const rawData = {
            title: formData.get("title") as string,
            content: formData.get("content") as string,
            priority: formData.get("priority") as TaskPriority,
            status: formData.get("status") as TaskStatus,
            dueDate: formData.get("dueDate")
                ? new Date(String(formData.get("dueDate")))
                : null,
        };

        const data = taskFormSchema.parse(rawData);

        await prisma.task.updateMany({
            where: { id: taskId, userId },
            data: {
                title: data.title,
                content: data.content,
                priority: data.priority,
                status: data.status,
                dueDate: data.dueDate,
                updatedAt: new Date(),
            }
        });

        revalidatePath('/dashboard/tasks');
        revalidatePath('/dashboard/tasks-list');

        return {
            success: true,
            message: "Tarefa atualizada com sucesso",
        };

    } catch (error) {
        console.error("Erro ao atualizar tarefa:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Erro ao atualizar tarefa",
        };
    }
}

export const deleteTask = async (taskId: string) => {
    "use server";
  
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) throw new Error("Unauthorized");
    const userId = session.user.id;
  
    try {
      const { count } = await prisma.task.deleteMany({ where: { id: taskId, userId } });
      if (count === 0) throw new Error("Task not found");
  
      revalidatePath("/dashboard/tasks");
      revalidatePath("/dashboard/tasks-list");
  
      return { success: true, message: "Tarefa excluída com sucesso" };
    } catch (err) {
      console.error("deleteTask error:", err);
      return { success: false, message: err instanceof Error ? err.message : "Erro ao excluir tarefa" };
    }
  };
