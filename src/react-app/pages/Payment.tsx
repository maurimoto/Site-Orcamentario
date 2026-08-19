import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Building2, CreditCard, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Card } from "@/react-app/components/ui/card";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";

export default function Payment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planId = searchParams.get("plan");
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    cpf: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19);
    } else if (name === "expiryDate") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .slice(0, 5);
    } else if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    } else if (name === "cpf") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .slice(0, 14);
    }
    
    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          ...formData,
        }),
      });

      if (response.ok) {
        alert("Pagamento realizado com sucesso!");
        navigate("/dashboard");
      } else {
        const error = await response.json();
        alert(error.message || "Erro ao processar pagamento");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
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
            onClick={() => navigate("/plans")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Planos
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-slate-900">
              Pagamento Seguro
            </h1>
            <p className="text-slate-600 flex items-center justify-center gap-2">
              <Lock className="w-4 h-4 text-green-600" />
              Seus dados estão protegidos com criptografia SSL
            </p>
          </div>

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="cardNumber" className="text-slate-700">
                  Número do Cartão
                </Label>
                <div className="relative">
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                    className="pl-10"
                  />
                  <CreditCard className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <Label htmlFor="cardName" className="text-slate-700">
                  Nome no Cartão
                </Label>
                <Input
                  id="cardName"
                  name="cardName"
                  type="text"
                  placeholder="NOME COMO ESTÁ NO CARTÃO"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  required
                  className="uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate" className="text-slate-700">
                    Validade
                  </Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    type="text"
                    placeholder="MM/AA"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="cvv" className="text-slate-700">
                    CVV
                  </Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    type="text"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cpf" className="text-slate-700">
                  CPF do Titular
                </Label>
                <Input
                  id="cpf"
                  name="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-600">Plano Selecionado:</span>
                  <span className="font-semibold text-slate-900">
                    ID #{planId || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    R$ --,--/mês
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processando...
                  </div>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Confirmar Pagamento
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-slate-500">
                Ao confirmar, você concorda com nossos Termos de Serviço e
                Política de Privacidade
              </p>
            </form>
          </Card>

          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-4 text-slate-400 text-sm">
              <Lock className="w-4 h-4" />
              <span>Pagamento Seguro</span>
              <span>•</span>
              <span>SSL Criptografado</span>
              <span>•</span>
              <span>PCI Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
