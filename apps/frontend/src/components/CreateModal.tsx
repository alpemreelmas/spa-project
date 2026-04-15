"use client";

import type { Contact } from "#/integrations/table/contact";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateFormSchema } from "#/schemas/createFormData";
import FormErrorBox from "./ui/FormErrorBox";

type CreateModalProps = {
  type: "create" | "edit";
  onSubmit: (data: CreateFormData) => void;
  person?: Contact;
};

type CreateFormData = {
  name: string;
  email: string;
  phone: number;
  notes?: string;
};

export default function CreateModal({
  type,
  onSubmit,
  person,
}: CreateModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<CreateFormData>({
    resolver: zodResolver(CreateFormSchema),
    defaultValues: {
      name: person?.name ?? "",
      email: person?.email ?? "",
      phone: person?.phone ?? 0,
      notes: person?.note ?? "",
    },
  });

  return (
    <section className="feature-card border border-[var(--line)] p-4 sm:p-5">
      <p className="island-kicker mb-2">Form Panel</p>
      <h2 className="m-0 text-xl font-bold text-[var(--sea-ink)]">
        {type === "create" ? "Add New Person" : "Edit Person"}
      </h2>

      <form className="mt-5 grid gap-3" onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Name Surname"
          {...register("name")}
          className="h-11 rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-3 text-sm text-[var(--sea-ink)] outline-none placeholder:text-[var(--sea-ink-soft)] focus:border-[var(--lagoon)]"
        />
        <FormErrorBox error={formErrors.name} />

        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="h-11 rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-3 text-sm text-[var(--sea-ink)] outline-none placeholder:text-[var(--sea-ink-soft)] focus:border-[var(--lagoon)]"
        />
        <FormErrorBox error={formErrors.email} />

        <input
          type="number"
          placeholder="Phone"
          defaultValue={person?.phone}
          {...register("phone")}
          className="h-11 rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-3 text-sm text-[var(--sea-ink)] outline-none placeholder:text-[var(--sea-ink-soft)] focus:border-[var(--lagoon)]"
        />
        <FormErrorBox error={formErrors.phone} />
        <textarea
          rows={4}
          placeholder="Notes"
          {...register("notes")}
          className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 text-sm text-[var(--sea-ink)] outline-none placeholder:text-[var(--sea-ink-soft)] focus:border-[var(--lagoon)]"
        />
        <FormErrorBox error={formErrors.notes} />

        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="submit"
            className="h-11 rounded-xl border border-transparent bg-[linear-gradient(90deg,#3fb5ae,#74ccb8)] text-sm font-semibold text-white"
          >
            {type === "create" ? "Create" : "Update"}
          </button>
        </div>
      </form>

      {/* <div className="mt-5 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
				<p className="m-0 text-xs font-bold uppercase tracking-[0.12em] text-[var(--sea-ink-soft)]">
					Son Islem
				</p>
				<p className="m-0 mt-2 text-sm text-[var(--sea-ink)]">
					Ece Kaya kaydi guncellendi • 14:38
				</p>
			</div> */}
    </section>
  );
}
