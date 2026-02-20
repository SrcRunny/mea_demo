import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 font-sans dark:bg-zinc-950">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        MEA Demo
      </h1>
      <nav className="flex flex-col gap-3">
        <Link
          href="/run_page"
          className="rounded-lg border border-zinc-200 bg-white px-6 py-3 text-center font-medium text-zinc-800 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
        >
          3D Scene (Babylon) RUN PAGE
        </Link>
      </nav>
      <nav className="flex flex-col gap-3">
        <Link
          href="/por_page"
          className="rounded-lg border border-zinc-200 bg-white px-6 py-3 text-center font-medium text-zinc-800 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
        >
          3D Scene (Babylon) POR PAGE
        </Link>
      </nav>
    </div>
  );
}
