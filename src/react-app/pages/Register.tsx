import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { 
  Building2, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  CreditCard,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Card } from "@/react-app/components/ui/card";
import { Input } from "@/react-app/components/ui/input";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  cpf: string;
  phone: string;
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvv: string;
  planType: "free_trial" | "basic" | "professional" | "enterprise";
  acceptedTerms: boolean;
}

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPlanInfo, setSelectedPlanInfo] = useState<{
    planId: string;
    planName: string;
    price: string;
    isTrial: boolean;
  } | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    cpf: "",
    phone: "",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
    planType: "free_trial",
    acceptedTerms: false,
  });

  useEffect(() => {
    const planId = searchParams.get('planId');
    const planName = searchParams.get('planName');
    const price = searchParams.get('price');
    const isTrial = searchParams.get('isTrial') === 'true';
    
    if (planId && planName && price !== null) {
      setSelectedPlanInfo({ planId, planName, price, isTrial });
      
      let planType: FormData['planType'] = 'free_trial';
      if (isTrial) {
        planType = 'free_trial';
      } else if (price === '49') {
        planType = 'basic';
      } else if (price === '149') {
        planType = 'professional';
      } else if (price === '399') {
        planType = 'enterprise';
      }
      
      setFormData(prev => ({ ...prev, planType }));
    }
  }, [searchParams]);

  const validateCPF = (cpf: string): boolean => {
    cpf = cpf.replace(/[^\d]/g, "");
    
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(10))) return false;

    return true;
  };

  const formatCPF = (value: string): string => {
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return value.substring(0, 14);
  };

  const formatPhone = (value: string): string => {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
    return value.substring(0, 15);
  };

  const formatCardNumber = (value: string): string => {
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    return value.substring(0, 19);
  };

  const formatCardExpiry = (value: string): string => {
    value = value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    return value.substring(0, 5);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    let formattedValue = value;

    if (field === "cpf") {
      formattedValue = formatCPF(value);
    } else if (field === "phone") {
      formattedValue = formatPhone(value);
    } else if (field === "cardNumber") {
      formattedValue = formatCardNumber(value);
    } else if (field === "cardExpiry") {
      formattedValue = formatCardExpiry(value);
    } else if (field === "cardCvv") {
      formattedValue = value.replace(/\D/g, "").substring(0, 4);
    }

    setFormData({ ...formData, [field]: formattedValue });
  };

  const validateStep1 = (): boolean => {
    if (!formData.name.trim()) {
      setError("Nome completo é obrigatório");
      return false;
    }
    if (!formData.email.includes("@")) {
      setError("Email inválido");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Senha deve ter no mínimo 6 caracteres");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    if (!validateCPF(formData.cpf)) {
      setError("CPF inválido");
      return false;
    }
    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length !== 11) {
      setError("Telefone inválido. Use o formato (XX) XXXXX-XXXX");
      return false;
    }
    return true;
  };

  const validateStep3 = (): boolean => {
    const cardDigits = formData.cardNumber.replace(/\D/g, "");
    if (cardDigits.length !== 16) {
      setError("Número do cartão inválido");
      return false;
    }
    if (!formData.cardName.trim()) {
      setError("Nome no cartão é obrigatório");
      return false;
    }
    const expiryParts = formData.cardExpiry.split("/");
    if (expiryParts.length !== 2) {
      setError("Data de validade inválida");
      return false;
    }
    const month = parseInt(expiryParts[0]);
    const year = parseInt("20" + expiryParts[1]);
    if (month < 1 || month > 12) {
      setError("Mês inválido");
      return false;
    }
    const now = new Date();
    const expiry = new Date(year, month - 1);
    if (expiry < now) {
      setError("Cartão vencido");
      return false;
    }
    if (formData.cardCvv.length < 3) {
      setError("CVV inválido");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError("");
    
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    } else if (step === 3 && validateStep3()) {
      setStep(4);
    }
  };

  const handleBack = () => {
    setError("");
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setError("");

    if (!formData.acceptedTerms) {
      setError("Você deve aceitar os Termos de Uso e Política de Privacidade para continuar");
      return;
    }

    setLoading(true);

    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        cpf: formData.cpf,
        phone: formData.phone,
        planType: formData.planType,
        cardNumber: formData.cardNumber,
        cardName: formData.cardName,
        cardExpiry: formData.cardExpiry,
      };

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setError(data.error || "Erro ao criar conta");
        setLoading(false);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Erro ao conectar com o servidor. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Building2 className="w-10 h-10 text-blue-600" />
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              SteelFrame Pro
            </span>
          </div>
          <p className="text-slate-600">
            {selectedPlanInfo 
              ? `Complete seu cadastro para o plano ${selectedPlanInfo.planName}`
              : "Crie sua conta e comece seu teste gratuito"
            }
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    s < step
                      ? "bg-green-600 text-white"
                      : s === step
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
                </div>
                {s < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      s < step ? "bg-green-600" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-600">
            <span>Conta</span>
            <span>Dados Pessoais</span>
            <span>Pagamento</span>
            <span>Plano</span>
          </div>
        </div>

        <Card className="p-8">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Criar Conta</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="João da Silva"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Senha *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Confirmar Senha *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type="password"
                      placeholder="Digite a senha novamente"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Dados Pessoais</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    CPF *
                  </label>
                  <Input
                    type="text"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange("cpf", e.target.value)}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Usado para evitar múltiplos cadastros e fraudes
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Telefone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Dados do Cartão</h2>
              <p className="text-sm text-slate-600 mb-6">
                Necessário para validação. A cobrança só ocorrerá após 7 dias de teste gratuito.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Número do Cartão *
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nome no Cartão *
                  </label>
                  <Input
                    type="text"
                    placeholder="JOÃO DA SILVA"
                    value={formData.cardName}
                    onChange={(e) => handleInputChange("cardName", e.target.value.toUpperCase())}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Validade *
                    </label>
                    <Input
                      type="text"
                      placeholder="MM/AA"
                      value={formData.cardExpiry}
                      onChange={(e) => handleInputChange("cardExpiry", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      CVV *
                    </label>
                    <Input
                      type="text"
                      placeholder="123"
                      value={formData.cardCvv}
                      onChange={(e) => handleInputChange("cardCvv", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Confirmar Plano</h2>
              
              <Card className="p-6 mb-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300">
                <p className="text-sm font-medium text-slate-600 mb-3">Plano Selecionado:</p>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {formData.planType === "free_trial" && "Teste Gratuito"}
                      {formData.planType === "basic" && "Básico"}
                      {formData.planType === "professional" && "Profissional"}
                      {formData.planType === "enterprise" && "Empresarial"}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {formData.planType === "free_trial" && "7 dias grátis • 4 orçamentos • Suporte por email"}
                      {formData.planType === "basic" && "20 orçamentos/mês • Suporte por email"}
                      {formData.planType === "professional" && "Orçamentos ilimitados • Suporte prioritário • Relatórios avançados"}
                      {formData.planType === "enterprise" && "Multi-usuários • API • Integração personalizada • Suporte dedicado"}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      {formData.planType === "free_trial" && "R$ 0"}
                      {formData.planType === "basic" && "R$ 49"}
                      {formData.planType === "professional" && "R$ 149"}
                      {formData.planType === "enterprise" && "R$ 399"}
                    </div>
                    {formData.planType !== "free_trial" && (
                      <div className="text-sm text-slate-600">/mês</div>
                    )}
                  </div>
                </div>
              </Card>
              
              <div className="space-y-4">
                <button
                  onClick={() => handleInputChange("planType", "free_trial")}
                  className={`w-full p-6 border-2 rounded-lg text-left transition ${
                    formData.planType === "free_trial"
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Teste Gratuito</h3>
                      <p className="text-sm text-slate-600 mt-1">
                        7 dias grátis • 4 orçamentos • Suporte por email
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">R$ 0</div>
                  </div>
                </button>

                <button
                  onClick={() => handleInputChange("planType", "basic")}
                  className={`w-full p-6 border-2 rounded-lg text-left transition ${
                    formData.planType === "basic"
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Básico</h3>
                      <p className="text-sm text-slate-600 mt-1">
                        20 orçamentos/mês • Suporte por email
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900">R$ 49</div>
                      <div className="text-sm text-slate-600">/mês</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleInputChange("planType", "professional")}
                  className={`w-full p-6 border-2 rounded-lg text-left transition ${
                    formData.planType === "professional"
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Profissional</h3>
                      <p className="text-sm text-slate-600 mt-1">
                        Orçamentos ilimitados • Suporte prioritário • Relatórios avançados
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900">R$ 149</div>
                      <div className="text-sm text-slate-600">/mês</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleInputChange("planType", "enterprise")}
                  className={`w-full p-6 border-2 rounded-lg text-left transition ${
                    formData.planType === "enterprise"
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Empresarial</h3>
                      <p className="text-sm text-slate-600 mt-1">
                        Multi-usuários • API • Integração personalizada • Suporte dedicado
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900">R$ 399</div>
                      <div className="text-sm text-slate-600">/mês</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="mt-6 p-4 bg-slate-50 border-2 border-slate-300 rounded-lg">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.acceptedTerms}
                  onChange={(e) => setFormData({ ...formData, acceptedTerms: e.target.checked })}
                  className="mt-1 w-4 h-4 accent-blue-600"
                />
                <span className="text-sm text-slate-700">
                  Li e aceito os{" "}
                  <a href="/terms" target="_blank" className="text-blue-600 hover:underline font-semibold">
                    Termos de Uso
                  </a>{" "}
                  e a{" "}
                  <a href="/privacy" target="_blank" className="text-blue-600 hover:underline font-semibold">
                    Política de Privacidade
                  </a>
                </span>
              </label>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mt-4">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex gap-4 mt-6">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            )}
            
            {step < 4 ? (
              <Button
                onClick={handleNext}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Continuar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {loading ? "Criando conta..." : "Criar Conta"}
              </Button>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Já tem uma conta?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Fazer login
              </button>
            </p>
          </div>
        </Card>

        {step === 4 && formData.planType === "free_trial" && (
          <Card className="mt-4 p-4 bg-green-50 border-green-200">
            <p className="text-sm text-green-900 font-medium mb-2">
              🎉 Teste Gratuito por 7 Dias
            </p>
            <div className="text-xs text-green-800">
              <p>• Acesso completo durante 7 dias de teste</p>
              <p>• 4 orçamentos disponíveis</p>
              <p>• Cartão não será cobrado durante o período de teste</p>
              <p>• Após 7 dias, escolha um plano ou cancele sem custos</p>
              <p>• Se não escolher um plano, a conta será cancelada automaticamente</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
