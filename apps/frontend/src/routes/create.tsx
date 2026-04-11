import CreateModal from '#/components/CreateModal'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CreateModal type="create" />
}
