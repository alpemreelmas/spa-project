"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";
import ContactModal from "#/components/ContactModal";
import {
	contactsSingleQuery,
	updateContactMutation,
} from "#/integrations/query";
import type { CreateFormData } from "#/schemas/createFormData";

export const Route = createFileRoute("/edit/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = useParams({ from: "/edit/$id" });

	const mutation = useMutation({
		mutationFn: updateContactMutation.mutationFn,
		onSuccess: updateContactMutation.mutationSuccess,
		onError: updateContactMutation.mutationError,
	});

	const onSubmit = (data: CreateFormData, id: number) => {
		return mutation.mutateAsync({ ...data, id });
	};

	const { data, isError, isLoading } = useQuery(
		contactsSingleQuery(Number(id)),
	);

	if (isLoading) {
		return (
			<div className="page-wrap px-4 py-16">
				<section className="feature-card rounded-3xl border border-[var(--line)] p-6 text-sm text-[var(--sea-ink-soft)]">
					Loading contact...
				</section>
			</div>
		);
	}

	if (isError || !data?.data?.contact) {
		return (
			<div className="page-wrap px-4 py-16">
				<section className="feature-card rounded-3xl border border-[var(--line)] p-6 text-sm text-red-600">
					Could not load this contact.
				</section>
			</div>
		);
	}

	return (
		<div className="flex justify-center items-center w-full">
			<ContactModal
				type="edit"
				onSubmit={onSubmit}
				person={data.data.contact}
				isSubmitting={mutation.isPending}
				className="w-full max-w-3xl mt-10 "
			/>
		</div>
	);
}
