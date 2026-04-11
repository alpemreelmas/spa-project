import type { Contact } from "#/integrations/table/contact";

type CreateModalProps = {
    type: 'create' | 'edit';
    onSubmit?: () => void;
    person?: Contact
}

export default function CreateModal({ type, onSubmit, person } : CreateModalProps) {
	return (
		<section className="feature-card border border-[var(--line)] p-4 sm:p-5">
			<p className="island-kicker mb-2">Form Panel</p>
			<h2 className="m-0 text-xl font-bold text-[var(--sea-ink)]">
				{type === 'create' ? 'Add New Person' : 'Edit Person'}
			</h2>

			<form className="mt-5 grid gap-3" onSubmit={onSubmit}>
				<input
					type="text"
					placeholder="Name Surname"
					defaultValue={person?.name}
					className="h-11 rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-3 text-sm text-[var(--sea-ink)] outline-none placeholder:text-[var(--sea-ink-soft)] focus:border-[var(--lagoon)]"
				/>
				<input
					type="email"
					placeholder="Email"
					defaultValue={person?.email}
					className="h-11 rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-3 text-sm text-[var(--sea-ink)] outline-none placeholder:text-[var(--sea-ink-soft)] focus:border-[var(--lagoon)]"
				/>
				<input
					type="number"
					placeholder="Phone"
					defaultValue={person?.phone}
					className="h-11 rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-3 text-sm text-[var(--sea-ink)] outline-none placeholder:text-[var(--sea-ink-soft)] focus:border-[var(--lagoon)]"
				/>
				<textarea
					rows={4}
					placeholder="Notes"
					defaultValue={person?.note}
					className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 text-sm text-[var(--sea-ink)] outline-none placeholder:text-[var(--sea-ink-soft)] focus:border-[var(--lagoon)]"
				/>

				<div className="mt-2 grid grid-cols-2 gap-2">
					<button
						type="submit"
						className="h-11 rounded-xl border border-transparent bg-[linear-gradient(90deg,#3fb5ae,#74ccb8)] text-sm font-semibold text-white"
					>
						{type === 'create' ? 'Create' : 'Update'}
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
