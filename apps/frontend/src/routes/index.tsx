import { contactsQuery } from "#/integrations/query";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
	const { isPending ,data, isError } = useQuery(contactsQuery)

	if(isError) {
		return (
			<div className="flex h-screen items-center justify-center">
				<p className="text-sm text-red-500">Kişiler yüklenirken bir hata oluştu.</p>
			</div>
		)
	}

	if(isPending) {
		return (
			<div className="flex h-screen items-center justify-center">
				<p className="text-sm text-gray-500">Kişiler yükleniyor...</p>
			</div>
		)
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
								{data.contacts?.length || 0}
							</p>
						</article>
						<article className="feature-card rounded-2xl border border-[var(--line)] px-4 py-3">
							<p className="m-0 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[var(--sea-ink-soft)]">
								Bu Hafta
							</p>
							<p className="m-0 mt-2 text-2xl font-extrabold text-[var(--sea-ink)]">
								+24
							</p>
						</article>
					</div>
				</div>

				<div className="flex flex-col sm:flex-row sm:items-start w-full">
					<section className="feature-card rounded-3xl border border-[var(--line)] p-4 sm:p-5 w-full">
						<div className="mb-4 flex flex-wrap items-center gap-2">
							<input
								type="search"
								placeholder="İsim, e-posta veya etiket ara..."
								className="h-11 min-w-[220px] flex-1 rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 text-sm text-[var(--sea-ink)] outline-none ring-0 placeholder:text-[var(--sea-ink-soft)] focus:border-[var(--lagoon)]"
							/>
							<Link
								to="/create"
								className="h-11 flex items-center rounded-xl border border-transparent bg-[linear-gradient(90deg,#3fb5ae,#74ccb8)] px-4 text-sm font-semibold text-white"
							>
								+ Yeni Kişi
							</Link>
						</div>

						<div className="mb-4 flex flex-wrap gap-2">
							<span className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1 text-xs font-semibold text-[var(--sea-ink)]">
								Hepsi
							</span>
							<span className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1 text-xs font-semibold text-[var(--sea-ink-soft)]">
								Müşteri
							</span>
							<span className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1 text-xs font-semibold text-[var(--sea-ink-soft)]">
								Tedarikçi
							</span>
							<span className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1 text-xs font-semibold text-[var(--sea-ink-soft)]">
								Potansiyel
							</span>
						</div>

						<ul className="m-0 grid list-none gap-3 p-0">
							<li className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
								<div className="flex flex-wrap items-start justify-between gap-3">
									<div>
										<p className="m-0 text-base font-bold text-[var(--sea-ink)]">
											Ece Kaya
										</p>
										<p className="m-0 mt-1 text-sm text-[var(--sea-ink-soft)]">
											ece.kaya@novaworks.co
										</p>
									</div>
									<span className="rounded-full border border-emerald-300/40 bg-emerald-100/80 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-300">
										Aktif
									</span>
								</div>
								<div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--sea-ink-soft)]">
									<span className="rounded-full border border-[var(--line)] px-2 py-1">
										+90 532 000 10 11
									</span>
									<span className="rounded-full border border-[var(--line)] px-2 py-1">
										VIP
									</span>
									<span className="rounded-full border border-[var(--line)] px-2 py-1">
										Satış
									</span>
								</div>
								<div className="mt-4 flex gap-2">
									<button
										type="button"
										className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-xs font-semibold text-[var(--sea-ink)]"
									>
										Düzenle
									</button>
									<button
										type="button"
										className="rounded-lg border border-rose-300/45 bg-rose-100/70 px-3 py-1.5 text-xs font-semibold text-rose-800 dark:border-rose-300/25 dark:bg-rose-500/10 dark:text-rose-300"
									>
										Sil
									</button>
								</div>
							</li>

							<li className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
								<div className="flex flex-wrap items-start justify-between gap-3">
									<div>
										<p className="m-0 text-base font-bold text-[var(--sea-ink)]">
											Mert Aydin
										</p>
										<p className="m-0 mt-1 text-sm text-[var(--sea-ink-soft)]">
											mert@pixelforge.dev
										</p>
									</div>
									<span className="rounded-full border border-amber-300/50 bg-amber-100/80 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:border-amber-300/25 dark:bg-amber-500/10 dark:text-amber-300">
										Takipte
									</span>
								</div>
								<div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--sea-ink-soft)]">
									<span className="rounded-full border border-[var(--line)] px-2 py-1">
										+90 535 202 93 42
									</span>
									<span className="rounded-full border border-[var(--line)] px-2 py-1">
										Lead
									</span>
									<span className="rounded-full border border-[var(--line)] px-2 py-1">
										Tasarım
									</span>
								</div>
								<div className="mt-4 flex gap-2">
									<button
										type="button"
										className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-xs font-semibold text-[var(--sea-ink)]"
									>
										Düzenle
									</button>
									<button
										type="button"
										className="rounded-lg border border-rose-300/45 bg-rose-100/70 px-3 py-1.5 text-xs font-semibold text-rose-800 dark:border-rose-300/25 dark:bg-rose-500/10 dark:text-rose-300"
									>
										Sil
									</button>
								</div>
							</li>

							<li className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
								<div className="flex flex-wrap items-start justify-between gap-3">
									<div>
										<p className="m-0 text-base font-bold text-[var(--sea-ink)]">
											Leyla Gunes
										</p>
										<p className="m-0 mt-1 text-sm text-[var(--sea-ink-soft)]">
											leyla@orahealth.com
										</p>
									</div>
									<span className="rounded-full border border-sky-300/45 bg-sky-100/80 px-2.5 py-1 text-xs font-semibold text-sky-800 dark:border-sky-300/25 dark:bg-sky-500/10 dark:text-sky-300">
										Yeni
									</span>
								</div>
								<div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--sea-ink-soft)]">
									<span className="rounded-full border border-[var(--line)] px-2 py-1">
										+90 531 778 21 67
									</span>
									<span className="rounded-full border border-[var(--line)] px-2 py-1">
										Healthcare
									</span>
									<span className="rounded-full border border-[var(--line)] px-2 py-1">
										Onboarding
									</span>
								</div>
								<div className="mt-4 flex gap-2">
									<button
										type="button"
										className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-xs font-semibold text-[var(--sea-ink)]"
									>
										Düzenle
									</button>
									<button
										type="button"
										className="rounded-lg border border-rose-300/45 bg-rose-100/70 px-3 py-1.5 text-xs font-semibold text-rose-800 dark:border-rose-300/25 dark:bg-rose-500/10 dark:text-rose-300"
									>
										Sil
									</button>
								</div>
							</li>
						</ul>
					</section>
				</div>
			</section>
		</main>
	);
}
