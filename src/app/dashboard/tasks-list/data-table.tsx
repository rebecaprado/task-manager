"use client"
 
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table"
import { useState } from "react"
 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "ui/table"
import { Button } from "ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "ui/select"
import { Input } from "ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "ui/form"
import { Textarea } from "ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Task } from "taskmanager/components/KanbanBoard"
import { taskFormSchema, TaskForm } from "schemas/taskSchema"
import { updateTask } from "taskmanager/actions/$task_actions"
import { trackTaskEvent } from "@/_shared/utils/analytics"
 
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onTaskUpdate?: () => void
  onTaskDelete?: (taskId: string) => void
}
 
export function DataTable<TData, TValue>({
  columns,
  data,
  onTaskUpdate,
  onTaskDelete,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  const form = useForm<TaskForm>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      content: "",
      priority: "MEDIA",
      status: "A_FAZER",
      dueDate: undefined,
    },
  })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
    },
    meta: {
        onTaskDelete,
    },
  })

  const handleRowClick = (task: Task) => {
    const taskData = task
    setSelectedTask(taskData)
    
    form.reset({
      title: taskData.title,
      content: taskData.content,
      priority: taskData.priority,
      status: taskData.status,
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
    })
    
    setIsEditModalOpen(true)
  }

  const closeModal = () => {
    setIsEditModalOpen(false)
    setSelectedTask(null)
    form.reset()
  }

  const onSubmit = async (data: TaskForm) => {
    if (!selectedTask) return
    
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("priority", data.priority);
      formData.append("status", data.status);
      if (data.dueDate) {
        formData.append("dueDate", data.dueDate.toISOString());
      }
      
    const result = await updateTask(selectedTask.id, formData);

    if (result.success) {
      // Track completion event
      if (data.status === "CONCLUIDO" && selectedTask.status !== "CONCLUIDO") {
        trackTaskEvent("task_completed", { 
          task_id: selectedTask.id, 
          priority: data.priority,
          time_to_complete: selectedTask.createdAt ? Date.now() - new Date(selectedTask.createdAt).getTime() : undefined
        });
      }
      
      toast.success(result.message); 
      closeModal();
      onTaskUpdate?.(); 
    } else {
      toast.error(result.message);
    }
    } catch {
      toast.error("Erro ao atualizar tarefa");
    }
  }
 
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-sm sm:text-md md:text-lg font-bold">Minhas Tarefas</h1>
        <Link href="/dashboard/add-task">
          <Button className="flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600">
            <Plus className="w-4 h-4 text-white" />
            Nova Tarefa
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium">Status</label>
          <Select
            value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
            onValueChange={(value) =>
              table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent className="bg-stone-100">
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="A_FAZER">A Fazer</SelectItem>
              <SelectItem value="EM_ANDAMENTO">Em andamento</SelectItem>
              <SelectItem value="CONCLUIDO">Concluído</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium">Prioridade</label>
          <Select
            value={(table.getColumn("priority")?.getFilterValue() as string) ?? ""}
            onValueChange={(value) =>
              table.getColumn("priority")?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent className="bg-stone-100">
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="BAIXA">Baixa</SelectItem>
              <SelectItem value="MEDIA">Média</SelectItem>
              <SelectItem value="ALTA">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium">Data de Entrega</label>
          <Input
            type="date"
            className="w-40 bg-stone-100"
            value={(table.getColumn("dueDate")?.getFilterValue() as string) ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              table.getColumn("dueDate")?.setFilterValue(value || "");
            }}
          />
        </div>

        <div className="flex flex-col justify-end">
          <Button
            variant="outline"
            onClick={() => table.resetColumnFilters()}
            className="h-9"
          >
            Limpar Filtros
          </Button>
        </div>
      </div>
      
      <div className="overflow-hidden">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleRowClick(row.original as Task)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>

        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="max-w-lg bg-stone-100">
            <DialogHeader>
                <DialogTitle>Editar Tarefa</DialogTitle>
            </DialogHeader>
            {selectedTask && (
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    
                    <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                            <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    
                    <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Prioridade</FormLabel>
                        <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-stone-100">
                                <SelectItem value="BAIXA">Baixa</SelectItem>
                                <SelectItem value="MEDIA">Média</SelectItem>
                                <SelectItem value="ALTA">Alta</SelectItem>
                            </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    
                    <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-stone-100">
                                <SelectItem value="A_FAZER">A Fazer</SelectItem>
                                <SelectItem value="EM_ANDAMENTO">Em andamento</SelectItem>
                                <SelectItem value="CONCLUIDO">Concluído</SelectItem>
                            </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    
                    <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Data de Entrega</FormLabel>
                        <FormControl>
                            <Input
                            type="date"
                            {...field}
                            value={field.value ? field.value.toISOString().slice(0, 10) : ''}
                            onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(value ? new Date(value) : undefined);
                            }}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    
                    <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={closeModal}>
                        Cancelar
                    </Button>
                    <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600">
                        Salvar Alterações
                    </Button>
                    </div>
                </form>
                </Form>
            )}
            </DialogContent>
        </Dialog>
    </div>
  )
}