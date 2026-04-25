"use client";
import CreateModal from "#/components/CreateModal";
import { createContactMutation } from "#/integrations/query";
import type { CreateFormData } from "#/schemas/createFormData";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/create")({
	component: RouteComponent,
});

function RouteComponent() {
	const mutation = useMutation({
		mutationFn: createContactMutation.mutationFn,
		onSuccess: createContactMutation.mutationSuccess,
	});

	const onSubmit = (data: CreateFormData) => {
		mutation.mutate(data);
	};

	return (
		<div className="flex justify-center items-center w-full">
			<CreateModal
				type="create"
				onSubmit={onSubmit}
				className="w-full max-w-3xl mt-10 "
			/>
		</div>
	);
}
