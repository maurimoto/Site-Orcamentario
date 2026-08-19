import { useState } from "react";
import { useNavigate } from "react-router";
import { Building2, Mail, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Card } from "@/react-app/components/ui/card";
import { Input } from "@/react-app/components/ui/input";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.error || "Erro ao processar solicitação");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

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
          <p className="text-slate-600">Recuperação de Senha</p>
        </div>

        <Card className="p-8">
          {!success ? (
            <>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Esqueceu sua senha?</h1>
              <p className="text-sm text-slate-600 mb-6">
                Digite seu email e enviaremos instruções para redefinir sua senha.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "Enviando..." : "Enviar Instruções"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2 mx-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar para o login
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Email Enviado!</h2>
                <p className="text-slate-600 mb-6">
                  Se existe uma conta com o email <strong>{email}</strong>, você receberá 
                  instruções para redefinir sua senha.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-900">
                    <strong>📧 Verifique sua caixa de entrada</strong>
                  </p>
                  <p className="text-xs text-blue-700 mt-2">
                    O email pode levar alguns minutos para chegar. Não se esqueça de verificar 
                    a pasta de spam.
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/login")}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Voltar para o Login
                </Button>
              </div>
            </>
          )}
        </Card>

        {!success && (
          <Card className="mt-4 p-4 bg-amber-50 border-amber-200">
            <p className="text-sm text-amber-900 font-medium mb-2">
              💡 Dica de Segurança
            </p>
            <p className="text-xs text-amber-800">
              Por motivos de segurança, não confirmamos se o email existe em nosso sistema. 
              Você receberá o email apenas se tiver uma conta cadastrada.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
