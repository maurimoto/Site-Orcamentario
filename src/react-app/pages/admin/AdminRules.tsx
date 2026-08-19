import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Building2, LogOut, Calculator, Edit, Plus, Trash2 } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Card } from "@/react-app/components/ui/card";

interface User {
  id: number;
  email: string;
  name: string;
  is_admin: boolean;
}

interface Rule {
  id: number;
  rule_name: string;
  rule_type: string;
  base_value: number;
  multiplier: number;
  conditions: string;
  is_active: boolean;
}

export default function AdminRules() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [rules, setRules] = useState<Rule[]>([]);
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

    setRules([
      {
        id: 1,
        rule_name: "Custo Base por M²",
        rule_type: "base_cost",
        base_value: 1200.0,
        multiplier: 1.0,
        conditions: '{"project_type": "all"}',
        is_active: true,
      },
      {
        id: 2,
        rule_name: "Multiplicador - Residencial",
        rule_type: "project_multiplier",
        base_value: 0,
        multiplier: 1.0,
        conditions: '{"project_type": "residencial"}',
        is_active: true,
      },
      {
        id: 3,
        rule_name: "Multiplicador - Comercial",
        rule_type: "project_multiplier",
        base_value: 0,
        multiplier: 1.2,
        conditions: '{"project_type": "comercial"}',
        is_active: true,
      },
      {
        id: 4,
        rule_name: "Multiplicador - Industrial",
        rule_type: "project_multiplier",
        base_value: 0,
        multiplier: 0.9,
        conditions: '{"project_type": "industrial"}',
        is_active: true,
      },
      {
        id: 5,
        rule_name: "Multiplicador - Acabamento Básico",
        rule_type: "finish_multiplier",
        base_value: 0,
        multiplier: 0.85,
        conditions: '{"finish_type": "basico"}',
        is_active: true,
      },
      {
        id: 6,
        rule_name: "Multiplicador - Acabamento Padrão",
        rule_type: "finish_multiplier",
        base_value: 0,
        multiplier: 1.0,
        conditions: '{"finish_type": "padrao"}',
        is_active: true,
      },
      {
        id: 7,
        rule_name: "Multiplicador - Acabamento Premium",
        rule_type: "finish_multiplier",
        base_value: 0,
        multiplier: 1.35,
        conditions: '{"finish_type": "premium"}',
        is_active: true,
      },
      {
        id: 8,
        rule_name: "Custo Adicional por Pavimento",
        rule_type: "floor_cost",
        base_value: 150.0,
        multiplier: 1.0,
        conditions: '{"applies_to": "additional_floors"}',
        is_active: true,
      },
    ]);

    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const getRuleTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      base_cost: "Custo Base",
      project_multiplier: "Multiplicador de Projeto",
      finish_multiplier: "Multiplicador de Acabamento",
      floor_cost: "Custo por Pavimento",
    };
    return types[type] || type;
  };

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
            <button className="py-4 px-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
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
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Regras de Cálculo</h2>
            <p className="text-slate-600">Configure as regras para cálculo automático de orçamentos</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nova Regra
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{rules.length}</div>
                <p className="text-sm text-slate-600">Regras Cadastradas</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {rules.filter(r => r.is_active).length}
                </div>
                <p className="text-sm text-slate-600">Regras Ativas</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {rules.map((rule) => (
            <Card key={rule.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">{rule.rule_name}</h3>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        rule.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {rule.is_active ? "Ativa" : "Inativa"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">
                    {getRuleTypeLabel(rule.rule_type)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {rule.base_value > 0 && (
                  <div className="flex items-center justify-between py-2 border-t border-slate-100">
                    <span className="text-slate-600">Valor Base:</span>
                    <span className="font-medium text-slate-900">
                      R$ {rule.base_value.toFixed(2)}
                    </span>
                  </div>
                )}
                {rule.multiplier !== 1.0 && (
                  <div className="flex items-center justify-between py-2 border-t border-slate-100">
                    <span className="text-slate-600">Multiplicador:</span>
                    <span className="font-medium text-slate-900">
                      {rule.multiplier.toFixed(2)}x
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between py-2 border-t border-slate-100">
                  <span className="text-slate-600">Condições:</span>
                  <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                    {rule.conditions}
                  </code>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 mt-8 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            💡 Como funcionam as regras
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>Custo Base:</strong> Valor base por m² de construção</p>
            <p><strong>Multiplicador de Projeto:</strong> Ajusta o custo conforme o tipo de projeto</p>
            <p><strong>Multiplicador de Acabamento:</strong> Ajusta o custo conforme o nível de acabamento</p>
            <p><strong>Custo por Pavimento:</strong> Valor adicional por pavimento extra</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
