"use client";

import KanbanBoard, { TaskStatus, Task } from "./KanbanBoard";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "ui/dialog";
import AddTaskForm from "./AddTaskForm";
import { User } from "schemas/userSchema";

interface Props {
  tasks: Task[];
  user: User;
  onMoveAction: (taskId: string, newStatus: TaskStatus) => Promise<void>;
}

export default function TasksPageClient({ tasks, user, onMoveAction }: Props) {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalStatus, setModalStatus] = useState<TaskStatus>("A_FAZER");
    const [editTask, setEditTask] = useState<Task | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
  
    const handleEditTask = (task: Task) => {
      setEditTask(task);
      setEditModalOpen(true);
    };

    const handleDeleteTask = async (id: string) => {
      console.log("[Parent] DELETE /api/tasks/"+id);
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.text().catch(()=> "");
        console.error("[Parent] delete failed", res.status, err);
        throw new Error("Delete failed");
      }
    };
  
    return (
      <div className="space-y-3 sm:space-y-4 md:space-y-5">
        <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">Kanban Board - Minhas Tarefas</h1>
        <KanbanBoard
          tasks={tasks}
          onMove={onMoveAction}
          onCreateTaskInStatus={(status) => {
            setModalStatus(status);
            setModalOpen(true);
          }}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
        
        {/* Modal Criar Tarefa */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-2xl bg-stone-100">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
            </DialogHeader>
            <AddTaskForm 
              defaultStatus={modalStatus}
              user={user}
              onSuccess={() => setModalOpen(false)}
              fixedStatus={true}
            />
          </DialogContent>
        </Dialog>

        {/* Modal Editar Tarefa */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="max-w-2xl bg-stone-100">
            <DialogHeader>
              <DialogTitle>Editar Tarefa</DialogTitle>
            </DialogHeader>
            {editTask && (
              <AddTaskForm 
                defaultStatus={editTask.status}
                user={user}
                onSuccess={() => setEditModalOpen(false)}
                fixedStatus={false}
                initialData={editTask}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }