import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Building2, Check, Sparkles } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Card } from "@/react-app/components/ui/card";

interface Plan {
  id: number;
  name: string;
  description: string;
  price_monthly: number;
  max_quotes_per_month: number | null;
  features: string;
  is_active: number;
}

export default function Plans() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("/api/plans");
        if (response.ok) {
          const data = await response.json();
          
          const freePlan: Plan = {
            id: 0,
            name: "Teste Gratuito",
            description: "Experimente por 7 dias grátis",
            price_monthly: 0,
            max_quotes_per_month: 4,
            features: "4 orçamentos|Acesso por 7 dias|Suporte básico|Histórico de projetos|Sem cobrança no teste",
            is_active: 1,
          };
          
          setPlans([freePlan, ...data]);
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSelectPlan = (plan: Plan) => {
    const queryParams = new URLSearchParams({
      planId: plan.id.toString(),
      planName: plan.name,
      price: plan.price_monthly.toString(),
      isTrial: plan.price_monthly === 0 ? 'true' : 'false'
    });
    
    navigate(`/register?${queryParams.toString()}`);
  };

  const parseFeatures = (features: string): string[] => {
    if (!features) return [];
    return features.split("|");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <Building2 className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              SteelFrame Pro
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
          >
            Voltar
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Escolha seu Plano
            </h1>
            <p className="text-xl text-slate-600">
              Selecione o plano ideal para o seu negócio
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {plans.map((plan, index) => {
                const features = parseFeatures(plan.features);
                const isPopular = index === 2;
                const isFree = plan.price_monthly === 0;
                const isSelected = selectedPlanId === plan.id;

                return (
                  <Card
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`p-8 relative cursor-pointer ${
                      isSelected
                        ? "border-2 border-blue-500 shadow-xl"
                        : "border-slate-200 hover:shadow-xl"
                    } transition`}
                  >
                    {isFree && (
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Grátis
                      </div>
                    )}
                    {isPopular && !isFree && (
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Mais Popular
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold mb-2 text-slate-900">
                        {plan.name}
                      </h3>
                      <p className="text-sm text-slate-600 mb-4">
                        {plan.description}
                      </p>
                      <div className="text-4xl font-bold text-blue-600 mb-1">
                        {isFree ? "Grátis" : `R$ ${plan.price_monthly.toFixed(2)}`}
                      </div>
                      <div className="text-sm text-slate-600">
                        {isFree ? "por 7 dias" : "por mês"}
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-green-600" />
                          </div>
                          <span className="text-sm text-slate-700">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full ${
                        isFree
                          ? "bg-green-600 hover:bg-green-700"
                          : isSelected
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-slate-900 hover:bg-slate-800"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPlan(plan);
                      }}
                    >
                      {isFree ? "Começar Grátis" : "Assinar Agora"}
                    </Button>
                  </Card>
                );
              })}
            </div>
          )}

          <div className="mt-12 text-center">
            <Card className="p-6 max-w-2xl mx-auto bg-blue-50 border-blue-200">
              <p className="text-sm text-blue-900 mb-2">
                💡 Plano Gratuito por 7 dias
              </p>
              <p className="text-xs text-blue-700">
                Cartão necessário para validação • Sem cobrança durante o teste • Cancele a qualquer momento
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
