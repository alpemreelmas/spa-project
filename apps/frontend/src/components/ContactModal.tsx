"use client";

import type { Contact } from "#/integrations/table/contact";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateFormSchema, type CreateFormData } from "#/schemas/createFormData";
import FormErrorBox from "./ui/FormErrorBox";

type CreateModalProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onSubmit"> & {
  type: "create" | "edit";
  onSubmit: (data: CreateFormData) => Promise<void>;
  person?: Contact;
};

export default function ContactModal({
  type,
  onSubmit,
  person,
  ...props
}: CreateModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formErrors },
  } = useForm<CreateFormData>({
    resolver: zodResolver(CreateFormSchema),
    defaultValues: {
      name: person?.name ?? "",
      email: person?.email ?? "",
      phone: person?.phone ? Number(person.phone) : undefined,
      notes: person?.note ?? "",
    },
  });

  const handleFormSubmit = async (data: CreateFormData) => {
    await onSubmit(data);
    reset();
  }

  return (
    <section className="feature-card border border-[var(--line)] p-4 sm:p-5" {...props}>
      <p className="island-kicker mb-2">Form Panel</p>
      <h2 className="m-0 text-xl font-bold text-[var(--sea-ink)]">
        {type === "create" ? "Add New Person" : "Edit Person"}
      </h2>

      <form className="mt-5 grid gap-3" onSubmit={handleSubmit(handleFormSubmit)}>
        <input
          type="text"
          placeholder="Name Surname"
          {...register("name")}
          className={`h-11 rounded-xl border px-3 text-sm outline-none
            ${formErrors.name ? "border-red-500" : "border-[var(--line)]"}
            bg-[var(--surface-strong)] text-[var(--sea-ink)]
            placeholder:text-[var(--sea-ink-soft)]
            focus:border-[var(--lagoon)]`}   
          />
        <FormErrorBox error={formErrors.name} />

        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className={`h-11 rounded-xl border px-3 text-sm outline-none
          ${formErrors.email ? "border-red-500" : "border-[var(--line)]"}
          bg-[var(--surface-strong)] text-[var(--sea-ink)]
          placeholder:text-[var(--sea-ink-soft)]
          focus:border-[var(--lagoon)]`}
        />
        <FormErrorBox error={formErrors.email} />

        <input
          type="number"
          placeholder="Phone"
          {...register("phone", { valueAsNumber: true })}
          className={`h-11 rounded-xl border px-3 text-sm outline-none
            ${formErrors.phone ? "border-red-500" : "border-[var(--line)]"}
            bg-[var(--surface-strong)] text-[var(--sea-ink)]
            placeholder:text-[var(--sea-ink-soft)]
            focus:border-[var(--lagoon)]`}
          />
        <FormErrorBox error={formErrors.phone} />
        <textarea
          rows={4}
          placeholder="Notes"
          {...register("notes")}
          className={`rounded-xl border px-3 py-2 text-sm outline-none
            ${formErrors.notes ? "border-red-500" : "border-[var(--line)]"}
            bg-[var(--surface-strong)] text-[var(--sea-ink)]
            placeholder:text-[var(--sea-ink-soft)]
            focus:border-[var(--lagoon)]`}
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
