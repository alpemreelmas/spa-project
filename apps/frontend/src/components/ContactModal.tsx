"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import type { Contact } from "#/integrations/table/contact";
import {
	type CreateFormData,
	CreateFormSchema,
} from "#/schemas/createFormData";
import FormErrorBox from "./ui/FormErrorBox";

type OnSubmit =
	| ((data: CreateFormData) => Promise<void>)
	| ((data: CreateFormData, id: number) => Promise<void>);

type ContactModalProps = Omit<
	React.HTMLAttributes<HTMLDivElement>,
	"onSubmit"
> & {
	type: "create" | "edit";
	onSubmit: OnSubmit;
	person?: Contact;
	isSubmitting?: boolean;
};

export default function ContactModal({
	type,
	onSubmit,
	person,
	isSubmitting = false,
	...props
}: ContactModalProps) {
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
			note: person?.note ?? "",
		},
	});

	const handleFormSubmit = async (data: CreateFormData) => {
		await onSubmit(data, person?.id ?? 0);
		if (type === "create") {
			reset();
		}
	};

	return (
		<section
			className="feature-card border border-[var(--line)] p-4 sm:p-5"
			{...props}
		>
			<p className="island-kicker mb-2">Form Panel</p>
			<h2 className="m-0 text-xl font-bold text-[var(--sea-ink)]">
				{type === "create" ? "Add New Person" : "Edit Person"}
			</h2>

			<form
				className="mt-5 grid gap-3"
				onSubmit={handleSubmit(handleFormSubmit)}
			>
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
					{...register("note")}
					className={`rounded-xl border px-3 py-2 text-sm outline-none
            ${formErrors.note ? "border-red-500" : "border-[var(--line)]"}
            bg-[var(--surface-strong)] text-[var(--sea-ink)]
            placeholder:text-[var(--sea-ink-soft)]
            focus:border-[var(--lagoon)]`}
				/>
				<FormErrorBox error={formErrors.note} />

				<div className="mt-2 grid grid-cols-2 gap-2">
					<button
						type="submit"
						disabled={isSubmitting}
						className="h-11 rounded-xl border border-transparent bg-[linear-gradient(90deg,#3fb5ae,#74ccb8)] text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-65"
					>
						{isSubmitting
							? "Saving..."
							: type === "create"
								? "Create"
								: "Update"}
					</button>
					<Link
						to="/"
						className="flex h-11 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] text-sm font-semibold text-[var(--sea-ink)] no-underline"
					>
						Cancel
					</Link>
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
