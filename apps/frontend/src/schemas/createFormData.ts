import { z } from "zod";

const NUMBER_MSG = "Please write valid phone number";

export const CreateFormSchema = z.object({
  name: z.string().min(1, "Too short"),
  email: z.email(),
  phone: z.number().min(1, NUMBER_MSG).max(9999999999, NUMBER_MSG),
  note: z.string().trim().optional(),
});

export type CreateFormData = z.infer<typeof CreateFormSchema>