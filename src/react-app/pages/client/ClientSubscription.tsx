import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { 
  Building2, 
  LogOut, 
  CreditCard, 
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Crown
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
  plan: string;
  status: string;
  quotesUsed: number;
  quotesLimit: number | null;
  startDate: string;
  endDate: string | null;
  nextBillingDate: string | null;
  price: number;
}

export default function ClientSubscription() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

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
        const response = await fetch('/api/subscriptions/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setSubscription(data);
        }
      } catch (error) {
        console.error('Erro ao buscar assinatura:', error);
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

  const handleUpgrade = async (planName: string) => {
    try {
      const planIds: Record<string, number> = {
        "Básico": 1,
        "Profissional": 2,
        "Empresarial": 3
      };

      const planId = planIds[planName];
      if (!planId) return;

      const token = localStorage.getItem("token");
      const response = await fetch('/api/payments/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ planId })
      });

      const data = await response.json();
      
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert("Erro ao processar pagamento. Tente novamente.");
      }
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      alert("Erro ao processar pagamento. Tente novamente.");
    }
  };

  const getPlanColor = (plan: string) => {
    if (plan.includes("Teste")) return "bg-green-100 text-green-700";
    if (plan.includes("Básico")) return "bg-blue-100 text-blue-700";
    if (plan.includes("Profissional")) return "bg-purple-100 text-purple-700";
    if (plan.includes("Empresarial")) return "bg-orange-100 text-orange-700";
    return "bg-slate-100 text-slate-700";
  };

  if (loading || !user || !subscription) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const daysRemaining = subscription.endDate
    ? Math.ceil((new Date(subscription.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const quotesPercentage = subscription.quotesLimit
    ? (subscription.quotesUsed / subscription.quotesLimit) * 100
    : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-50 overflow-x-hidden">
        <div className="container mx-auto px-4 py-4 max-w-full">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 flex-shrink-0 min-w-0">
              <Building2 className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-slate-900 whitespace-nowrap">SteelFrame Pro</h1>
                <p className="text-sm text-slate-600 whitespace-nowrap">Área do Cliente</p>
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

      <nav className="bg-white border-b overflow-x-hidden">
        <div className="container mx-auto px-4">
          <div className="flex gap-6 overflow-x-auto">
            <button 
              className="py-4 px-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              onClick={() => navigate("/dashboard")}
            >
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
            <button className="py-4 px-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
              Assinatura
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Minha Assinatura</h2>
          <p className="text-slate-600">Gerencie seu plano e acompanhe o uso</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Plano Atual</h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-slate-900">{subscription.plan}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPlanColor(subscription.plan)}`}>
                    {subscription.status === "active" ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {subscription.price === 0 ? "Grátis" : `R$ ${subscription.price}`}
                </div>
                {subscription.price > 0 && (
                  <div className="text-sm text-slate-600">/mês</div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Data de Início</p>
                    <p className="text-sm text-slate-600">
                      {new Date(subscription.startDate).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                {daysRemaining !== null && daysRemaining > 0 && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">{daysRemaining} dias</p>
                    <p className="text-xs text-slate-600">restantes</p>
                  </div>
                )}
              </div>

              {subscription.endDate && (
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        {subscription.plan.includes("Teste") ? "Teste expira em" : "Renovação em"}
                      </p>
                      <p className="text-sm text-blue-700">
                        {new Date(subscription.endDate).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-slate-600" />
              <h3 className="text-lg font-semibold text-slate-900">Uso Mensal</h3>
            </div>
            
            <div className="mb-4">
              <div className="flex items-end justify-between mb-2">
                <span className="text-sm text-slate-600">Orçamentos</span>
                <span className="text-2xl font-bold text-slate-900">
                  {subscription.quotesUsed}
                  {subscription.quotesLimit !== null && (
                    <span className="text-sm text-slate-600 font-normal">
                      /{subscription.quotesLimit}
                    </span>
                  )}
                </span>
              </div>
              
              {subscription.quotesLimit !== null && (
                <>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        quotesPercentage >= 80 ? "bg-red-600" : 
                        quotesPercentage >= 60 ? "bg-yellow-600" : 
                        "bg-green-600"
                      }`}
                      style={{ width: `${Math.min(quotesPercentage, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {subscription.quotesLimit - subscription.quotesUsed} orçamentos restantes
                  </p>
                </>
              )}
              
              {subscription.quotesLimit === null && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Ilimitado</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card 
            data-plan="Básico"
            className={`p-6 hover:shadow-lg transition cursor-pointer ${
              selectedPlan === "Básico" ? "border-2 border-blue-600" : "border"
            }`}
            onClick={() => setSelectedPlan("Básico")}
          >
            <div className="mb-4">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Básico</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-blue-600">R$ 49</span>
                <span className="text-sm text-slate-600">/mês</span>
              </div>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                20 orçamentos/mês
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Suporte por email
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Histórico de projetos
              </li>
            </ul>
            <Button 
              className={`w-full ${
                selectedPlan === "Básico" 
                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                  : ""
              }`}
              variant={selectedPlan === "Básico" ? "default" : "outline"}
              onClick={(e) => {
                e.stopPropagation();
                if (subscription.plan !== "Básico") {
                  handleUpgrade("Básico");
                }
              }}
              disabled={subscription.plan === "Básico"}
            >
              {subscription.plan === "Básico" ? "Plano Atual" : "Fazer Upgrade"}
            </Button>
          </Card>

          <Card 
            className={`p-6 hover:shadow-lg transition relative cursor-pointer ${
              selectedPlan === "Profissional" ? "border-2 border-blue-600" : "border"
            }`}
            onClick={() => setSelectedPlan("Profissional")}
          >
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Mais Popular
            </div>
            <div className="mb-4 mt-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Profissional</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-blue-600">R$ 149</span>
                <span className="text-sm text-slate-600">/mês</span>
              </div>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Orçamentos ilimitados
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Suporte prioritário
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Relatórios avançados
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                API de integração
              </li>
            </ul>
            <Button 
              className={`w-full ${
                selectedPlan === "Profissional" 
                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                  : ""
              }`}
              variant={selectedPlan === "Profissional" ? "default" : "outline"}
              onClick={(e) => {
                e.stopPropagation();
                if (subscription.plan !== "Profissional") {
                  handleUpgrade("Profissional");
                }
              }}
              disabled={subscription.plan === "Profissional"}
            >
              {subscription.plan === "Profissional" ? "Plano Atual" : "Fazer Upgrade"}
              {selectedPlan === "Profissional" && subscription.plan !== "Profissional" && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </Card>

          <Card 
            className={`p-6 hover:shadow-lg transition cursor-pointer ${
              selectedPlan === "Empresarial" ? "border-2 border-blue-600" : "border"
            }`}
            onClick={() => setSelectedPlan("Empresarial")}
          >
            <div className="mb-4">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Empresarial</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-blue-600">R$ 399</span>
                <span className="text-sm text-slate-600">/mês</span>
              </div>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Tudo do Profissional
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Multi-usuários
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Customização avançada
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Suporte dedicado
              </li>
            </ul>
            <Button 
              className={`w-full ${
                selectedPlan === "Empresarial" 
                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                  : ""
              }`}
              variant={selectedPlan === "Empresarial" ? "default" : "outline"}
              onClick={(e) => {
                e.stopPropagation();
                if (subscription.plan !== "Empresarial") {
                  handleUpgrade("Empresarial");
                }
              }}
              disabled={subscription.plan === "Empresarial"}
            >
              {subscription.plan === "Empresarial" ? "Plano Atual" : "Fazer Upgrade"}
            </Button>
          </Card>
        </div>

        {subscription.plan.includes("Teste") && (
          <Card className="p-6 mt-8 bg-yellow-50 border-yellow-200">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                  Seu período de teste está ativo
                </h3>
                <p className="text-sm text-yellow-800 mb-4">
                  Você tem {daysRemaining} dias restantes para aproveitar todos os recursos gratuitamente. 
                  Após o período de teste, escolha um plano para continuar usando a plataforma.
                </p>
                <Button 
                  className="bg-yellow-600 hover:bg-yellow-700"
                  onClick={() => {
                    const firstAvailablePlan = document.querySelector('[data-plan]');
                    firstAvailablePlan?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                >
                  Escolher Plano Agora
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
