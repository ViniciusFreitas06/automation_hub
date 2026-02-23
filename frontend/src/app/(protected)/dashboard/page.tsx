export default function DashboardPage() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="bg-white rounded-lg shadow-sm p-5">
        <p className="text-sm text-slate-500">Total de Scripts</p>
        <p className="text-2xl font-bold mt-1">12</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-5">
        <p className="text-sm text-slate-500">Execuções Hoje</p>
        <p className="text-2xl font-bold mt-1">34</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-5">
        <p className="text-sm text-slate-500">Usuários</p>
        <p className="text-2xl font-bold mt-1">8</p>
      </div>
    </div>
  );
}