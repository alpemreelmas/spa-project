import { Link } from "@tanstack/react-router";
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

type ContactTableActions = {
  onDelete: (contact: Contact) => void;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function getColumns({ onDelete }: ContactTableActions) {
  return [
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
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const contact = row.original;

        return (
          <div className="flex gap-2">
            <Link
              to={`/edit/${contact.id}` as string}
              className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-xs font-semibold text-[var(--sea-ink)]"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={() => onDelete(contact)}
              className="rounded-lg border border-rose-300/45 bg-rose-100/70 px-3 py-1.5 text-xs font-semibold text-rose-800"
            >
              Delete
            </button>
          </div>
        );
      },
    }),
  ];
}
