import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Building2, LogOut, Calculator, ArrowLeft, CreditCard, FileText, TrendingUp } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Card } from "@/react-app/components/ui/card";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";

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

export default function NewQuote() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [showPlanPopup, setShowPlanPopup] = useState(false);
  const [formData, setFormData] = useState({
    project_type: "residencial",
    square_meters: "",
    floors: "1",
    finish_type: "padrao",
    location: "",
    observations: "",
  });
  const [calculatedValue, setCalculatedValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

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
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(userStr);
    setUser(userData);
    
    setSubscription({
      id: 1,
      plan_id: 2,
      status: "active",
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const calculateQuote = () => {
    const squareMeters = parseFloat(formData.square_meters) || 0;
    const floors = parseInt(formData.floors) || 1;

    // Regras de cálculo baseadas no banco de dados
    const baseCostPerM2 = 1200.0;
    
    // Multiplicadores por tipo de projeto
    const projectMultipliers: { [key: string]: number } = {
      residencial: 1.0,
      comercial: 1.2,
      industrial: 0.9,
    };

    // Multiplicadores por tipo de acabamento
    const finishMultipliers: { [key: string]: number } = {
      basico: 0.85,
      padrao: 1.0,
      premium: 1.35,
    };

    // Custo adicional por pavimento
    const additionalFloorCost = 150.0;

    const projectMultiplier = projectMultipliers[formData.project_type] || 1.0;
    const finishMultiplier = finishMultipliers[formData.finish_type] || 1.0;

    const baseCost = squareMeters * baseCostPerM2;
    const floorCost = (floors - 1) * additionalFloorCost * squareMeters;
    const totalCost = (baseCost + floorCost) * projectMultiplier * finishMultiplier;

    setCalculatedValue(totalCost);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    calculateQuote();

    setTimeout(() => {
      setLoading(false);
      alert("Orçamento calculado com sucesso!");
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setCalculatedValue(null);
  };

  if (!user) {
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
                          navigate("/plans");
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

      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Dashboard
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Novo Orçamento</h2>
                  <p className="text-sm text-slate-600">Preencha os dados do seu projeto</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="project_type" className="text-sm font-medium text-slate-700 mb-2 block">
                    Tipo de Projeto
                  </Label>
                  <select
                    id="project_type"
                    name="project_type"
                    value={formData.project_type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="residencial">Residencial</option>
                    <option value="comercial">Comercial</option>
                    <option value="industrial">Industrial</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="square_meters" className="text-sm font-medium text-slate-700 mb-2 block">
                      Área Total (m²)
                    </Label>
                    <Input
                      id="square_meters"
                      name="square_meters"
                      type="number"
                      value={formData.square_meters}
                      onChange={handleChange}
                      placeholder="Ex: 120"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="floors" className="text-sm font-medium text-slate-700 mb-2 block">
                      Número de Pavimentos
                    </Label>
                    <Input
                      id="floors"
                      name="floors"
                      type="number"
                      value={formData.floors}
                      onChange={handleChange}
                      placeholder="Ex: 2"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="finish_type" className="text-sm font-medium text-slate-700 mb-2 block">
                    Tipo de Acabamento
                  </Label>
                  <select
                    id="finish_type"
                    name="finish_type"
                    value={formData.finish_type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="basico">Básico (-15%)</option>
                    <option value="padrao">Padrão</option>
                    <option value="premium">Premium (+35%)</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="location" className="text-sm font-medium text-slate-700 mb-2 block">
                    Localização
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Cidade, Estado"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="observations" className="text-sm font-medium text-slate-700 mb-2 block">
                    Observações (Opcional)
                  </Label>
                  <textarea
                    id="observations"
                    name="observations"
                    value={formData.observations}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Detalhes adicionais sobre o projeto..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg"
                  disabled={loading}
                >
                  {loading ? "Calculando..." : "Calcular Orçamento"}
                </Button>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Resumo do Orçamento</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between py-2 border-b border-slate-200">
                  <span className="text-sm text-slate-600">Tipo de Projeto:</span>
                  <span className="text-sm font-medium text-slate-900 capitalize">
                    {formData.project_type || "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-200">
                  <span className="text-sm text-slate-600">Área Total:</span>
                  <span className="text-sm font-medium text-slate-900">
                    {formData.square_meters || "0"} m²
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-200">
                  <span className="text-sm text-slate-600">Pavimentos:</span>
                  <span className="text-sm font-medium text-slate-900">
                    {formData.floors || "0"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-200">
                  <span className="text-sm text-slate-600">Acabamento:</span>
                  <span className="text-sm font-medium text-slate-900 capitalize">
                    {formData.finish_type === "basico" ? "Básico" : 
                     formData.finish_type === "padrao" ? "Padrão" : 
                     "Premium"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-200">
                  <span className="text-sm text-slate-600">Localização:</span>
                  <span className="text-sm font-medium text-slate-900">
                    {formData.location || "-"}
                  </span>
                </div>
              </div>

              {calculatedValue !== null && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700 mb-2">Valor Estimado</p>
                  <p className="text-3xl font-bold text-blue-900">
                    R$ {calculatedValue.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    R$ {(calculatedValue / parseFloat(formData.square_meters || "1")).toFixed(2)} por m²
                  </p>
                </div>
              )}

              {!calculatedValue && (
                <div className="p-4 bg-slate-100 rounded-lg text-center">
                  <Calculator className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">
                    Preencha o formulário e clique em "Calcular Orçamento"
                  </p>
                </div>
              )}

              <Card className="p-4 mt-6 bg-green-50 border-green-200">
                <p className="text-xs text-green-800">
                  <strong>💡 Dica:</strong> O orçamento é calculado com base nas regras
                  configuradas e serve como estimativa inicial. Valores podem variar
                  conforme especificações do projeto.
                </p>
              </Card>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
