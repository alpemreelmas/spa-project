import { createColumnHelper } from "@tanstack/react-table";

export type Contact = {
  id: number;
  name: string;
  email: string;
  phone: number;
  note: string;
  created_at: string;
  updated_at: string;
};

const columnHelper = createColumnHelper<Contact>();

function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export const columns = [
  columnHelper.accessor("name", {
    header: "Name",
  }),
  columnHelper.accessor("email", {
    header: "Email",
  }),
  columnHelper.accessor("phone", {
    header: "Phone",
    cell: (info) => String(info.getValue()),
  }),
  columnHelper.accessor("note", {
    header: "Note",
    cell: (info) => info.getValue() || "-",
  }),
  columnHelper.accessor("created_at", {
    header: "Created At",
    cell: (info) => formatDate(info.getValue()),
  }),
  columnHelper.accessor("updated_at", {
    header: "Updated At",
    cell: (info) => formatDate(info.getValue()),
  }),
];
