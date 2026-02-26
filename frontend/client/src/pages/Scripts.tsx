/**
 * Scripts Page - Minimalismo Técnico
 * Design: Bauhaus Digital + Swiss Style
 * 
 * Características:
 * - Sidebar esquerda com navegação (200px fixo)
 * - Grid assimétrico de scripts
 * - Cards minimalistas com borda superior colorida
 * - Painel de detalhes desliza do lado direito
 * - Paleta monocromática com azul profundo como accent
 */

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Code2, User, Calendar, FileText } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { apiConfig } from "@/lib/api";

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

  // Buscar scripts da API
  useEffect(() => {
    const fetchScripts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(apiConfig.endpoints.scripts.list, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setScripts(response.data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao carregar scripts";
        setError(message);
        console.error("Erro ao buscar scripts:", err);
        toast.error("Erro ao carregar scripts: " + message);
      } finally {
        setLoading(false);
      }
    };

    fetchScripts();
  }, []);

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar - Navegação */}
      <aside className="w-48 border-r border-border bg-card flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <Code2 className="w-6 h-6 text-primary" strokeWidth={1.5} />
            <h1 className="text-lg font-bold text-foreground">Scripts</h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Automation Hub
          </p>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 rounded text-sm font-medium text-primary bg-primary/5 border-l-2 border-primary">
              Todos os Scripts
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-border text-xs text-muted-foreground">
          <p>Total: {scripts.length} scripts</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border bg-card px-8 py-6">
          <h2 className="text-2xl font-bold text-foreground">Scripts disponíveis</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Clique em um script para visualizar os detalhes
          </p>
        </header>

        {/* Content Area */}
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
                <p className="text-destructive font-medium mb-2">
                  Erro ao carregar
                </p>
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
          ) : scripts.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Code2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Nenhum script encontrado</p>
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
                    <div className="p-6">
                      {/* Header do Card */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                            {script.name}
                          </h3>
                          <p className="text-xs text-muted-foreground font-mono mt-1">
                            {script.filename}
                          </p>
                        </div>
                      </div>

                      {/* Descrição */}
                      {script.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {script.description}
                        </p>
                      )}

                      {/* Metadata */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" strokeWidth={2} />
                          <span>{script.author}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Detail Panel - Slide in from right */}
      {selectedScript && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-200"
            onClick={() => setSelectedScript(null)}
          />

          {/* Panel */}
          <div className="fixed right-0 top-0 h-screen w-96 bg-card border-l border-border shadow-lg z-50 flex flex-col animate-in slide-in-from-right-80 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Detalhes</h3>
              <button
                onClick={() => setSelectedScript(null)}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" strokeWidth={2} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6 space-y-6">
              {/* Nome */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Nome
                </label>
                <p className="text-base font-medium text-foreground mt-2">
                  {selectedScript.name}
                </p>
              </div>

              {/* Arquivo */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Arquivo
                </label>
                <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-muted rounded border border-border">
                  <FileText className="w-4 h-4 text-primary" strokeWidth={2} />
                  <code className="text-sm font-mono text-foreground">
                    {selectedScript.filename}
                  </code>
                </div>
              </div>

              {/* Autor */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Autor
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <User className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
                  <p className="text-sm text-foreground">{selectedScript.author}</p>
                </div>
              </div>

              {/* Data de Criação */}
              {selectedScript.created_at && (
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Criado em
                  </label>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
                    <p className="text-sm text-foreground">
                      {new Date(selectedScript.created_at).toLocaleDateString(
                        "pt-BR"
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Descrição */}
              {selectedScript.description && (
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Descrição
                  </label>
                  <p className="text-sm text-foreground mt-2 leading-relaxed">
                    {selectedScript.description}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border p-6 space-y-2">
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
