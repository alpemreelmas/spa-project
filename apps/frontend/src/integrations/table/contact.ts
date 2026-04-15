export type Contact = {
    id: string;
    name: string;
    email: string;
    phone: string;
    note: string;
    created_at: string;
    updated_at: string;
}

export const columns = [
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Phone",
    accessor: "phone",
  },
  {
    Header: "Note",
    accessor: "note",
  },
  {
    Header: "Created At",
    accessor: "created_at",
  },
  {
    Header: "Updated At",
    accessor: "updated_at",
  },
];