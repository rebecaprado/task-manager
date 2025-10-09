// Isso é um server component - faz auth e busca de dados
// Delega server actions para arquivo separado
// Passa dados para o client component
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import TasksPageClient from "taskmanager/components/TasksPageClient";
import { handleMove } from "taskmanager/actions/$task_actions";

// ISR - Intervalo de revalidação (60 segundos)
export const revalidate = 60;

export default async function TasksPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
        return <div className="p-4">Você precisa estar logado.</div>;
  }
  const userId = session.user.id;
  const user = session.user;

  const tasks = await prisma.task.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

  return <TasksPageClient 
            tasks={tasks}
            user={{
                  ...user,
                  image: user.image ?? undefined
            }}
            onMoveAction={handleMove} 
      />;
}