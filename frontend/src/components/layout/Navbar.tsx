export const Navbar = () => {
  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-6">
      <span className="font-semibold text-slate-700">
        Automation Hub
      </span>

      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-500">
          Usuário
        </span>

        <button className="text-sm text-red-500 hover:underline">
          Logout
        </button>
      </div>
    </header>
  );
};