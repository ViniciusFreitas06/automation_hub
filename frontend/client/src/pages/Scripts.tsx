import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Code2, User, Calendar, FileText, Play, LogOut } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { apiConfig } from "@/lib/api";
import axios from "@/lib/axios";
import { useLocation } from "wouter";

interface Script {
  id: number;
  name: string;
  description: string | null;
  author: string;
  filename: string;
  created_at?: string;
}

export default function Scripts() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [runningId, setRunningId] = useState<number | null>(null);
  const [, setLocation] = useLocation();

  const [isDev, setIsDev] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setLocation("/login");
  };

  useEffect(() => {
    const fetchScripts = async () => {
      try {
        setLoading(true);
        const response = await api.get(apiConfig.endpoints.scripts.list);
        setScripts(response.data);
      } catch (err: any) {
        const message =
          err?.response?.data?.detail || "Erro ao carregar scripts";
        setError(message);
        toast.error("Erro ao carregar scripts: " + message);
      } finally {
        setLoading(false);
      }
    };

    fetchScripts();
  }, []);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get(apiConfig.endpoints.auth.me);

        const role = res.data.role;
        setIsDev(role === "dev" || role === "admin");
        setIsAdmin(role === "admin");
        setUserName(res.data.email);
      } catch {
        setIsDev(false);
        setIsAdmin(false);
      }
    };

    fetchMe();
  }, []);

  const runScript = async (script: Script, file: File) => {
    try {
      setRunningId(script.id);

      const formData = new FormData();
      formData.append("file", file);

      const scriptName = script.filename.replace(/\.py$/, "");
      formData.append("script_name", scriptName);

      const token = localStorage.getItem("access_token");

      const response = await axios.post(
        apiConfig.endpoints.runner.run,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const filename = response.data.filename;
      const downloadUrl = `${apiConfig.baseURL}/download/${filename}`;

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success(
        `Script executado com sucesso (${response.data.duration})`
      );
    } catch (err: any) {
      toast.error(
        err?.response?.data?.detail || "Erro ao executar script"
      );
    } finally {
      setRunningId(null);
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-56 border-r border-border bg-card flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <Code2 className="w-6 h-6 text-primary" strokeWidth={1.5} />
            <h1 className="text-lg font-bold">Scripts</h1>
          </div>
          <p className="text-xs text-muted-foreground">Automation Hub</p>
        </div>

        <nav className="flex-1 p-4 space-y-4">
          <button className="w-full text-left px-3 py-2 rounded text-sm font-medium text-primary bg-primary/5 border-l-2 border-primary">
            Todos os Scripts
          </button>

          {isDev && (
            <button
              onClick={() => setLocation("/dev/scripts")}
              className="w-full text-left px-3 py-2 rounded text-sm font-medium hover:bg-muted"
            >
              Área DEV
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => setLocation("/admin/users")}
              className="w-full text-left px-3 py-2 rounded text-sm font-medium hover:bg-muted"
            >
              Área Admin
            </button>
          )}
        </nav>

        <div className="p-4 border-t border-border space-y-3">
          <p className="text-xs text-muted-foreground truncate">
            {userName}
          </p>

          <p className="text-xs text-muted-foreground">
            Total: {scripts.length} scripts
          </p>

          <Button
            variant="destructive"
            size="sm"
            className="w-full flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b border-border bg-card px-8 py-6">
          <h2 className="text-2xl font-bold">Scripts disponíveis</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Clique em um script para rodar
          </p>
        </header>

        <div className="flex-1 overflow-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scripts.map((script) => (
              <Card
                key={script.id}
                className="group cursor-pointer hover:shadow-md transition-all border-l-4 border-primary"
                onClick={() => setSelectedScript(script)}
              >
                <input
                  type="file"
                  id={`file-${script.id}`}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) runScript(script, file);
                  }}
                />

                <div className="p-6">
                  <h3 className="font-semibold text-base">
                    {script.name}
                  </h3>

                  <p className="text-xs text-muted-foreground font-mono">
                    {script.filename}
                  </p>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {script.author}
                    </span>

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={runningId === script.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        document
                          .getElementById(`file-${script.id}`)
                          ?.click();
                      }}
                    >
                      {runningId === script.id ? "Executando..." : "Rodar"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}