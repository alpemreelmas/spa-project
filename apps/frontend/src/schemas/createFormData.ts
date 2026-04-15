import { z } from "zod";

const NUMBER_MSG = "Please write valid phone number";

export const CreateFormSchema = z.object({
  name: z.string().min(1, "Too short"),
  email: z.email(),
  phone: z.string()
    .regex(/^\d+$/, NUMBER_MSG),
  notes: z.string().trim().optional(),
});

export type CreateFormData = z.infer<typeof CreateFormSchema>