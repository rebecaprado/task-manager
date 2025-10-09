import { taskFormSchema } from "schemas/taskSchema";

describe("taskFormSchema - empty title", () => {
  it("retorna erro quando título está vazio", () => {
    const result = taskFormSchema.safeParse({
      title: "",
      content: "algum conteúdo",
      priority: "MEDIA",
      status: "A_FAZER",
      dueDate: new Date(),
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe("Campo obrigatório");
      expect(result.error.errors[0].path).toEqual(["title"]);
    }
  });
});