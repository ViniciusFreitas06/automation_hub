import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/lib/axios";
import { apiConfig } from "@/lib/api";
import { UserPlus, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    try {
      setLoading(true);

      await api.post(apiConfig.endpoints.auth.register, {
        name,
        email,
        password,
      });

      toast.success("Usuário cadastrado com sucesso");

      setLocation("/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Erro ao cadastrar usuário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6 shadow-lg space-y-6">
        <div className="flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Criar Conta</h1>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <Label>Nome</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <Label>Senha</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>

          <Button className="w-full" disabled={loading}>
            {loading ? "Criando conta..." : "Registrar"}
          </Button>
        </form>

        <Button
          variant="outline"
          onClick={() => setLocation("/login")}
          className="w-full flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Login
        </Button>
      </Card>
    </div>
  );
}