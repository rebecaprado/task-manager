"use client";

import React from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import { Card, CardContent } from "ui/card";
import { Badge } from "ui/badge";
import { Button } from "ui/button";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { trackTaskEvent } from "@/_shared/utils/analytics";
import { posthog } from "@/Config/posthog";
import { formatDate } from "utils/utils";

// Types
export type TaskStatus = "A_FAZER" | "EM_ANDAMENTO" | "CONCLUIDO";

export type Task = {
  id: string;
  userId: string;
  title: string;
  content: string;
  priority: "BAIXA" | "MEDIA" | "ALTA";
  status: TaskStatus;
  dueDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date | null;
};

const STATUS_COLUMNS: Array<{ id: TaskStatus; label: string }> = [
  { id: "A_FAZER", label: "A Fazer" },
  { id: "EM_ANDAMENTO", label: "Em andamento" },
  { id: "CONCLUIDO", label: "Concluído" },
];

// Props
export interface KanbanBoardProps {
  tasks: Task[];
  onMove?: (taskId: string, newStatus: TaskStatus) => Promise<void> | void;
  onCreateTaskInStatus?: (status: TaskStatus) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => Promise<void> | void;
}

// KanbanBoard
export default function KanbanBoard({
  tasks,
  onMove,
  onCreateTaskInStatus,
  onEditTask,
  onDeleteTask,
}: KanbanBoardProps) {

  const [mounted, setMounted] = React.useState(false);
  const [local, setLocal] = React.useState<Task[]>(tasks);
  const [activeTaskId, setActiveTaskId] = React.useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );
  
  const activeTask = React.useMemo(
    () => local.find((t) => t.id === activeTaskId) || null,
    [local, activeTaskId]
  );

  React.useEffect(() => setMounted(true), []);
  React.useEffect(() => setLocal(tasks), [tasks]);

  if (!mounted) return null;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTaskId(null);
    if (!over) return;

    const targetColumnId = over.id as TaskStatus | string;
    if (!isStatus(targetColumnId)) return;

    const taskId = String(active.id);
    const prev = local;

    const current = prev.find((t) => t.id === taskId);
    if (!current || current.status === targetColumnId) return;

    const updated = prev.map((t) =>
      t.id === taskId ? { ...t, status: targetColumnId } : t
    );
    setLocal(updated);

    // Track completion event
    if (targetColumnId === "CONCLUIDO") {
      const task = prev.find(t => t.id === taskId);
      if (task) {
        trackTaskEvent("task_completed", { 
          task_id: taskId, 
          priority: task.priority,
          time_to_complete: task.createdAt ? Date.now() - new Date(task.createdAt).getTime() : undefined
        });
      }
    }

    Promise.resolve(onMove?.(taskId, targetColumnId)).catch(() =>
      setLocal(prev)
    );

    posthog.capture("kanban_drag", {
      from_status: current.status,
      to_status: targetColumnId,
      task_id: taskId,
    });
  }

  async function handleDelete(id: string) {
    console.log("[KanbanBoard] delete click", id);
    const prev = local;
    setLocal(prev.filter(t => t.id !== id));            // otimista
    try {
      await onDeleteTask?.(id);                          // chama pai
      console.log("[KanbanBoard] delete ok", id);
    } catch (e) {
      console.error("[KanbanBoard] delete failed, rollback", e);
      setLocal(prev);
    }
  }

  return (
    <div className="w-full overflow-x-auto pb-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={(e) => setActiveTaskId(String(e.active.id))}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:min-w-[960px]">
          {STATUS_COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              label={col.label}
              tasks={local.filter((t) => t.status === col.id)}
              onCreate={() => onCreateTaskInStatus?.(col.id)}
              onEditTask={onEditTask}
              onDeleteTask={handleDelete}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <TaskCard task={activeTask} dragging />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

// Columns
function KanbanColumn({
  id,
  label,
  tasks,
  onCreate,
  onEditTask,
  onDeleteTask,
}: {
  id: TaskStatus;
  label: string;
  tasks: Task[];
  onCreate?: () => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void | Promise<void>;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const getColumnColor = (status: TaskStatus) => {
    switch (status) {
      case "A_FAZER":
        return "bg-red-100 border-red-200";
      case "EM_ANDAMENTO":
        return "bg-yellow-100 border-yellow-200";
      case "CONCLUIDO":
        return "bg-green-100 border-green-200";
      default:
        return "bg-muted/40";
    }
  };

  {tasks.map((t) => (
    <DraggableTask key={t.id} task={t} onEdit={onEditTask} onDelete={onDeleteTask} />
  ))}

  return (
    <div className={`flex flex-col rounded-xl sm:rounded-2xl border ${getColumnColor(id)}`}>
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Badge variant="secondary" className="rounded-full text-xs sm:text-sm h-5 sm:h-6 px-2">
            {tasks.length}
          </Badge>
          <h3 className="text-xs sm:text-sm font-semibold tracking-tight">{label}</h3>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={onCreate}
          aria-label={`Criar em ${label}`}
          className="h-7 w-7 sm:h-8 sm:w-8"
        >
          <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>
      </div>

      <div
        ref={setNodeRef}
        className={`min-h-[200px] sm:min-h-[250px] md:min-h-[300px] flex flex-col gap-2 sm:gap-3 p-2 sm:p-3 transition-colors ${
          isOver ? "bg-accent/40" : "bg-transparent"
        }`}
      >
        {tasks.map((t) => (
          <DraggableTask key={t.id} task={t} onEdit={onEditTask} onDelete={onDeleteTask} />
        ))}
        {tasks.length === 0 && (
          <div className="text-[10px] sm:text-xs text-muted-foreground px-2 py-3 sm:py-4 text-center select-none">
            Arraste tarefas para cá
          </div>
        )}
      </div>
    </div>
  );
}

// DraggableTask
function DraggableTask({ task, onEdit, onDelete }: { task: Task; onEdit?: (task: Task) => void; onDelete?: (taskId: string) => void | Promise<void> }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id });
  const style: React.CSSProperties = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : {};

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <TaskCard task={task} dragging={isDragging} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}

// TaskCard
function TaskCard({ task, dragging, onEdit, onDelete }: {
  task: Task; dragging?: boolean; onEdit?: (task: Task) => void; onDelete?: (id: string) => void | Promise<void>;
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(task);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // não interferir no drag/click do card
    console.log("[TaskCard] delete", task.id);
    await onDelete?.(task.id);
  };

  return (
    <Card
      className={`relative border bg-background bg-stone-100 cursor-pointer hover:shadow-md transition-shadow ${dragging ? "opacity-80 ring-2 ring-primary/40" : ""}`}
      onClick={handleClick}
    >
      <CardContent className="p-2 sm:p-3">
        <button
          type="button"
          onClick={handleDelete}
          className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 rounded-md p-1 sm:p-1.5 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Excluir tarefa"
        >
          <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
        </button>

        <div className="flex items-start gap-1.5 sm:gap-2">
          <GripVertical className="mt-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-muted-foreground" />
          <div className="flex-1 min-w-0">
            <div className="text-xs sm:text-sm font-medium truncate pr-6">{task.title}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2 mt-0.5">
              {task.content}
            </p>
            <div className="mt-1.5 sm:mt-2 flex flex-wrap items-center gap-1 sm:gap-2">
              <PriorityPill priority={task.priority} />
              {task.dueDate && (
                <span className="text-[9px] sm:text-[10px] text-muted-foreground">
                  {formatDate(task.dueDate)}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// PriorityPill
function PriorityPill({ priority }: { priority: Task["priority"] }) {
  const label =
    priority === "ALTA"
      ? "Alta"
      : priority === "MEDIA"
      ? "Média"
      : "Baixa";
  const cls =
    priority === "ALTA"
      ? "bg-red-500/10 text-red-600"
      : priority === "MEDIA"
      ? "bg-amber-500/10 text-amber-600"
      : "bg-emerald-500/10 text-emerald-600";
  return (
    <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-medium ${cls}`}>
      {label}
    </span>
  );
}

// Helper
function isStatus(value: string): value is TaskStatus {
  return value === "A_FAZER" || value === "EM_ANDAMENTO" || value === "CONCLUIDO";
}