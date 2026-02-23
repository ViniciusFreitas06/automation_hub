import Link from 'next/link';

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-lg font-bold tracking-wide">
          Automation Hub
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Corporate Automation Platform
        </p>
      </div>

      <nav className="flex flex-col gap-1 p-4 text-sm">
        <Link
          href="/dashboard"
          className="rounded px-3 py-2 hover:bg-slate-800 transition"
        >
          Dashboard
        </Link>

        <Link
          href="/scripts"
          className="rounded px-3 py-2 hover:bg-slate-800 transition"
        >
          Scripts
        </Link>

        <Link
          href="/users"
          className="rounded px-3 py-2 hover:bg-slate-800 transition"
        >
          Usuários
        </Link>
      </nav>
    </aside>
  );
};