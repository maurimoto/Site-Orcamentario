import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { 
  Building2, 
  LogOut,
  CreditCard,
  TrendingUp,
  DollarSign
} from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Card } from "@/react-app/components/ui/card";

interface User {
  id: number;
  email: string;
  name: string;
  is_admin: boolean;
}

interface SubscriptionDetail {
  id: number;
  client_name: string;
  client_email: string;
  plan_name: string;
  plan_price: number;
  status: string;
  start_date: string;
  next_billing: string;
}

export default function AdminRevenue() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [subscriptions, setSubscriptions] = useState<SubscriptionDetail[]>([]);
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

    setSubscriptions([
      {
        id: 1,
        client_name: "João Silva",
        client_email: "joao@email.com",
        plan_name: "Profissional",
        plan_price: 197,
        status: "active",
        start_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        next_billing: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 2,
        client_name: "Maria Santos",
        client_email: "maria@email.com",
        plan_name: "Empresarial",
        plan_price: 497,
        status: "active",
        start_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        next_billing: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 3,
        client_name: "Pedro Costa",
        client_email: "pedro@email.com",
        plan_name: "Básico",
        plan_price: 97,
        status: "active",
        start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        next_billing: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 4,
        client_name: "Ana Oliveira",
        client_email: "ana@email.com",
        plan_name: "Profissional",
        plan_price: 197,
        status: "active",
        start_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        next_billing: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 5,
        client_name: "Carlos Mendes",
        client_email: "carlos@email.com",
        plan_name: "Profissional",
        plan_price: 197,
        status: "active",
        start_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        next_billing: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 6,
        client_name: "Fernanda Lima",
        client_email: "fernanda@email.com",
        plan_name: "Básico",
        plan_price: 97,
        status: "active",
        start_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        next_billing: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]);

    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.plan_price, 0);
  const activeSubscriptions = subscriptions.filter(sub => sub.status === "active").length;
  
  const planCounts = subscriptions.reduce((acc, sub) => {
    acc[sub.plan_name] = (acc[sub.plan_name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const planRevenue = subscriptions.reduce((acc, sub) => {
    acc[sub.plan_name] = (acc[sub.plan_name] || 0) + sub.plan_price;
    return acc;
  }, {} as Record<string, number>);

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
            <button className="py-4 px-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
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
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Receitas e Assinaturas</h2>
          <p className="text-slate-600">Gerencie assinaturas ativas e acompanhe a receita mensal</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-3xl font-bold text-slate-900">
                {activeSubscriptions}
              </span>
            </div>
            <h3 className="text-sm font-medium text-slate-600">Assinaturas Ativas</h3>
            <p className="text-xs text-slate-500 mt-1">Clientes pagantes</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-3xl font-bold text-slate-900">
                R$ {totalRevenue.toLocaleString("pt-BR")}
              </span>
            </div>
            <h3 className="text-sm font-medium text-slate-600">Receita Mensal (MRR)</h3>
            <p className="text-xs text-slate-500 mt-1">Monthly Recurring Revenue</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-3xl font-bold text-slate-900">
                R$ {(totalRevenue / activeSubscriptions).toFixed(0)}
              </span>
            </div>
            <h3 className="text-sm font-medium text-slate-600">Ticket Médio</h3>
            <p className="text-xs text-slate-500 mt-1">Por assinante</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Distribuição por Plano</h3>
            </div>
            <div className="space-y-4">
              {Object.entries(planCounts).map(([planName, count]) => (
                <div key={planName}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900">{planName}</span>
                      <span className="text-xs text-slate-500">({count} clientes)</span>
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      R$ {planRevenue[planName].toLocaleString("pt-BR")}/mês
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        planName === "Básico" ? "bg-blue-600" :
                        planName === "Profissional" ? "bg-green-600" :
                        "bg-purple-600"
                      }`}
                      style={{ width: `${(count / activeSubscriptions) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Resumo Financeiro</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-slate-700">Receita Mensal Recorrente</span>
                <span className="text-lg font-bold text-green-600">
                  R$ {totalRevenue.toLocaleString("pt-BR")}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-slate-700">Receita Anual Projetada</span>
                <span className="text-lg font-bold text-blue-600">
                  R$ {(totalRevenue * 12).toLocaleString("pt-BR")}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm text-slate-700">Crescimento Mensal</span>
                <span className="text-lg font-bold text-purple-600">+15%</span>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Clientes e Planos Assinados</h3>
            <div className="text-sm text-slate-600">
              Total: {activeSubscriptions} assinaturas
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Cliente</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Plano</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Valor</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Início</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Próximo Pagamento</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((subscription) => (
                  <tr key={subscription.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {subscription.client_name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {subscription.client_email}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        subscription.plan_name === "Básico" ? "bg-blue-100 text-blue-700" :
                        subscription.plan_name === "Profissional" ? "bg-green-100 text-green-700" :
                        "bg-purple-100 text-purple-700"
                      }`}>
                        {subscription.plan_name}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-medium text-slate-900">
                        R$ {subscription.plan_price.toLocaleString("pt-BR")}/mês
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-slate-700">
                        {new Date(subscription.start_date).toLocaleDateString("pt-BR")}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-slate-700">
                        {new Date(subscription.next_billing).toLocaleDateString("pt-BR")}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Ativo
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
