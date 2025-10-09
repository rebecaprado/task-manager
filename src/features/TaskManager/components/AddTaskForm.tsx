"use client";

import { 
    Form, 
    FormControl,
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage,
} from "ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "ui/select";
import { Input } from "ui/input";
import { Button } from "ui/button";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskFormSchema, TaskForm } from "schemas/taskSchema";
import { addTask, updateTask } from "taskmanager/actions/$task_actions";
import { toast } from "sonner";
import { Textarea} from "ui/textarea";
import { useAuthStore } from "authstore/authStore";
import { TaskStatus } from "./KanbanBoard";
import { User } from "schemas/userSchema";

interface AddTaskFormProps {
    defaultStatus?: TaskStatus;
    user: User;
    onSuccess?: () => void;
    fixedStatus?: boolean;
    initialData?: {
        id?: string;
        title?: string;
        content?: string;
        priority?: "BAIXA" | "MEDIA" | "ALTA";
        status?: TaskStatus;
        dueDate?: Date | null;
    };
  }

export default function AddTaskForm({ defaultStatus, user, onSuccess, fixedStatus = false, initialData }: AddTaskFormProps) {
    const userFromStore = useAuthStore((state) => state.user);
    const currentUser = user || userFromStore;
    
    const form = useForm<TaskForm>({
        resolver: zodResolver(taskFormSchema),
        defaultValues: {
            title: initialData?.title || "",
            content: initialData?.content || "",
            priority: initialData?.priority || "MEDIA",
            status: initialData?.status || defaultStatus || "A_FAZER",
            dueDate: initialData?.dueDate || new Date(),
        },
    });

    async function onSubmit(data: TaskForm) {
        if (!currentUser) {
            console.log("Usuário não encontrado");
            return;
        }
        
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("content", data.content);
        formData.append("priority", data.priority);
        formData.append("status", data.status);
        if (data.dueDate) {
            formData.append("dueDate", data.dueDate.toISOString());
        }
        
        let result;
        
        if (initialData?.id) {
            result = await updateTask(initialData.id, formData);
        } else {
            result = await addTask(formData, defaultStatus);
        }

        if (result.success === false) {
            toast.error(result.message);
        } else {
            toast.success(result.message);
            form.reset();
            onSuccess?.();

            if (!onSuccess) {
                window.location.href = '/dashboard/tasks';
            }
        }
    }

    return (
        <Form {...form}>
            <form method="POST" onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4 md:space-y-5 px-2 sm:px-0">
                <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-center sm:text-left">
                    {initialData?.id ? "Editar tarefa" : "Adicionar nova tarefa"}
                </h1>
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel className="text-sm sm:text-base">Título da tarefa</FormLabel>
                            <FormControl>
                                <Input className="border-zinc-300 border text-sm sm:text-base h-10 sm:h-11" placeholder="Título" {...field} />
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs sm:text-sm"/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel className="text-sm sm:text-base">Descrição da tarefa</FormLabel>
                            <FormControl>
                                <Textarea className="border-zinc-300 border text-sm sm:text-base min-h-[80px] sm:min-h-[100px]" placeholder="Descrição" {...field} />
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs sm:text-sm"/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm sm:text-base">Prioridade</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="border-zinc-300 border">
                                        <SelectValue placeholder="Selecione a prioridade" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-stone-100">
                                        <SelectItem value="BAIXA" className="text-sm sm:text-base">Baixa</SelectItem>
                                        <SelectItem value="MEDIA" className="text-sm sm:text-base">Média</SelectItem>
                                        <SelectItem value="ALTA" className="text-sm sm:text-base">Alta</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs sm:text-sm"/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm sm:text-base">Status</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={fixedStatus}>
                                    <SelectTrigger className="border-zinc-300 border text-sm sm:text-base h-10 sm:h-11">
                                        <SelectValue placeholder="Selecione o status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-stone-100">
                                        <SelectItem value="A_FAZER" className="text-sm sm:text-base">A fazer</SelectItem>
                                        <SelectItem value="EM_ANDAMENTO" className="text-sm sm:text-base">Em andamento</SelectItem>
                                        <SelectItem value="CONCLUIDO" className="text-sm sm:text-base">Concluído</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs sm:text-sm"/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm sm:text-base">Data de entrega</FormLabel>
                            <FormControl>
                                <Input 
                                    className="border-zinc-300 border text-sm sm:text-base h-10 sm:h-11" 
                                    type="date" 
                                    {...field}
                                    value={field.value ? field.value.toISOString().slice(0, 10) : ''}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        field.onChange(value ? new Date(value) : undefined);
                                    }}
                                />
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs sm:text-sm"/>
                        </FormItem>
                    )}
                />
                <div className="flex justify-center pt-2 sm:pt-3">
                    <Button type="submit" disabled={form.formState.isSubmitting} className="w-full sm:w-auto bg-black text-white hover:bg-green-500 hover:text-black text-sm sm:text-base h-10 sm:h-11 px-6 sm:px-8">
                        {form.formState.isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                                Criando tarefa...
                            </>
                        ) : (
                            <>
                                {initialData?.id ? "Salvar alterações" : "Criar tarefa"}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}