import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Building2, LogOut, FileText, Eye, Download, Filter } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Card } from "@/react-app/components/ui/card";
import { Input } from "@/react-app/components/ui/input";

interface User {
  id: number;
  email: string;
  name: string;
  is_admin: boolean;
}

interface Quote {
  id: number;
  user_name: string;
  user_email: string;
  project_type: string;
  square_meters: number;
  floors: number;
  finish_type: string;
  location: string;
  estimated_value: number;
  status: string;
  created_at: string;
}

export default function AdminQuotes() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
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

    setQuotes([
      {
        id: 1,
        user_name: "João Silva",
        user_email: "joao@email.com",
        project_type: "Residencial",
        square_meters: 120,
        floors: 2,
        finish_type: "Padrão",
        location: "São Paulo, SP",
        estimated_value: 245000,
        status: "completed",
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 2,
        user_name: "Maria Santos",
        user_email: "maria@email.com",
        project_type: "Comercial",
        square_meters: 350,
        floors: 1,
        finish_type: "Premium",
        location: "Rio de Janeiro, RJ",
        estimated_value: 580000,
        status: "completed",
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 3,
        user_name: "Pedro Costa",
        user_email: "pedro@email.com",
        project_type: "Industrial",
        square_meters: 800,
        floors: 1,
        finish_type: "Básico",
        location: "Belo Horizonte, MG",
        estimated_value: 890000,
        status: "completed",
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 4,
        user_name: "Ana Oliveira",
        user_email: "ana@email.com",
        project_type: "Residencial",
        square_meters: 180,
        floors: 3,
        finish_type: "Premium",
        location: "Curitiba, PR",
        estimated_value: 420000,
        status: "draft",
        created_at: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 5,
        user_name: "Carlos Mendes",
        user_email: "carlos@email.com",
        project_type: "Comercial",
        square_meters: 450,
        floors: 2,
        finish_type: "Padrão",
        location: "Porto Alegre, RS",
        estimated_value: 670000,
        status: "completed",
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]);

    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const filteredQuotes = quotes.filter((quote) => {
    const matchesSearch =
      quote.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.project_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || quote.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const totalValue = filteredQuotes.reduce((sum, q) => sum + q.estimated_value, 0);
  const completedCount = filteredQuotes.filter(q => q.status === "completed").length;

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-50 overflow-x-hidden">
        <div className="container mx-auto px-4 py-4 max-w-full">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 flex-shrink-0 min-w-0">
              <Building2 className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-slate-900 whitespace-nowrap">SteelFrame Pro</h1>
                <p className="text-sm text-slate-600 whitespace-nowrap">Painel Administrativo</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900 truncate max-w-[150px]">{user.name}</p>
                <p className="text-xs text-slate-600 truncate max-w-[150px]">{user.email}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b overflow-x-hidden">
        <div className="container mx-auto px-4">
          <nav className="flex gap-6 overflow-x-auto">
            <button 
              className="py-4 px-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              onClick={() => navigate("/admin")}
            >
              Dashboard
            </button>
            <button 
              className="py-4 px-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              onClick={() => navigate("/admin/clients")}
            >
              Clientes
            </button>
            <button className="py-4 px-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Orçamentos</h2>
          <p className="text-slate-600">Visualize e gerencie todos os orçamentos gerados</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="p-6">
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {filteredQuotes.length}
            </div>
            <p className="text-sm text-slate-600">Total de Orçamentos</p>
          </Card>

          <Card className="p-6">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {completedCount}
            </div>
            <p className="text-sm text-slate-600">Concluídos</p>
          </Card>

          <Card className="p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              R$ {(totalValue / 1000).toFixed(0)}k
            </div>
            <p className="text-sm text-slate-600">Valor Total</p>
          </Card>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <Input
                type="text"
                placeholder="Buscar por cliente, tipo ou localização..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-md text-sm"
              >
                <option value="all">Todos</option>
                <option value="completed">Concluídos</option>
                <option value="draft">Rascunhos</option>
              </select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Cliente</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Projeto</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Área</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Localização</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Valor</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="text-sm font-medium text-slate-900">{quote.user_name}</div>
                        <div className="text-xs text-slate-500">{quote.user_email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="text-sm font-medium text-slate-900">{quote.project_type}</div>
                        <div className="text-xs text-slate-500">{quote.floors} piso(s) • {quote.finish_type}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-slate-700">{quote.square_meters} m²</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-slate-700">{quote.location}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-medium text-slate-900">
                        R$ {quote.estimated_value.toLocaleString("pt-BR")}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          quote.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {quote.status === "completed" ? "Concluído" : "Rascunho"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredQuotes.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">Nenhum orçamento encontrado</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
