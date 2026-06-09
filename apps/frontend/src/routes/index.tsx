import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import {
	startTransition,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { contactsQuery, deleteContactMutation } from "#/integrations/query";
import { type Contact, getColumns } from "#/integrations/table/contact";
import { getLastWeekStats } from "#/lib/utils/stats";

export const Route = createFileRoute("/")({ component: App });

function App() {
	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [sorting, setSorting] = useState<SortingState>([]);
	const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

	useEffect(() => {
		const timeout = window.setTimeout(() => {
			setDebouncedSearch(search);
		}, 300);

		return () => window.clearTimeout(timeout);
	}, [search]);

	const { isPending, isFetching, data, isError } = useQuery({
		...contactsQuery(debouncedSearch),
	});
	const contacts = data?.data?.contacts ?? [];

	const deleteMutation = useMutation({
		mutationFn: deleteContactMutation.mutationFn,
		onSuccess: deleteContactMutation.mutationSuccess,
		onError: deleteContactMutation.mutationError,
	});

	const handleDelete = useCallback((_contact: Contact) => {
		setContactToDelete(_contact);
	}, []);
	const confirmDelete = async () => {
		if (!contactToDelete) {
			return;
		}

		await deleteMutation.mutateAsync(contactToDelete.id);
		setContactToDelete(null);
	};

	const columns = useMemo(
		() =>
			getColumns({
				onDelete: handleDelete,
			}),
		[handleDelete],
	);

	const table = useReactTable({
		data: contacts,
		columns,
		state: {
			sorting,
		},
		initialState: {
			pagination: {
				pageSize: 5,
			},
		},
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<main className="page-wrap px-4 pb-16 pt-10 sm:pt-14">
			<section className="island-shell rise-in overflow-hidden rounded-3xl border p-6 sm:p-8">
				<div className="mb-7 flex flex-wrap items-start justify-between gap-4 border-b border-[var(--line)] pb-6">
					<div className="max-w-2xl">
						<p className="island-kicker mb-3">Contact Console</p>
						<h1 className="display-title m-0 text-3xl font-bold leading-tight text-[var(--sea-ink)] sm:text-5xl">
							Kişi Rehberini Tek Ekrandan Yönet
						</h1>
						<p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--sea-ink-soft)] sm:text-base">
							Ekleme, düzenleme ve silme akışlarını tek bir görsel çalışma
							alanında toplayan, hızlı ve net bir CRM panel tasarımı.
						</p>
					</div>

					<div className="grid min-w-[220px] grid-cols-2 gap-3">
						<article className="feature-card rounded-2xl border border-[var(--line)] px-4 py-3">
							<p className="m-0 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[var(--sea-ink-soft)]">
								Total Contacts
							</p>
							<p className="m-0 mt-2 text-2xl font-extrabold text-[var(--sea-ink)]">
								{contacts.length}
							</p>
						</article>
						<article className="feature-card rounded-2xl border border-[var(--line)] px-4 py-3">
							<p className="m-0 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[var(--sea-ink-soft)]">
								This Week
							</p>
							<p className="m-0 mt-2 text-2xl font-extrabold text-[var(--sea-ink)]">
								+{getLastWeekStats(contacts)}
							</p>
						</article>
					</div>
				</div>

				<section className="feature-card w-full rounded-3xl border border-[var(--line)] p-4 sm:p-5">
					<div className="mb-4 flex flex-wrap items-center gap-2">
						<input
							type="search"
							value={search}
							onChange={(event) => {
								const nextValue = event.target.value;
								startTransition(() => {
									setSearch(nextValue);
								});
							}}
							placeholder="Search by name, email or notes..."
							className="h-11 min-w-[220px] flex-1 rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 text-sm text-[var(--sea-ink)] outline-none ring-0 placeholder:text-[var(--sea-ink-soft)] focus:border-[var(--lagoon)]"
						/>
						<Link
							to="/create"
							className="flex h-11 items-center rounded-xl border border-transparent bg-[linear-gradient(90deg,#3fb5ae,#74ccb8)] px-4 text-sm font-semibold text-white"
						>
							+ New Contact
						</Link>
						{isFetching ? (
							<span className="text-xs font-semibold text-[var(--sea-ink-soft)]">
								Searching...
							</span>
						) : null}
					</div>

					<div className="mb-4 flex flex-wrap gap-2">
						<span className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1 text-xs font-semibold text-[var(--sea-ink)]">
							All
						</span>
						<span className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1 text-xs font-semibold text-[var(--sea-ink-soft)]">
							TanStack Table
						</span>
						<span className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1 text-xs font-semibold text-[var(--sea-ink-soft)]">
							Searchable
						</span>
						<span className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1 text-xs font-semibold text-[var(--sea-ink-soft)]">
							Live Data
						</span>
					</div>

					<div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
						<div className="overflow-x-auto">
							<table className="min-w-full border-collapse text-left">
								<thead className="bg-[var(--surface-strong)]">
									{table.getHeaderGroups().map((headerGroup) => (
										<tr key={headerGroup.id}>
											{headerGroup.headers.map((header) => (
												<th
													key={header.id}
													className="border-b border-[var(--line)] px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--sea-ink-soft)]"
												>
													{header.isPlaceholder ? null : header.column.getCanSort() ? (
														<button
															type="button"
															onClick={header.column.getToggleSortingHandler()}
															className="flex items-center gap-1 text-left text-xs font-bold uppercase tracking-[0.12em] text-[var(--sea-ink-soft)]"
														>
															{flexRender(
																header.column.columnDef.header,
																header.getContext(),
															)}
															<span aria-hidden="true">
																{header.column.getIsSorted() === "asc"
																	? "↑"
																	: header.column.getIsSorted() === "desc"
																		? "↓"
																		: "↕"}
															</span>
														</button>
													) : (
														flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)
													)}
												</th>
											))}
										</tr>
									))}
								</thead>
								<tbody>
									{isError ? (
										<tr>
											<td
												colSpan={columns.length}
												className="px-4 py-8 text-center text-sm text-red-600"
											>
												An error occurred while loading contacts.
											</td>
										</tr>
									) : isPending && !data ? (
										<tr>
											<td
												colSpan={columns.length}
												className="px-4 py-8 text-center text-sm text-[var(--sea-ink-soft)]"
											>
												Loading contacts...
											</td>
										</tr>
									) : table.getRowModel().rows.length ? (
										table.getRowModel().rows.map((row) => (
											<tr
												key={row.id}
												className="transition hover:bg-[var(--surface-strong)]"
											>
												{row.getVisibleCells().map((cell) => (
													<td
														key={cell.id}
														className="border-b border-[var(--line)] px-4 py-3 text-sm text-[var(--sea-ink)]"
													>
														{flexRender(
															cell.column.columnDef.cell,
															cell.getContext(),
														)}
													</td>
												))}
											</tr>
										))
									) : (
										<tr>
											<td
												colSpan={columns.length}
												className="px-4 py-8 text-center text-sm text-[var(--sea-ink-soft)]"
											>
												{search.trim()
													? "No contacts match your search."
													: "No contacts yet. Create the first one."}
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>

					<div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--sea-ink-soft)]">
						<p className="m-0">
							Page {table.getState().pagination.pageIndex + 1} of{" "}
							{Math.max(table.getPageCount(), 1)}
						</p>
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
								className="h-9 rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-3 text-xs font-semibold text-[var(--sea-ink)] disabled:cursor-not-allowed disabled:opacity-50"
							>
								Previous
							</button>
							<button
								type="button"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
								className="h-9 rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-3 text-xs font-semibold text-[var(--sea-ink)] disabled:cursor-not-allowed disabled:opacity-50"
							>
								Next
							</button>
						</div>
					</div>
				</section>
			</section>

			{contactToDelete ? (
				<div className="fixed inset-0 z-40 flex items-center justify-center bg-black/35 px-4">
					<section className="feature-card w-full max-w-sm rounded-2xl border border-[var(--line)] p-5">
						<p className="island-kicker mb-2">Confirm Delete</p>
						<h2 className="m-0 text-lg font-bold text-[var(--sea-ink)]">
							Delete {contactToDelete.name}?
						</h2>
						<p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
							This contact will be removed from the database.
						</p>
						<div className="mt-5 grid grid-cols-2 gap-2">
							<button
								type="button"
								onClick={() => setContactToDelete(null)}
								disabled={deleteMutation.isPending}
								className="h-10 rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] text-sm font-semibold text-[var(--sea-ink)]"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={confirmDelete}
								disabled={deleteMutation.isPending}
								className="h-10 rounded-xl border border-rose-300/45 bg-rose-600 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-65"
							>
								{deleteMutation.isPending ? "Deleting..." : "Delete"}
							</button>
						</div>
					</section>
				</div>
			) : null}
		</main>
	);
}
