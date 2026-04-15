import { z } from "zod";

const NUMBER_MSG = "Please write valid phone number";

export const CreateFormSchema = z.object({
  name: z.string().min(1, "Too short"),
  email: z.string().email(),
  phone: z.coerce
    .number()
    .gte(100_00_000, NUMBER_MSG)
    .lte(999_99_999, NUMBER_MSG),
  notes: z.string().trim().optional(),
});
