import type { Contact } from "#/integrations/table/contact";

export const getLastWeekStats = (contacts: Contact[]) => {
	return contacts.filter((c: Contact) => {
		const createdAt = new Date(c.created_at);
		const oneWeekAgo = new Date();
		oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
		return createdAt >= oneWeekAgo;
	}).length;
};