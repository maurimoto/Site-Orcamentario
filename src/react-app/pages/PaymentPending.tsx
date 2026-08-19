import { useNavigate } from "react-router";
import { Building2, Clock } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Card } from "@/react-app/components/ui/card";

export default function PaymentPending() {
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
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-12 h-12 text-yellow-600" />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Pagamento Pendente
            </h1>
            
            <p className="text-slate-600 mb-6">
              Seu pagamento está sendo processado. Aguarde a confirmação.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-900 font-medium mb-2">
                ⏰ Aguarde a confirmação
              </p>
              <p className="text-sm text-yellow-800">
                Alguns métodos de pagamento (como boleto ou transferência) podem levar até 
                48 horas para serem confirmados. Você receberá um email quando o pagamento 
                for aprovado.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-blue-900 font-medium mb-2">
                📋 Próximos passos:
              </p>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Aguarde o processamento do pagamento</li>
                <li>• Você receberá um email de confirmação</li>
                <li>• Sua assinatura será ativada automaticamente</li>
                <li>• Você pode continuar usando o período de teste</li>
              </ul>
            </div>

            <Button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-blue-600 hover:bg-blue-700 mb-3"
            >
              Ir para Dashboard
            </Button>

            <Button
              onClick={() => navigate("/client/subscription")}
              variant="outline"
              className="w-full"
            >
              Ver Minha Assinatura
            </Button>
          </div>
        </Card>

        <div className="mt-4 text-center">
          <p className="text-sm text-slate-600">
            Dúvidas?{" "}
            <a href="mailto:suporte@steelframepro.com" className="text-blue-600 hover:underline">
              Fale conosco
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
