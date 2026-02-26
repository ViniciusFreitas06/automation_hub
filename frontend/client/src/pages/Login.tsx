import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Code2 } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import api from "@/lib/axios";
import { apiConfig } from "@/lib/api";
import { setToken } from "@/lib/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Informe email e senha");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(apiConfig.endpoints.auth.login, {
        email,
        password,
      });


      setToken(response.data.access_token);


      toast.success("Login realizado com sucesso");

      setLocation("/");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.detail || "Usuário ou senha inválidos"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-sm p-8 shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
            <Code2 className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold">Automation Hub</h1>
          <p className="text-sm text-muted-foreground">
            Acesso ao sistema
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <Label>Senha</Label>
            <Input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button className="w-full" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

      </Card>
    </div>
  );
}