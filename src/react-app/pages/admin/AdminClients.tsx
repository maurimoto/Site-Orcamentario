import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Building2, LogOut, Users, Search, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Card } from "@/react-app/components/ui/card";
import { Input } from "@/react-app/components/ui/input";

interface User {
  id: number;
  email: string;
  name: string;
  is_admin: boolean;
}

interface Client {
  id: number;
  email: string;
  name: string;
  phone: string;
  is_active: boolean;
  plan_name: string;
  created_at: string;
}

export default function AdminClients() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(userStr);
    if (!userData.is_admin) {
      navigate("/dashboard");
      return;
    }

    setUser(userData);

    // Dados simulados
    setClients([
      {
        id: 1,
        email: "joao.silva@email.com",
        name: "João Silva",
        phone: "(11) 98765-4321",
        is_active: true,
        plan_name: "Profissional",
        created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 2,
        email: "maria.santos@email.com",
        name: "Maria Santos",
        phone: "(21) 97654-3210",
        is_active: true,
        plan_name: "Empresarial",
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 3,
        email: "pedro.costa@email.com",
        name: "Pedro Costa",
        phone: "(31) 96543-2109",
        is_active: true,
        plan_name: "Básico",
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 4,
        email: "ana.oliveira@email.com",
        name: "Ana Oliveira",
        phone: "(41) 95432-1098",
        is_active: false,
        plan_name: "Profissional",
        created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]);

    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-slate-900">SteelFrame Pro</h1>
                <p className="text-sm text-slate-600">Painel Administrativo</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-600">{user.email}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <nav className="flex gap-6">
            <button 
              className="py-4 px-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              onClick={() => navigate("/admin")}
            >
              Dashboard
            </button>
            <button className="py-4 px-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
              Clientes
            </button>
            <button 
              className="py-4 px-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              onClick={() => navigate("/admin/quotes")}
            >
              Orçamentos
            </button>
            <button 
              className="py-4 px-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              onClick={() => navigate("/admin/rules")}
            >
              Regras de Cálculo
            </button>
            <button 
              className="py-4 px-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              onClick={() => navigate("/admin/calculator")}
            >
              Calculadora
            </button>
            <button 
              className="py-4 px-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              onClick={() => navigate("/admin/revenue")}
            >
              Receitas
            </button>
            <button 
              className="py-4 px-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              onClick={() => navigate("/admin/settings")}
            >
              Configurações
            </button>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Gestão de Clientes</h2>
            <p className="text-slate-600">Gerencie todos os clientes da plataforma</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filtros</Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Cliente</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Telefone</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Plano</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Cadastro</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="text-sm font-medium text-slate-900">{client.name}</div>
                        <div className="text-xs text-slate-500">{client.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-slate-700">{client.phone}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {client.plan_name}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          client.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {client.is_active ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-slate-600">
                        {new Date(client.created_at).toLocaleDateString("pt-BR")}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">Nenhum cliente encontrado</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
