import { z } from "zod";

export const taskFormSchema = z.object({
    title: z.string().min(1, "Campo obrigatório"),
    content: z.string().min(1, "Campo obrigatório"),
    priority: z.enum(["BAIXA", "MEDIA", "ALTA"]),
    status: z.enum(["A_FAZER", "EM_ANDAMENTO", "CONCLUIDO"]),
    dueDate: z.coerce.date().refine(
        (date) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Zera a hora para comparar só a data
            const selectedDate = new Date(date);
            selectedDate.setHours(0, 0, 0, 0);
            return selectedDate >= today;
        },
        { message: "Data não pode ser no passado" }
      ).optional(),
});

export type TaskForm = z.infer<typeof taskFormSchema>;