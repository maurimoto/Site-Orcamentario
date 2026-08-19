import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Building2, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Card } from "@/react-app/components/ui/card";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      const paymentId = searchParams.get("payment_id");
      const externalReference = searchParams.get("external_reference");

      if (externalReference) {
        try {
          const response = await fetch(`/api/payments/check/${externalReference}`);
          if (response.ok) {
            const data = await response.json();
            setPaymentVerified(data.payment_status === "approved");
          }
        } catch (error) {
          console.error("Payment verification error:", error);
        }
      }

      setLoading(false);
    };

    verifyPayment();
  }, [searchParams]);

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
          {loading ? (
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Verificando pagamento...
              </h2>
              <p className="text-slate-600">Aguarde um momento</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>

              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Pagamento Confirmado!
              </h1>
              
              <p className="text-slate-600 mb-6">
                Seu pagamento foi processado com sucesso. Sua assinatura está ativa!
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-900 font-medium mb-2">
                  ✅ O que acontece agora?
                </p>
                <ul className="text-sm text-green-800 text-left space-y-2">
                  <li>• Sua assinatura foi ativada</li>
                  <li>• Você tem acesso completo a todos os recursos</li>
                  <li>• Um email de confirmação foi enviado</li>
                  <li>• Sua cobrança será renovada mensalmente</li>
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
          )}
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
