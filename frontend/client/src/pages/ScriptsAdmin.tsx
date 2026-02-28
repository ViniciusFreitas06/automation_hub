import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2, Upload, Code2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { apiConfig } from "@/lib/api";
import { useLocation } from "wouter";

interface Script {
  id: number;
  name: string;
  description?: string;
  author: string;
  filename: string;
}

export default function ScriptAdmin() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const fetchScripts = async () => {
    try {
      const response = await api.get(apiConfig.endpoints.scripts.list);
      setScripts(response.data);
    } catch {
      toast.error("Erro ao carregar scripts");
    }
  };

  useEffect(() => {
    fetchScripts();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !file) {
      toast.error("Informe nome e arquivo");
      return;
    }

    if (!file.name.endsWith(".py")) {
      toast.error("Somente arquivos .py são permitidos");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("file", file);

    try {
      setLoading(true);

      await api.post(apiConfig.endpoints.scripts.upload, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Script enviado com sucesso");

      setName("");
      setDescription("");
      setFile(null);

      fetchScripts();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Erro ao enviar script");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este script?")) return;

    try {
      await api.delete(apiConfig.endpoints.scripts.delete(id));
      toast.success("Script removido");
      fetchScripts();
    } catch {
      toast.error("Erro ao excluir script");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-background space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between max-w-5xl">
        <div className="flex items-center gap-2">
          <Code2 className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Área DEV — Scripts</h1>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setLocation("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Home
        </Button>
      </div>

      {/* Upload */}
      <Card className="max-w-xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Code2 className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Upload de Script</h2>
        </div>

        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <Label>Nome</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Limpeza de planilha"
            />
          </div>

          <div>
            <Label>Descrição</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Opcional"
            />
          </div>

          <div>
            <Label>Arquivo (.py)</Label>
            <Input
              type="file"
              accept=".py"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <Button className="w-full" disabled={loading}>
            {loading ? "Enviando..." : (
              <span className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Enviar Script
              </span>
            )}
          </Button>
        </form>
      </Card>

      {/* Lista */}
      <Card className="p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Scripts cadastrados</h2>

        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Nome</th>
                <th className="text-left p-2">Descrição</th>
                <th className="text-left p-2">Autor</th>
                <th className="text-left p-2">Arquivo</th>
                <th className="text-center p-2">Ações</th>
              </tr>
            </thead>

            <tbody>
              {scripts.map((script) => (
                <tr key={script.id} className="border-b hover:bg-muted/50">
                  <td className="p-2">{script.name}</td>
                  <td className="p-2">{script.description || "-"}</td>
                  <td className="p-2">{script.author}</td>
                  <td className="p-2">{script.filename}</td>
                  <td className="p-2 text-center">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(script.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}

              {scripts.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-6 text-muted-foreground">
                    Nenhum script cadastrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}