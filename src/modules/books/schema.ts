import z from "zod";

export const CreateBookSchema = z.object({
  title: z.string().min(3),
  author: z.string().min(3),
});

export const UpdateBookSchema = z.object({
  title: z.string().min(3).optional(),
  author: z.string().min(3).optional(),
});
