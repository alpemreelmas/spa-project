import { contactsQuery, deleteContactMutation } from "#/integrations/query";
import { getColumns, type Contact } from "#/integrations/table/contact";
import { getLastWeekStats } from "#/lib/utils/stats";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({ component: App });

function App() {
	const { isPending, data, isError } = useQuery(contactsQuery);
	const [globalFilter, setGlobalFilter] = useState("");
	const contacts = data?.data?.contacts ?? [];

	const deleteMutation = useMutation({
		mutationFn: deleteContactMutation.mutationFn,
		onSuccess: deleteContactMutation.mutationSuccess,
	});

	const handleDelete = (_contact: Contact) => {
		return deleteMutation.mutateAsync(_contact.id);
	};
	const columns = getColumns({
		onDelete: handleDelete,
	});

	const table = useReactTable({
		data: contacts,
		columns,
		state: {
			globalFilter,
		},
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		globalFilterFn: "includesString",
	});

	if (isError) {
		return (
			<div className="flex h-screen items-center justify-center">
				<p className="text-sm text-red-500">
					Kişiler yüklenirken bir hata oluştu.
				</p>
			</div>
		);
	}

	if (isPending) {
		return (
			<div className="flex h-screen items-center justify-center">
				<p className="text-sm text-gray-500">Kişiler yükleniyor...</p>
			</div>
		);
	}

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
								Toplam Kişi
							</p>
							<p className="m-0 mt-2 text-2xl font-extrabold text-[var(--sea-ink)]">
								{contacts.length}
							</p>
						</article>
						<article className="feature-card rounded-2xl border border-[var(--line)] px-4 py-3">
							<p className="m-0 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[var(--sea-ink-soft)]">
								Bu Hafta
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
							value={globalFilter}
							onChange={(event) => setGlobalFilter(event.target.value)}
							placeholder="İsim, e-posta, telefon veya not ara..."
							className="h-11 min-w-[220px] flex-1 rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 text-sm text-[var(--sea-ink)] outline-none ring-0 placeholder:text-[var(--sea-ink-soft)] focus:border-[var(--lagoon)]"
						/>
						<Link
							to="/create"
							className="flex h-11 items-center rounded-xl border border-transparent bg-[linear-gradient(90deg,#3fb5ae,#74ccb8)] px-4 text-sm font-semibold text-white"
						>
							+ Yeni Kişi
						</Link>
					</div>

					<div className="mb-4 flex flex-wrap gap-2">
						<span className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1 text-xs font-semibold text-[var(--sea-ink)]">
							Hepsi
						</span>
						<span className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1 text-xs font-semibold text-[var(--sea-ink-soft)]">
							TanStack Table
						</span>
						<span className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1 text-xs font-semibold text-[var(--sea-ink-soft)]">
							Aranabilir
						</span>
						<span className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1 text-xs font-semibold text-[var(--sea-ink-soft)]">
							Canli Veri
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
													{header.isPlaceholder
														? null
														: flexRender(
																header.column.columnDef.header,
																header.getContext(),
															)}
												</th>
											))}
										</tr>
									))}
								</thead>
								<tbody>
									{table.getRowModel().rows.length ? (
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
												Sonuc bulunamadi.
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>
				</section>
			</section>
		</main>
	);
}
