"use client";
import CreateModal from "#/components/CreateModal";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const onSubmit = (e: any) => {
    console.log(e);
  };

  return (
    <div className="flex justify-center items-center w-full">
      <CreateModal type="create" onSubmit={onSubmit} className="w-full max-w-3xl mt-10 " />
    </div>
  );
}
