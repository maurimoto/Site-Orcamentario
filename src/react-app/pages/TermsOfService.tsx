import { useNavigate } from "react-router";
import { Building2, ArrowLeft } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Card } from "@/react-app/components/ui/card";

export default function TermsOfService() {
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Termos de Uso</h1>
          <p className="text-sm text-slate-600 mb-8">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

          <div className="space-y-6 text-slate-700">
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e usar a plataforma SteelFrame Pro, você concorda com estes Termos de Uso
                e nossa Política de Privacidade. Se você não concorda, não utilize nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">2. Descrição do Serviço</h2>
              <p>
                O SteelFrame Pro é uma plataforma SaaS para geração de orçamentos e gestão de projetos
                em Steel Frame. Oferecemos diferentes planos de assinatura com recursos variados.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">3. Cadastro e Conta</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Você deve fornecer informações verdadeiras e atualizadas</li>
                <li>É sua responsabilidade manter a segurança de sua senha</li>
                <li>Você é responsável por todas as atividades em sua conta</li>
                <li>Não é permitido compartilhar sua conta com terceiros</li>
                <li>Contas corporativas podem ter múltiplos usuários conforme o plano</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">4. Planos e Pagamento</h2>
              <h3 className="font-semibold mt-3 mb-2">4.1. Período de Teste</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Oferecemos 7 dias de teste gratuito para novos usuários</li>
                <li>É necessário cadastrar um cartão de crédito válido</li>
                <li>Não haverá cobrança durante o período de teste</li>
                <li>Você pode cancelar a qualquer momento durante o teste sem custos</li>
              </ul>

              <h3 className="font-semibold mt-3 mb-2">4.2. Assinaturas Pagas</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Após o período de teste, você será cobrado conforme o plano escolhido</li>
                <li>As cobranças são mensais e automáticas</li>
                <li>Os preços estão sujeitos a alterações com aviso prévio de 30 dias</li>
                <li>Impostos aplicáveis serão adicionados conforme legislação local</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">5. Cancelamento e Reembolso</h2>
              <h3 className="font-semibold mt-3 mb-2">5.1. Direito de Arrependimento (CDC)</h3>
              <p className="mb-2">
                Conforme o Código de Defesa do Consumidor brasileiro, você tem direito a:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Cancelar dentro de 7 dias após a contratação com reembolso integral</li>
                <li>O prazo conta a partir do primeiro pagamento (após o trial)</li>
                <li>Reembolso processado em até 10 dias úteis</li>
              </ul>

              <h3 className="font-semibold mt-3 mb-2">5.2. Cancelamento Posterior</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Você pode cancelar a qualquer momento</li>
                <li>O acesso continua até o fim do período pago</li>
                <li>Não há reembolso proporcional após os 7 dias iniciais</li>
                <li>Dados são mantidos por 30 dias após cancelamento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">6. Uso Aceitável</h2>
              <p className="mb-2">Você concorda em NÃO:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Usar a plataforma para fins ilegais</li>
                <li>Tentar acessar sistemas ou dados de outros usuários</li>
                <li>Fazer engenharia reversa do software</li>
                <li>Sobrecarregar nossos servidores intencionalmente</li>
                <li>Revender ou redistribuir nossos serviços</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">7. Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo, design, código e funcionalidades da plataforma são propriedade
                exclusiva do SteelFrame Pro. Seus dados e orçamentos criados permanecem de sua propriedade.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">8. Limitação de Responsabilidade</h2>
              <p className="mb-2">
                Os orçamentos gerados são estimativas baseadas em cálculos automatizados. 
                Você é responsável por:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Validar os valores antes de apresentar ao cliente</li>
                <li>Adaptar conforme necessidades específicas do projeto</li>
                <li>Consultar profissionais quando necessário</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">9. Disponibilidade do Serviço</h2>
              <p>
                Nos esforçamos para manter a plataforma disponível 99.9% do tempo, mas não
                garantimos operação ininterrupta. Podemos realizar manutenções programadas
                com aviso prévio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">10. Modificações nos Termos</h2>
              <p>
                Podemos atualizar estes termos periodicamente. Mudanças significativas serão
                notificadas por e-mail com 30 dias de antecedência. O uso continuado constitui
                aceitação das alterações.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">11. Lei Aplicável e Foro</h2>
              <p>
                Estes termos são regidos pelas leis brasileiras. Qualquer disputa será resolvida
                no foro da comarca de [CIDADE], Brasil.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">12. Contato</h2>
              <p>
                Para questões sobre estes termos:<br />
                <strong>E-mail:</strong> juridico@steelframepro.com.br<br />
                <strong>Suporte:</strong> suporte@steelframepro.com.br
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}
