import { useNavigate } from "react-router";
import { Building2, ArrowLeft } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Card } from "@/react-app/components/ui/card";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

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
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Política de Privacidade</h1>
          <p className="text-sm text-slate-600 mb-8">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

          <div className="space-y-6 text-slate-700">
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Informações que Coletamos</h2>
              <p className="mb-2">Coletamos as seguintes informações pessoais:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Nome completo</li>
                <li>Endereço de e-mail</li>
                <li>CPF (para fins fiscais e prevenção de fraudes)</li>
                <li>Telefone</li>
                <li>Dados de cartão de crédito (processados de forma segura através de gateway de pagamento)</li>
                <li>Informações de uso da plataforma</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">2. Como Usamos suas Informações</h2>
              <p className="mb-2">Utilizamos seus dados para:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Fornecer e melhorar nossos serviços</li>
                <li>Processar pagamentos e emitir notas fiscais</li>
                <li>Enviar comunicações relacionadas ao serviço</li>
                <li>Prevenir fraudes e garantir a segurança da plataforma</li>
                <li>Cumprir obrigações legais e regulatórias</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">3. Compartilhamento de Dados</h2>
              <p>
                Não vendemos seus dados pessoais. Compartilhamos informações apenas com:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Processadores de pagamento (para transações financeiras)</li>
                <li>Provedores de infraestrutura (hospedagem de dados)</li>
                <li>Autoridades legais (quando exigido por lei)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">4. Seus Direitos (LGPD)</h2>
              <p className="mb-2">Você tem direito a:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Confirmar a existência de tratamento de dados</li>
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                <li>Solicitar a anonimização, bloqueio ou eliminação de dados</li>
                <li>Solicitar a portabilidade dos dados</li>
                <li>Revogar o consentimento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">5. Segurança dos Dados</h2>
              <p>
                Implementamos medidas técnicas e organizacionais para proteger seus dados, incluindo:
                criptografia de senhas (SHA-256), conexões HTTPS, armazenamento seguro de dados de pagamento
                através de gateway certificado PCI-DSS.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">6. Retenção de Dados</h2>
              <p>
                Mantemos seus dados pelo tempo necessário para fornecer nossos serviços e cumprir
                obrigações legais. Dados financeiros são mantidos por no mínimo 5 anos conforme
                legislação brasileira.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">7. Cookies</h2>
              <p>
                Utilizamos cookies essenciais para o funcionamento da plataforma. Você pode gerenciar
                suas preferências de cookies nas configurações do seu navegador.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">8. Contato</h2>
              <p>
                Para exercer seus direitos ou esclarecer dúvidas sobre privacidade:
              </p>
              <p className="mt-2">
                <strong>E-mail:</strong> privacidade@steelframepro.com.br<br />
                <strong>DPO:</strong> dpo@steelframepro.com.br
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">9. Alterações nesta Política</h2>
              <p>
                Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas
                através do e-mail cadastrado.
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}
