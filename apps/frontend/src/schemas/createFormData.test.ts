import { describe, expect, it } from "vitest";
import { CreateFormSchema } from "./createFormData";

describe("CreateFormSchema", () => {
	it("accepts a valid contact payload", () => {
		const result = CreateFormSchema.safeParse({
			name: "Ada Lovelace",
			email: "ada@example.com",
			phone: 5011002000,
			note: "demo contact",
		});

		expect(result.success).toBe(true);
	});

	it("rejects invalid email and phone values", () => {
		const result = CreateFormSchema.safeParse({
			name: "Ada Lovelace",
			email: "not-an-email",
			phone: 0,
			note: "demo contact",
		});

		expect(result.success).toBe(false);
	});
});
