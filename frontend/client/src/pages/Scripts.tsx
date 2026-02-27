import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Code2, User, Calendar, FileText, Play } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { apiConfig } from "@/lib/api";
import axios from "@/lib/axios";
import { useLocation } from "wouter";
import ScriptsAdmin from "@/pages/ScriptsAdmin";

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

  // Busca scripts
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

        setIsDev(role === "dev" || role == "admin");
        setIsAdmin(role === "admin");

      } catch {
        setIsDev(false);
        setIsAdmin(false);
      }
    };

    fetchMe();
  }, []);

  // Rodar script
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
            "Authorization": `Bearer ${token}`,
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
      console.error(err);
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
      <aside className="w-48 border-r border-border bg-card flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <Code2 className="w-6 h-6 text-primary" strokeWidth={1.5} />
            <h1 className="text-lg font-bold">Scripts</h1>
          </div>
          <p className="text-xs text-muted-foreground">Automation Hub</p>
        </div>

        <nav className="flex-1 p-4 space-y-5">
          <button className="w-full text-left px-3 py-2 rounded text-sm font-medium text-primary bg-primary/5 border-l-2 border-primary">
            Todos os Scripts
          </button>
          {isDev && (
            <button onClick={() => setLocation("/dev/scripts")} className="w-full text-left px-3 py-2 rounded text-sm font-medium text-primary bg-primary/5 border-l-2 border-primary">
              Área DEV
            </button>
          )}

          {isAdmin && (
            <button onClick={() => setLocation("/admin/users")} className="w-full text-left px-3 py-2 rounded text-sm font-medium text-primary bg-primary/5 border-l-2 border-primary">
              Área Admin
            </button>
          )}

        </nav>


        <div className="p-4 border-t border-border text-xs text-muted-foreground">
          Total: {scripts.length} scripts
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b border-border bg-card px-8 py-6">
          <h2 className="text-2xl font-bold">Scripts disponíveis</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Clique em um script para ver detalhes ou rodar
          </p>
        </header>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Carregando scripts...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-destructive font-medium mb-2">Erro ao carregar</p>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Tentar novamente
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scripts.map((script) => (
                  <Card
                    key={script.id}
                    className="group cursor-pointer overflow-hidden hover:shadow-md transition-all duration-200 border-l-4 border-l-primary"
                    onClick={() => setSelectedScript(script)}
                  >
                    {/* input file escondido */}
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
                      <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                        {script.name}
                      </h3>

                      <p className="text-xs text-muted-foreground font-mono mt-1">
                        {script.filename}
                      </p>

                      {script.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-3">
                          {script.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-border">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="w-3 h-3" />
                          {script.author}
                        </div>

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
                          {runningId === script.id ? (
                            "Executando..."
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-1" />
                              Rodar
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Detail Panel */}
      {selectedScript && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setSelectedScript(null)}
          />

          <div className="fixed right-0 top-0 h-screen w-96 bg-card border-l border-border shadow-lg z-50 flex flex-col animate-in slide-in-from-right-80">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold">Detalhes</h3>
              <button
                onClick={() => setSelectedScript(null)}
                className="p-1 hover:bg-muted rounded"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6 space-y-6">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Nome
                </label>
                <p className="mt-2">{selectedScript.name}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Arquivo
                </label>
                <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-muted rounded">
                  <FileText className="w-4 h-4 text-primary" />
                  <code>{selectedScript.filename}</code>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Autor
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  {selectedScript.author}
                </div>
              </div>

              {selectedScript.created_at && (
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">
                    Criado em
                  </label>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    {new Date(selectedScript.created_at).toLocaleDateString(
                      "pt-BR"
                    )}
                  </div>
                </div>
              )}

              {selectedScript.description && (
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">
                    Descrição
                  </label>
                  <p className="mt-2 leading-relaxed">{selectedScript.description}</p>
                </div>
              )}
            </div>

            <div className="border-t border-border p-6">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSelectedScript(null)}
              >
                Fechar
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}