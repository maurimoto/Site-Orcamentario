import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Building2, LogOut, Calculator, Plus, Edit, Trash2, Save, X, Play } from "lucide-react";
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

interface Formula {
  id: number;
  name: string;
  description: string;
  formula: string;
  variables: string[];
  category: string;
  is_active: boolean;
  example_values: { [key: string]: number };
  example_result: number;
}

export default function AdminCalculator() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [editingFormula, setEditingFormula] = useState<Formula | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [testValues, setTestValues] = useState<{ [key: string]: number }>({});
  const [testResult, setTestResult] = useState<number | null>(null);
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

    // Fórmulas predefinidas
    setFormulas([
      {
        id: 1,
        name: "Custo Total Básico",
        description: "Cálculo simples de custo total baseado em área",
        formula: "area * preco_m2",
        variables: ["area", "preco_m2"],
        category: "Básico",
        is_active: true,
        example_values: { area: 100, preco_m2: 1200 },
        example_result: 120000,
      },
      {
        id: 2,
        name: "Custo com Pavimentos",
        description: "Inclui custo adicional por pavimento extra",
        formula: "(area * preco_m2) + ((pavimentos - 1) * area * custo_adicional)",
        variables: ["area", "preco_m2", "pavimentos", "custo_adicional"],
        category: "Avançado",
        is_active: true,
        example_values: { area: 120, preco_m2: 1200, pavimentos: 2, custo_adicional: 150 },
        example_result: 162000,
      },
      {
        id: 3,
        name: "Custo com Multiplicador de Projeto",
        description: "Aplica multiplicador baseado no tipo de projeto",
        formula: "area * preco_m2 * multiplicador_projeto",
        variables: ["area", "preco_m2", "multiplicador_projeto"],
        category: "Intermediário",
        is_active: true,
        example_values: { area: 200, preco_m2: 1200, multiplicador_projeto: 1.2 },
        example_result: 288000,
      },
      {
        id: 4,
        name: "Custo Completo",
        description: "Fórmula completa com todos os fatores",
        formula: "((area * preco_m2) + ((pavimentos - 1) * area * custo_adicional)) * multiplicador_projeto * multiplicador_acabamento",
        variables: ["area", "preco_m2", "pavimentos", "custo_adicional", "multiplicador_projeto", "multiplicador_acabamento"],
        category: "Completo",
        is_active: true,
        example_values: { 
          area: 150, 
          preco_m2: 1200, 
          pavimentos: 2, 
          custo_adicional: 150,
          multiplicador_projeto: 1.2,
          multiplicador_acabamento: 1.35
        },
        example_result: 318870,
      },
      {
        id: 5,
        name: "Custo por M² Personalizado",
        description: "Calcula custo por m² com ajustes personalizados",
        formula: "(base + (complexidade * 100)) * area",
        variables: ["base", "complexidade", "area"],
        category: "Personalizado",
        is_active: true,
        example_values: { base: 1200, complexidade: 3, area: 100 },
        example_result: 150000,
      },
    ]);

    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleEdit = (formula: Formula) => {
    setEditingFormula({ ...formula });
    setTestValues(formula.example_values);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingFormula({
      id: Date.now(),
      name: "",
      description: "",
      formula: "",
      variables: [],
      category: "Personalizado",
      is_active: true,
      example_values: {},
      example_result: 0,
    });
    setTestValues({});
    setTestResult(null);
    setIsCreating(true);
  };

  const handleSave = () => {
    if (!editingFormula) return;

    if (isCreating) {
      setFormulas([...formulas, editingFormula]);
    } else {
      setFormulas(formulas.map(f => f.id === editingFormula.id ? editingFormula : f));
    }

    setEditingFormula(null);
    setIsCreating(false);
    setTestResult(null);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta fórmula?")) {
      setFormulas(formulas.filter(f => f.id !== id));
    }
  };

  const handleCancel = () => {
    setEditingFormula(null);
    setIsCreating(false);
    setTestResult(null);
  };

  const extractVariables = (formula: string): string[] => {
    const matches = formula.match(/[a-z_][a-z0-9_]*/gi) || [];
    const uniqueVars = Array.from(new Set(matches));
    return uniqueVars.filter(v => !['area', 'preco', 'm2'].some(reserved => v === reserved));
  };

  const handleFormulaChange = (formula: string) => {
    if (!editingFormula) return;
    
    const variables = extractVariables(formula);
    const newTestValues: { [key: string]: number } = {};
    
    variables.forEach(v => {
      newTestValues[v] = testValues[v] || 0;
    });

    setEditingFormula({
      ...editingFormula,
      formula,
      variables,
    });
    setTestValues(newTestValues);
  };

  const calculateFormula = (formula: string, values: { [key: string]: number }): number | null => {
    try {
      let expression = formula;
      Object.keys(values).forEach(key => {
        const regex = new RegExp(`\\b${key}\\b`, 'g');
        expression = expression.replace(regex, values[key].toString());
      });
      
      // Avaliar a expressão de forma segura
      const result = Function(`"use strict"; return (${expression})`)();
      return typeof result === 'number' && !isNaN(result) ? result : null;
    } catch (error) {
      return null;
    }
  };

  const handleTestFormula = () => {
    if (!editingFormula) return;
    
    const result = calculateFormula(editingFormula.formula, testValues);
    setTestResult(result);
    
    if (result !== null) {
      setEditingFormula({
        ...editingFormula,
        example_values: testValues,
        example_result: result,
      });
    }
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
            <button 
              className="py-4 px-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              onClick={() => navigate("/admin/rules")}
            >
              Regras de Cálculo
            </button>
            <button className="py-4 px-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
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
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Calculadora de Fórmulas</h2>
            <p className="text-slate-600">Crie e edite fórmulas personalizadas para cálculo de orçamentos</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Fórmula
          </Button>
        </div>

        {editingFormula ? (
          <Card className="p-6 mb-8 border-2 border-blue-500">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {isCreating ? "Nova Fórmula" : "Editar Fórmula"}
                  </h3>
                  <p className="text-sm text-slate-600">Configure os detalhes da fórmula</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-slate-700 mb-2 block">
                    Nome da Fórmula
                  </Label>
                  <Input
                    id="name"
                    value={editingFormula.name}
                    onChange={(e) => setEditingFormula({ ...editingFormula, name: e.target.value })}
                    placeholder="Ex: Custo Total com Desconto"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-slate-700 mb-2 block">
                    Descrição
                  </Label>
                  <textarea
                    id="description"
                    value={editingFormula.description}
                    onChange={(e) => setEditingFormula({ ...editingFormula, description: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="Descreva o que esta fórmula calcula"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-sm font-medium text-slate-700 mb-2 block">
                    Categoria
                  </Label>
                  <select
                    id="category"
                    value={editingFormula.category}
                    onChange={(e) => setEditingFormula({ ...editingFormula, category: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-md"
                  >
                    <option value="Básico">Básico</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                    <option value="Completo">Completo</option>
                    <option value="Personalizado">Personalizado</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="formula" className="text-sm font-medium text-slate-700 mb-2 block">
                    Fórmula Matemática
                  </Label>
                  <textarea
                    id="formula"
                    value={editingFormula.formula}
                    onChange={(e) => handleFormulaChange(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    rows={4}
                    placeholder="Ex: (area * preco_m2) + desconto"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Use operadores: + - * / ( )
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-semibold text-blue-900 mb-3">
                    Variáveis Detectadas ({editingFormula.variables.length})
                  </h4>
                  {editingFormula.variables.length > 0 ? (
                    <div className="space-y-2">
                      {editingFormula.variables.map((variable) => (
                        <div key={variable} className="flex items-center gap-2">
                          <code className="px-2 py-1 bg-white rounded text-sm text-blue-700 flex-1">
                            {variable}
                          </code>
                          <Input
                            type="number"
                            value={testValues[variable] || 0}
                            onChange={(e) => setTestValues({
                              ...testValues,
                              [variable]: parseFloat(e.target.value) || 0
                            })}
                            className="w-32"
                            placeholder="0"
                            step="0.01"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-blue-700">
                      Nenhuma variável detectada. Digite uma fórmula acima.
                    </p>
                  )}
                </div>

                <Button 
                  onClick={handleTestFormula}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={!editingFormula.formula || editingFormula.variables.length === 0}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Testar Fórmula
                </Button>

                {testResult !== null && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="text-sm font-semibold text-green-900 mb-2">Resultado</h4>
                    <div className="text-3xl font-bold text-green-700">
                      R$ {testResult.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                )}

                <Card className="p-4 bg-slate-50">
                  <h4 className="text-xs font-semibold text-slate-700 mb-2">💡 Exemplos de Fórmulas</h4>
                  <div className="space-y-2 text-xs text-slate-600">
                    <p><code className="bg-white px-1 rounded">area * 1200</code> - Cálculo simples</p>
                    <p><code className="bg-white px-1 rounded">(a + b) * c</code> - Com parênteses</p>
                    <p><code className="bg-white px-1 rounded">base * (1 - desconto / 100)</code> - Com desconto</p>
                    <p><code className="bg-white px-1 rounded">x * y + (z - 1) * k</code> - Complexa</p>
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {formulas.map((formula) => (
            <Card key={formula.id} className="p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">{formula.name}</h3>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        formula.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {formula.is_active ? "Ativa" : "Inativa"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{formula.description}</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {formula.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(formula)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(formula.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-600 mb-1">Fórmula:</p>
                <code className="text-sm text-slate-900 font-mono break-all">
                  {formula.formula}
                </code>
              </div>

              <div className="mb-4">
                <p className="text-xs text-slate-600 mb-2">Variáveis ({formula.variables.length}):</p>
                <div className="flex flex-wrap gap-2">
                  {formula.variables.map((variable) => (
                    <span key={variable} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-mono">
                      {variable}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Resultado Exemplo:</span>
                  <span className="text-lg font-bold text-blue-600">
                    R$ {formula.example_result.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {formulas.length === 0 && !editingFormula && (
          <Card className="p-12 text-center">
            <Calculator className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Nenhuma fórmula cadastrada</h3>
            <p className="text-slate-600 mb-6">Crie sua primeira fórmula personalizada</p>
            <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Criar Fórmula
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
