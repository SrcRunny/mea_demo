import Link from "next/link";
import { Scene3D } from "@/components/babylon";

export default function RunPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-zinc-950">
      <header className="border-b border-zinc-200/80 bg-white/90 px-6 py-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            ← Home
          </Link>
          <h1 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            3D Scene
          </h1>
        </div>
      </header>
      <main className="flex-1">
        <Scene3D className="h-[calc(100vh-57px)] w-full" />
      </main>
    </div>
  );
}
