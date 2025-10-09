"use client"
 
import { ColumnDef } from "@tanstack/react-table";
import { Task, TaskStatus } from "taskmanager/components/KanbanBoard";
import { Trash2 } from "lucide-react";
import { Button } from "ui/button";
import { formatDate } from "utils/utils";

type TaskPriority = "BAIXA" | "MEDIA" | "ALTA";
 
export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: () => <div className="text-center font-bold text-[10px] sm:text-xs md:text-sm">Título</div>,
    cell: ({ getValue }) => {
        const title = getValue() as string | null;
        if (!title) return <span className="text-gray-500 text-[10px] sm:text-xs">Sem título</span>;
        return <div className="text-center text-[10px] sm:text-xs md:text-sm truncate max-w-[80px] sm:max-w-[120px] md:max-w-none">{title}</div>
    }
  },
  {
    accessorKey: "content",
    header: () => <div className="text-center font-bold text-[10px] sm:text-xs md:text-sm">Descrição</div>,
    cell: ({ getValue }) => {
        const content = getValue() as string | null;
        if (!content) return <span className="text-gray-500 text-[10px] sm:text-xs">Sem descrição</span>;
        return <div className="text-center text-[10px] sm:text-xs md:text-sm truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">{content}</div>
    }
  },
  {
    accessorKey: "priority",
    header: () => <div className="text-center font-bold text-[10px] sm:text-xs md:text-sm">Prioridade</div>,
    cell: ({ getValue }) => {
        const priority = getValue() as TaskPriority | null;
        if (!priority) return <span className="text-gray-500 text-[10px] sm:text-xs">Sem prioridade</span>;

        const getPriorityText = (priority: TaskPriority) => {
            switch (priority) {
                case "BAIXA": return "Baixa";
                case "MEDIA": return "Média";
                case "ALTA": return "Alta";
                default: return "Sem status";
            }
        };

        return <div className="text-center text-[10px] sm:text-xs md:text-sm">{getPriorityText(priority)}</div>;
    }
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center font-bold text-[10px] sm:text-xs md:text-sm">Status</div>,
    cell: ({ getValue }) => {
        const status = getValue() as TaskStatus | null;
        if (!status) return <span className="text-gray-500 text-center text-[10px] sm:text-xs">Sem status</span>;
        
        const getStatusColor = (status: TaskStatus) => {
          switch (status) {
            case "A_FAZER":
              return "bg-red-100 text-red-800 border-red-200";
            case "EM_ANDAMENTO":
              return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "CONCLUIDO":
              return "bg-green-100 text-green-800 border-green-200";
            default:
              return "bg-gray-100 text-gray-800 border-gray-200";
          }
        };

        const getStatusText = (status: TaskStatus) => {
          switch (status) {
            case "A_FAZER": return "A Fazer";
            case "EM_ANDAMENTO": return "Em andamento";
            case "CONCLUIDO": return "Concluído";
            default: return "Sem status";
          }
        };

        return (
          <div className="flex justify-center">
            <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] md:text-xs font-medium border ${getStatusColor(status)}`}>
              {getStatusText(status)}
            </span>
          </div>
        );
    }
  },
  {
    accessorKey: "dueDate",
    header: () => <div className="text-center font-bold text-[10px] sm:text-xs md:text-sm">Data</div>,
    cell: ({ getValue }) => {
      const date = getValue() as Date | null;
      if (!date) return <span className="text-[10px] sm:text-xs">Sem data</span>;
      return <span className="text-[10px] sm:text-xs md:text-sm">{formatDate(date)}</span>;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center font-bold text-[10px] sm:text-xs md:text-sm">Ações</div>,
    cell: ({ row, table }) => {
      const task = row.original
      const onTaskDelete = (table.options.meta as { onTaskDelete?: (id: string) => void })?.onTaskDelete
      return (
        <div onClick={(e) => e.stopPropagation()} className="flex justify-center">
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              onTaskDelete?.(task.id)
            }}
            aria-label="Excluir"
            title="Excluir"
            className="h-7 w-7 sm:h-8 sm:w-8"
          >
            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500" />
          </Button>
        </div>
      )
    },
  }
]