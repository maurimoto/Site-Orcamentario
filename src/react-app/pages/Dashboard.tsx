import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { 
  Building2, 
  FileText, 
  CreditCard, 
  Settings, 
  LogOut,
  Plus,
  TrendingUp
} from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Card } from "@/react-app/components/ui/card";

interface User {
  id: number;
  email: string;
  name: string;
  is_admin: boolean;
}

interface Subscription {
  id: number;
  plan_id: number;
  status: string;
  start_date: string;
  end_date: string | null;
}

interface Quote {
  id: number;
  project_type: string;
  square_meters: number;
  floors: number;
  estimated_value: number;
  status: string;
  created_at: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPlanPopup, setShowPlanPopup] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showPlanPopup && !target.closest('.plan-popup-container')) {
        setShowPlanPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPlanPopup]);

  useEffect(() => {
    const fetchData = async () => {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        navigate("/login");
        return;
      }

      const userData = JSON.parse(userStr);
      setUser(userData);

      try {
        const token = localStorage.getItem("token");
        
        const [subResponse, quotesResponse] = await Promise.all([
          fetch('/api/subscriptions/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/quotes', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (subResponse.ok) {
          const subData = await subResponse.json();
          setSubscription(subData);
        }

        if (quotesResponse.ok) {
          const quotesData = await quotesResponse.json();
          setQuotes(quotesData);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalValue = quotes.reduce((sum, q) => sum + q.estimated_value, 0);
  const completedQuotes = quotes.filter(q => q.status === "completed").length;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-slate-900">SteelFrame Pro</h1>
                <p className="text-sm text-slate-600">Área do Cliente</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div 
                className="text-right relative cursor-pointer plan-popup-container"
                onClick={() => setShowPlanPopup(!showPlanPopup)}
              >
                <p className="text-sm font-medium text-slate-900 hover:text-blue-600 transition">{user.name}</p>
                <p className="text-xs text-slate-600">{user.email}</p>
                
                {showPlanPopup && subscription && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 p-4 z-50">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-slate-900">Meu Plano</h3>
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        ATIVO
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        <div className="flex-1">
                          <p className="text-xs text-slate-500">Plano Atual</p>
                          <p className="text-sm font-medium text-slate-900">Profissional</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <div className="flex-1">
                          <p className="text-xs text-slate-500">Orçamentos</p>
                          <p className="text-sm font-medium text-slate-900">Ilimitados</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <div className="flex-1">
                          <p className="text-xs text-slate-500">Renovação</p>
                          <p className="text-sm font-medium text-slate-900">
                            {new Date(subscription.end_date || "").toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-slate-200">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/client/subscription");
                        }}
                      >
                        Gerenciar Plano
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-6">
            <button className="py-4 px-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
              Dashboard
            </button>
            <button 
              className="py-4 px-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              onClick={() => navigate("/new-quote")}
            >
              Novo Orçamento
            </button>
            <button 
              className="py-4 px-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              onClick={() => navigate("/client/quotes")}
            >
              Meus Orçamentos
            </button>
            <button 
              className="py-4 px-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              onClick={() => navigate("/client/calculator")}
            >
              Calculadora
            </button>
            <button 
              className="py-4 px-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              onClick={() => navigate("/client/subscription")}
            >
              Assinatura
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Bem-vindo, {user.name}!
          </h2>
          <p className="text-slate-600">
            Gerencie seus projetos e orçamentos em Steel Frame
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-3xl font-bold text-slate-900">{quotes.length}</span>
            </div>
            <h3 className="text-sm font-medium text-slate-600">Total de Orçamentos</h3>
            <p className="text-xs text-slate-500 mt-1">{completedQuotes} concluídos</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-3xl font-bold text-slate-900">
                R$ {(totalValue / 1000).toFixed(0)}k
              </span>
            </div>
            <h3 className="text-sm font-medium text-slate-600">Valor Total</h3>
            <p className="text-xs text-slate-500 mt-1">Em orçamentos gerados</p>
          </Card>


        </div>

        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Ações Rápidas</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 h-auto py-4"
              onClick={() => navigate("/new-quote")}
            >
              <Plus className="w-5 h-5 mr-2" />
              Novo Orçamento
            </Button>
            <Button variant="outline" className="h-auto py-4">
              <FileText className="w-5 h-5 mr-2" />
              Ver Todos os Orçamentos
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4"
              onClick={() => navigate("/client/subscription")}
            >
              <Settings className="w-5 h-5 mr-2" />
              Gerenciar Assinatura
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Orçamentos Recentes</h3>
            <Button variant="ghost" size="sm">Ver Todos</Button>
          </div>

          {quotes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">Nenhum orçamento ainda</p>
              <Button onClick={() => navigate("/new-quote")}>
                Criar Primeiro Orçamento
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                      Tipo
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                      Área (m²)
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                      Valor
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((quote) => (
                    <tr key={quote.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <span className="text-sm font-medium text-slate-900">
                          {quote.project_type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-slate-700">
                          {quote.square_meters} m²
                        </span>
                      </td>
                      <td className="py-3 px-4">
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
                        <span className="text-sm text-slate-600">
                          {new Date(quote.created_at).toLocaleDateString("pt-BR")}
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
