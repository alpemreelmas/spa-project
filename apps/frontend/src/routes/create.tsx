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

  return <CreateModal type="create" onSubmit={onSubmit} />;
}
