import { describe, expect, it } from "vitest";
import type { Contact } from "#/integrations/table/contact";
import { getLastWeekStats } from "./stats";

const baseContact: Contact = {
	id: 1,
	name: "Ada Lovelace",
	email: "ada@example.com",
	phone: 5011002000,
	note: "",
	created_at: new Date().toISOString(),
	updated_at: new Date().toISOString(),
};

describe("getLastWeekStats", () => {
	it("counts contacts created during the last week", () => {
		const tenDaysAgo = new Date();
		tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

		const contacts: Contact[] = [
			baseContact,
			{
				...baseContact,
				id: 2,
				email: "old@example.com",
				created_at: tenDaysAgo.toISOString(),
			},
		];

		expect(getLastWeekStats(contacts)).toBe(1);
	});
});
