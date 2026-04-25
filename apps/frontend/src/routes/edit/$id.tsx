"use client";
import ContactModal from "#/components/ContactModal";
import { contactsSingleQuery, updateContactMutation } from "#/integrations/query";
import type { CreateFormData } from "#/schemas/createFormData";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/edit/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = useParams({ from: "/edit/$id" });
	console.log("ID from params:", id);
	const mutation = useMutation({
		mutationFn: updateContactMutation.mutationFn,
		onSuccess: updateContactMutation.mutationSuccess,
	});

	const onSubmit = (data: CreateFormData, id: number) => {
		return mutation.mutateAsync({...data, id});
	};

	const { data, isLoading } = useQuery(contactsSingleQuery(Number(id)));

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="flex justify-center items-center w-full">
			<ContactModal
				type="edit"
				onSubmit={onSubmit}
				person={data.data.contact}
				className="w-full max-w-3xl mt-10 "
			/>
		</div>
	);
}
