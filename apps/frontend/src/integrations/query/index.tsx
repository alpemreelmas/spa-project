import type { CreateFormData } from "#/schemas/createFormData";
import { QueryClient } from "@tanstack/react-query";

const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

export const queryClient = new QueryClient();

const baseFetch = async (endpoint: string, options?: RequestInit) => {
  const res = await fetch(`${apiUrl}/api/v1/${endpoint}`, options);
  const data = await res.json();
  return data;
}

const getContacts = async () => baseFetch("contacts")

export const contactsQuery = {
  queryKey: ["contacts"],
  queryFn: getContacts,
}

export const createContactMutation = {
  mutationFn: async (contact: CreateFormData) => {
    const res = await baseFetch("contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    body: JSON.stringify(contact),
  });

    return res;
  },
  mutationSuccess: () => {
    queryClient.invalidateQueries({ queryKey: contactsQuery.queryKey });
    
  }
}