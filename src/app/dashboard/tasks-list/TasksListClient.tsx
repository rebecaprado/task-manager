"use client";

import { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Task } from "taskmanager/components/KanbanBoard";

interface TasksListClientProps {
  initialData: Task[];
}

export default function TasksListClient({ initialData }: TasksListClientProps) {
  const [tasks, setTasks] = useState<Task[]>(initialData);

  const handleTaskUpdate = async () => {
    try {
      const response = await fetch('/api/tasks');
      if (response.ok) {
        const updatedTasks = await response.json();
        setTasks(updatedTasks);
      }
    } catch (error) {
      console.error('Erro ao atualizar lista:', error);
      window.location.reload();
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      if (res.ok) {
        setTasks(prev => prev.filter(t => t.id !== taskId));
      } else {
        console.error("Erro ao excluir:", await res.json());
      }
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-5">
      <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">Lista de Tarefas</h1>
      <div className="overflow-x-auto">
        <DataTable 
          columns={columns} 
          data={tasks} 
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
        />
      </div>
    </div>
  );
}
