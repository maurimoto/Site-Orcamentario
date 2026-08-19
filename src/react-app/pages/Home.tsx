import { Building2, Calculator, Clock, Shield, TrendingUp, Users } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Card } from "@/react-app/components/ui/card";
import { useNavigate } from "react-router";
import { useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              SteelFrame Pro
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#beneficios" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition">
              Benefícios
            </a>
            <a href="#planos" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition">
              Planos
            </a>
            <a href="#como-funciona" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition">
              Como Funciona
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate("/plans")}
            >
              Ver Planos
            </Button>
          </div>
        </div>
      </header>

      <section className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <img 
            src="/steel-frame-background.jpg" 
            alt="Steel Frame Construction" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-blue-50/80 to-white/90"></div>
        </div>
        <div className="relative max-w-4xl mx-auto text-center z-10">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 rounded-full">
            <span className="text-sm font-medium text-blue-700">Sistema Profissional SaaS</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent leading-tight">
            Orçamentos em Steel Frame
            <br />
            <span className="text-blue-600">em Segundos</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Plataforma completa para gerenciar projetos, gerar orçamentos automáticos e vender assinaturas de serviços em Steel Frame
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6"
              onClick={() => navigate("/register")}
            >
              Começar Teste Gratuito
            </Button>
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6"
              onClick={() => navigate("/plans")}
            >
              Ver Planos
            </Button>
          </div>
          <p className="text-sm text-slate-500 mt-4">
            • 7 dias de teste grátis
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="p-6 text-center border-slate-200 hover:shadow-lg transition">
            <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
            <div className="text-sm text-slate-600">Precisão nos Orçamentos</div>
          </Card>
          <Card className="p-6 text-center border-slate-200 hover:shadow-lg transition">
            <div className="text-4xl font-bold text-blue-600 mb-2">3min</div>
            <div className="text-sm text-slate-600">Tempo Médio de Orçamento</div>
          </Card>
          <Card className="p-6 text-center border-slate-200 hover:shadow-lg transition">
            <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-sm text-slate-600">Projetos Realizados</div>
          </Card>
        </div>
      </section>

      <section id="beneficios" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
            Por que escolher Steel Frame?
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Tecnologia construtiva moderna, sustentável e econômica
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-8 border-slate-200 hover:shadow-xl transition hover:scale-105">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Clock className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-slate-900">Rapidez na Construção</h3>
            <p className="text-slate-600">
              Reduza o tempo de obra em até 60% comparado à alvenaria tradicional
            </p>
          </Card>
          <Card className="p-8 border-slate-200 hover:shadow-xl transition hover:scale-105">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-slate-900">Economia</h3>
            <p className="text-slate-600">
              Economize até 30% em custos com menos desperdício e mão de obra otimizada
            </p>
          </Card>
          <Card className="p-8 border-slate-200 hover:shadow-xl transition hover:scale-105">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-slate-900">Durabilidade</h3>
            <p className="text-slate-600">
              Estrutura resistente com vida útil superior a 100 anos
            </p>
          </Card>
          <Card className="p-8 border-slate-200 hover:shadow-xl transition hover:scale-105">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <Calculator className="w-7 h-7 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-slate-900">Precisão</h3>
            <p className="text-slate-600">
              Projeto detalhado e cálculo estrutural preciso para máxima segurança
            </p>
          </Card>
          <Card className="p-8 border-slate-200 hover:shadow-xl transition hover:scale-105">
            <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
              <Building2 className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-slate-900">Flexibilidade</h3>
            <p className="text-slate-600">
              Possibilidade de modificações e ampliações futuras
            </p>
          </Card>
          <Card className="p-8 border-slate-200 hover:shadow-xl transition hover:scale-105">
            <div className="w-14 h-14 bg-sky-100 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-sky-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-slate-900">Suporte Completo</h3>
            <p className="text-slate-600">
              Equipe especializada para acompanhar seu projeto do início ao fim
            </p>
          </Card>
        </div>
      </section>

      <section id="planos" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
            Planos e Preços
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Escolha o plano ideal para o seu negócio
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card 
            className={`p-8 cursor-pointer transition ${
              selectedPlan === "basico"
                ? "border-2 border-blue-500 shadow-xl"
                : "border-slate-200 hover:shadow-xl"
            }`}
            onClick={() => setSelectedPlan("basico")}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2 text-slate-900">Básico</h3>
              <div className="text-4xl font-bold text-blue-600 mb-1">R$ 97</div>
              <div className="text-sm text-slate-600">por mês</div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-600"></div>
                </div>
                <span className="text-sm text-slate-700">Até 20 orçamentos/mês</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-600"></div>
                </div>
                <span className="text-sm text-slate-700">Geração automática de orçamentos</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-600"></div>
                </div>
                <span className="text-sm text-slate-700">Histórico de projetos</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-600"></div>
                </div>
                <span className="text-sm text-slate-700">Suporte por email</span>
              </li>
            </ul>
            <Button 
              className={`w-full ${
                selectedPlan === "basico"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : ""
              }`}
              variant={selectedPlan === "basico" ? "default" : "outline"} 
              onClick={(e) => {
                e.stopPropagation();
                navigate("/plans");
              }}
            >
              Começar Agora
            </Button>
          </Card>
          <Card 
            className={`p-8 relative cursor-pointer transition ${
              selectedPlan === "profissional"
                ? "border-2 border-blue-500 shadow-2xl"
                : "border-slate-200 hover:shadow-xl"
            }`}
            onClick={() => setSelectedPlan("profissional")}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
              Mais Popular
            </div>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2 text-slate-900">Profissional</h3>
              <div className="text-4xl font-bold text-blue-600 mb-1">R$ 197</div>
              <div className="text-sm text-slate-600">por mês</div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-600"></div>
                </div>
                <span className="text-sm text-slate-700">Orçamentos ilimitados</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-600"></div>
                </div>
                <span className="text-sm text-slate-700">Tudo do plano Básico</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-600"></div>
                </div>
                <span className="text-sm text-slate-700">Relatórios personalizados</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-600"></div>
                </div>
                <span className="text-sm text-slate-700">Suporte prioritário</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-600"></div>
                </div>
                <span className="text-sm text-slate-700">API de integração</span>
              </li>
            </ul>
            <Button 
              className={`w-full ${
                selectedPlan === "profissional"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-slate-900 hover:bg-slate-800"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                navigate("/plans");
              }}
            >
              Começar Agora
            </Button>
          </Card>
          <Card 
            className={`p-8 cursor-pointer transition ${
              selectedPlan === "empresarial"
                ? "border-2 border-blue-500 shadow-xl"
                : "border-slate-200 hover:shadow-xl"
            }`}
            onClick={() => setSelectedPlan("empresarial")}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2 text-slate-900">Empresarial</h3>
              <div className="text-4xl font-bold text-blue-600 mb-1">R$ 497</div>
              <div className="text-sm text-slate-600">por mês</div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-600"></div>
                </div>
                <span className="text-sm text-slate-700">Tudo do plano Profissional</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-600"></div>
                </div>
                <span className="text-sm text-slate-700">Múltiplos usuários</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-600"></div>
                </div>
                <span className="text-sm text-slate-700">Customização avançada</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-600"></div>
                </div>
                <span className="text-sm text-slate-700">Consultoria dedicada</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-600"></div>
                </div>
                <span className="text-sm text-slate-700">SLA garantido</span>
              </li>
            </ul>
            <Button 
              className={`w-full ${
                selectedPlan === "empresarial"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : ""
              }`}
              variant={selectedPlan === "empresarial" ? "default" : "outline"}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Falar com Vendas
            </Button>
          </Card>
        </div>
      </section>
<section id="como-funciona" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Como Funciona
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Simples, rápido e profissional
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900">Cadastre-se</h3>
              <p className="text-slate-600 text-sm">
                Crie sua conta e escolha o plano ideal
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900">Informe os Dados</h3>
              <p className="text-slate-600 text-sm">
                Preencha o formulário com detalhes do projeto
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900">Orçamento Automático</h3>
              <p className="text-slate-600 text-sm">
                Receba o orçamento detalhado em segundos
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900">Acompanhe Tudo</h3>
              <p className="text-slate-600 text-sm">
                Gerencie projetos e assinaturas em um só lugar
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Pronto para revolucionar seus projetos?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de profissionais que já usam o SteelFrame Pro
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6" onClick={() => navigate("/register")}>
            Começar Teste Grátis
          </Button> <br /> <br />
          
          <p className="text-sm text-blue-100">💡 Plano grátuito disponível para novos usuários</p >
        </div>
      </section>
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-6 h-6 text-blue-400" />
                <span className="text-xl font-bold text-white">SteelFrame Pro</span>
              </div>
              <p className="text-sm text-slate-400">
                Plataforma completa para gestão de projetos em Steel Frame
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Produto</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-white transition">Preços</a></li>
                <li><a href="#" className="hover:text-white transition">Casos de Uso</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Empresa</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contato</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Suporte</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition">Documentação</a></li>
                <li><a href="#" className="hover:text-white transition">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500">
            © 2024 SteelFrame Pro. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
