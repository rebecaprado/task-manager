import { taskFormSchema } from "schemas/taskSchema";

describe("taskFormSchema - invalid status", () => {
    it("retorna erro quando status é inválido", () => {
        const result = taskFormSchema.safeParse({
            title: "Teste",
            content: "Qualquer conteúdo",
            priority: "MEDIA",
            status: "INVALIDO",
            dueDate: new Date()
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.errors[0].message).toContain("Invalid enum value");
            expect(result.error.errors[0].path).toEqual(["status"]);
        }
    })
})
