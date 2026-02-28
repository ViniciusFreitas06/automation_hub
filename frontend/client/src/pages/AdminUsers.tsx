import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/lib/axios";
import { apiConfig } from "@/lib/api";
import { ArrowLeft, Users } from "lucide-react";
import { useLocation } from "wouter";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const fetchUsers = async () => {
    try {
      const res = await api.get(apiConfig.endpoints.admin.listUsers);
      setUsers(res.data);
    } catch {
      toast.error("Erro ao carregar usuários");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (email: string, role: string) => {
    try {
      setLoading(true);

      await api.put(apiConfig.endpoints.admin.changeRole(email), null, {
        params: { role },
      });

      toast.success("Permissão atualizada");
      fetchUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Erro ao atualizar permissão");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-background space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between max-w-5xl">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Área Admin — Usuários</h1>
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

      {/* Tabela */}
      <Card className="p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">
          Gerenciamento de Permissões
        </h2>

        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Nome</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Permissão</th>
                <th className="text-center p-2">Ação</th>
              </tr>
            </thead>

            <tbody>
              {users
                .filter((user) => user.role !== "admin")
                .map((user) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-muted/40"
                  >
                    <td className="p-2">{user.name}</td>
                    <td className="p-2 font-mono">{user.email}</td>

                    <td className="p-2 w-40">
                      <Select
                        value={user.role}
                        onValueChange={(value) =>
                          setUsers((prev) =>
                            prev.map((u) =>
                              u.id === user.id
                                ? { ...u, role: value }
                                : u
                            )
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="dev">Dev</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>

                    <td className="p-2 text-center">
                      <Button
                        size="sm"
                        onClick={() =>
                          updateRole(user.email, user.role)
                        }
                        disabled={loading}
                      >
                        Salvar
                      </Button>
                    </td>
                  </tr>
                ))}

              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-6 text-center text-muted-foreground"
                  >
                    Nenhum usuário cadastrado
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