import { useNavigate } from "react-router";
import { Building2, XCircle } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Card } from "@/react-app/components/ui/card";

export default function PaymentFailure() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Building2 className="w-10 h-10 text-blue-600" />
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              SteelFrame Pro
            </span>
          </div>
        </div>

        <Card className="p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Pagamento Falhou
            </h1>
            
            <p className="text-slate-600 mb-6">
              Não foi possível processar seu pagamento. Isso pode ter ocorrido por:
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
              <ul className="text-sm text-red-800 space-y-2">
                <li>• Saldo insuficiente</li>
                <li>• Cartão recusado pelo banco</li>
                <li>• Dados incorretos</li>
                <li>• Limite de compra atingido</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900 font-medium mb-2">
                💡 O que fazer?
              </p>
              <p className="text-sm text-blue-800">
                Você pode tentar novamente com outro método de pagamento ou entrar em contato 
                com seu banco para mais informações.
              </p>
            </div>

            <Button
              onClick={() => navigate("/plans")}
              className="w-full bg-blue-600 hover:bg-blue-700 mb-3"
            >
              Tentar Novamente
            </Button>

            <Button
              onClick={() => navigate("/dashboard")}
              variant="outline"
              className="w-full"
            >
              Voltar ao Dashboard
            </Button>
          </div>
        </Card>

        <div className="mt-4 text-center">
          <p className="text-sm text-slate-600">
            Precisa de ajuda?{" "}
            <a href="mailto:suporte@steelframepro.com" className="text-blue-600 hover:underline">
              Entre em contato
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
