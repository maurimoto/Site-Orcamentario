import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { 
  Building2, 
  Users, 
  FileText, 
  LogOut,
  Settings,
  Calculator
} from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Card } from "@/react-app/components/ui/card";

interface User {
  id: number;
  email: string;
  name: string;
  is_admin: boolean;
}

interface DashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalQuotes: number;
  quotesThisMonth: number;
  estimatedRevenue: number;
  recentQuotes: Array<{
    id: number;
    user_name: string;
    user_email: string;
    project_type: string;
    estimated_value: number;
    created_at: string;
  }>;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

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

    setStats({
      totalUsers: 127,
      activeSubscriptions: 89,
      totalQuotes: 456,
      quotesThisMonth: 87,
      estimatedRevenue: 17460,
      recentQuotes: [
        {
          id: 1,
          user_name: "João Silva",
          user_email: "joao@email.com",
          project_type: "Residencial",
          estimated_value: 245000,
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 2,
          user_name: "Maria Santos",
          user_email: "maria@email.com",
          project_type: "Comercial",
          estimated_value: 580000,
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 3,
          user_name: "Pedro Costa",
          user_email: "pedro@email.com",
          project_type: "Industrial",
          estimated_value: 890000,
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
    });

    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Erro</h2>
          <p className="text-slate-700 mb-4">{error}</p>
          <Button onClick={() => navigate("/dashboard")}>
            Voltar ao Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  if (!user) return null;

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
            <button className="py-4 px-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
              Dashboard
            </button>
            <button 
              className="py-4 px-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              onClick={() => navigate("/admin/clients")}
            >
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Visão Geral
          </h2>
          <p className="text-slate-600">
            Acompanhe as métricas e o desempenho da plataforma
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-3xl font-bold text-slate-900">
                {stats?.totalUsers || 0}
              </span>
            </div>
            <h3 className="text-sm font-medium text-slate-600">Total de Clientes</h3>
            <p className="text-xs text-slate-500 mt-1">+12 este mês</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-slate-900 block">
                  {stats?.quotesThisMonth || 0}
                </span>
                <span className="text-xs text-slate-500">
                  de {stats?.totalQuotes || 0} total
                </span>
              </div>
            </div>
            <h3 className="text-sm font-medium text-slate-600">Orçamentos (Mês)</h3>
            <p className="text-xs text-slate-500 mt-1">+23% vs mês anterior</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Ações Rápidas
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-auto py-4 flex-col gap-2"
                onClick={() => navigate("/admin/clients")}
              >
                <Users className="w-6 h-6" />
                <span className="text-sm">Ver Clientes</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex-col gap-2"
                onClick={() => navigate("/admin/quotes")}
              >
                <FileText className="w-6 h-6" />
                <span className="text-sm">Orçamentos</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex-col gap-2"
                onClick={() => navigate("/admin/rules")}
              >
                <Calculator className="w-6 h-6" />
                <span className="text-sm">Regras</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex-col gap-2"
                onClick={() => navigate("/admin/settings")}
              >
                <Settings className="w-6 h-6" />
                <span className="text-sm">Configurações</span>
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Distribuição de Planos
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-700">Básico</span>
                  <span className="text-sm font-medium text-slate-900">23 (26%)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "26%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-700">Profissional</span>
                  <span className="text-sm font-medium text-slate-900">51 (57%)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "57%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-700">Empresarial</span>
                  <span className="text-sm font-medium text-slate-900">15 (17%)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: "17%" }}></div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Orçamentos Recentes
            </h2>
            <Button variant="ghost" size="sm">
              Ver Todos
            </Button>
          </div>

          {!stats?.recentQuotes || stats.recentQuotes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">Nenhum orçamento ainda</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                      Cliente
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                      Tipo de Projeto
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">
                      Valor Estimado
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentQuotes.map((quote) => (
                    <tr key={quote.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="text-sm font-medium text-slate-900">
                            {quote.user_name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {quote.user_email}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-slate-700 capitalize">
                          {quote.project_type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm font-medium text-slate-900">
                          R$ {quote.estimated_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm text-slate-600">
                          {new Date(quote.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
