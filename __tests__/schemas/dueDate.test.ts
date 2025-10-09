import { taskFormSchema } from "schemas/taskSchema";

describe("taskFormSchema - invalid dueDate", () => {
    it("retorna erro quando dueDate é uma data passada", () => {
        const result = taskFormSchema.safeParse({
            title: "Teste",
            content: "Qualquer conteúdo",
            priority: "MEDIA",
            status: "A_FAZER",
            dueDate: new Date(new Date().setDate(new Date().getDate() - 1))
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.errors[0].message).toContain("Data não pode ser no passado");
            expect(result.error.errors[0].path).toEqual(["dueDate"]);
        }
    })
})