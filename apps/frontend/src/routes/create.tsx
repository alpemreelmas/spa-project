"use client";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import CreateModal from "#/components/ContactModal";
import { createContactMutation } from "#/integrations/query";
import type { CreateFormData } from "#/schemas/createFormData";

export const Route = createFileRoute("/create")({
	component: RouteComponent,
});

function RouteComponent() {
	const mutation = useMutation({
		mutationFn: createContactMutation.mutationFn,
		onSuccess: createContactMutation.mutationSuccess,
		onError: createContactMutation.mutationError,
	});

	const onSubmit = (data: CreateFormData) => {
		return mutation.mutateAsync(data);
	};

	return (
		<div className="flex justify-center items-center w-full">
			<CreateModal
				type="create"
				onSubmit={onSubmit}
				isSubmitting={mutation.isPending}
				className="w-full max-w-3xl mt-10 "
			/>
		</div>
	);
}
