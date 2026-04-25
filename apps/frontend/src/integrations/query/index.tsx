import type { CreateFormData } from "#/schemas/createFormData";
import { QueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

export const queryClient = new QueryClient();

const baseFetch = async (endpoint: string, options?: RequestInit) => {
  const res = await fetch(`${apiUrl}/api/v1/${endpoint}`, options);
  const data = await res.json();
  if(!res.ok || data.error) {
    throw new Error(data.message || data.error || "An error occurred while fetching data.");
  }

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
    toast.success("Kişi başarıyla oluşturuldu!");
  }
}

const getSingleContact = async ( contactId: number ) => {
  return baseFetch(`contacts/${contactId}`);
}

export const contactsSingleQuery = (contactId: number) => ({
  queryKey: ["contacts", contactId],
  queryFn: () => getSingleContact(contactId),
  enabled: !!contactId,
});


export const updateContactMutation = {
  mutationFn: async (contact: CreateFormData & { id: number }) => {
    const res = await baseFetch(`contacts/${contact.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    body: JSON.stringify(contact),
  });

    return res;
  },
  mutationSuccess: () => {
    queryClient.invalidateQueries({ queryKey: contactsQuery.queryKey });
    toast.success("Kişi başarıyla güncellendi!");
  },

  mutationError: () => {
    toast.error("Kişi güncellenirken bir hata oluştu!");
  }
}


export const deleteContactMutation = {
  mutationFn: async (contactId: number) => {
    const res = await baseFetch(`contacts/${contactId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res;
  },
  mutationSuccess: () => {
    queryClient.invalidateQueries({ queryKey: contactsQuery.queryKey });
    toast.success("Kişi başarıyla silindi!");
  },
  mutationError: () => {
    toast.error("Kişi silinirken bir hata oluştu!");
  }
}
