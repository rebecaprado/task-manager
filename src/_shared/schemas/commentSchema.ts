import { z } from "zod";

export const commentSchema = z.object({
    comment_content: z.string().min(1, "Campo obrigatório"),
});