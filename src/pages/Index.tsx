import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Building2,
  Megaphone,
  UtensilsCrossed,
  BarChart3,
  Lock
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useModel } from "@/hooks/useModel";

const Index = () => {
  const { isAdvanced } = useModel();

  // Buscar total de clientes
  const { data: totalClientes, isLoading: loadingClientes } = useQuery({
    queryKey: ["dashboard_clientes"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("clientes")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  // Buscar total de pedidos
  const { data: totalPedidos, isLoading: loadingPedidos } = useQuery({
    queryKey: ["dashboard_pedidos"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("pedidos_goodzap")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  // Buscar nome da empresa
  const { data: empresaInfo } = useQuery({
    queryKey: ["dashboard_empresa"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("empresa_info")
        .select("nome_empresa")
        .limit(1)
        .single();
      if (error) throw error;
      return data;
    },
  });

  // Buscar faturamento dos últimos 30 dias e dos 30 dias anteriores
  const { data: faturamentoData, isLoading: loadingFaturamento } = useQuery({
    queryKey: ["dashboard_faturamento"],
    queryFn: async () => {
      const hoje = new Date();
      const trintaDiasAtras = new Date(hoje);
      trintaDiasAtras.setDate(hoje.getDate() - 30);
      const sessentaDiasAtras = new Date(hoje);
      sessentaDiasAtras.setDate(hoje.getDate() - 60);

      // Pedidos dos últimos 30 dias
      const { data: pedidosRecentes, error: errorRecentes } = await supabase
        .from("pedidos_goodzap")
        .select("total, created_at")
        .gte("created_at", trintaDiasAtras.toISOString());
      
      if (errorRecentes) throw errorRecentes;

      // Pedidos dos 30 dias anteriores (para comparação)
      const { data: pedidosAnteriores, error: errorAnteriores } = await supabase
        .from("pedidos_goodzap")
        .select("total, created_at")
        .gte("created_at", sessentaDiasAtras.toISOString())
        .lt("created_at", trintaDiasAtras.toISOString());
      
      if (errorAnteriores) throw errorAnteriores;

      // Calcular faturamento
      const calcularTotal = (pedidos: { total: string }[]) => {
        return pedidos.reduce((acc, p) => {
          const valor = parseFloat(p.total?.replace(/[^\d,.-]/g, "").replace(",", ".") || "0");
          return acc + valor;
        }, 0);
      };

      const faturamentoAtual = calcularTotal(pedidosRecentes || []);
      const faturamentoAnterior = calcularTotal(pedidosAnteriores || []);

      // Calcular crescimento
      let crescimento = 0;
      if (faturamentoAnterior > 0) {
        crescimento = ((faturamentoAtual - faturamentoAnterior) / faturamentoAnterior) * 100;
      } else if (faturamentoAtual > 0) {
        crescimento = 100;
      }

      return {
        faturamentoAtual,
        faturamentoAnterior,
        crescimento,
      };
    },
  });

  const formatarMoeda = (valor: number) => {
    if (valor >= 1000) {
      return `R$ ${(valor / 1000).toFixed(1)}K`;
    }
    return `R$ ${valor.toFixed(2).replace(".", ",")}`;
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold mb-2">
             <span className="neon-text-cyan">PAINEL {empresaInfo?.nome_empresa?.toUpperCase() || "EMPRESA"}</span>
        </h2>
        <p className="text-muted-foreground">
          Gerencie seu negócio com eficiência e estilo
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card neon-border hover:neon-glow-cyan transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Clientes
            </CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            {loadingClientes ? (
              <Skeleton className="h-9 w-20" />
            ) : (
              <div className="text-3xl font-bold neon-text-cyan">
                {totalClientes?.toLocaleString("pt-BR")}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Total cadastrados
            </p>
          </CardContent>
        </Card>

        {isAdvanced && (
          <Card className="glass-card neon-border hover:neon-glow-magenta transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pedidos
              </CardTitle>
              <div className="p-2 rounded-lg bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                <ShoppingCart className="h-4 w-4 text-secondary" />
              </div>
            </CardHeader>
            <CardContent>
              {loadingPedidos ? (
                <Skeleton className="h-9 w-20" />
              ) : (
                <div className="text-3xl font-bold neon-text-magenta">
                  {totalPedidos?.toLocaleString("pt-BR")}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Total de pedidos
              </p>
            </CardContent>
          </Card>
        )}

        {isAdvanced && (
          <Card className="glass-card neon-border hover:neon-glow-green transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Faturamento
              </CardTitle>
              <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                <DollarSign className="h-4 w-4 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              {loadingFaturamento ? (
                <Skeleton className="h-9 w-24" />
              ) : (
                <div className="text-3xl font-bold neon-text-green">
                  {formatarMoeda(faturamentoData?.faturamentoAtual || 0)}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Últimos 30 dias
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="glass-card neon-border hover:neon-glow-cyan transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Crescimento
            </CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            {loadingFaturamento ? (
              <Skeleton className="h-9 w-20" />
            ) : (
              <div className={`text-3xl font-bold ${(faturamentoData?.crescimento || 0) >= 0 ? 'neon-text-green' : 'text-red-500'}`}>
                {(faturamentoData?.crescimento || 0) >= 0 ? '+' : ''}{(faturamentoData?.crescimento || 0).toFixed(1)}%
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              vs. 30 dias anteriores
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass-card neon-border">
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Acesse as funcionalidades mais utilizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-auto py-6 flex flex-col gap-2 border-border/50 hover:border-primary hover:neon-glow-cyan transition-all duration-300"
              asChild
            >
              <Link to="/empresa">
                <Building2 className="h-6 w-6 text-primary" />
                <span>Empresa</span>
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-6 flex flex-col gap-2 border-border/50 hover:border-secondary hover:neon-glow-magenta transition-all duration-300"
              asChild
            >
              <Link to="/campanhas">
                <Megaphone className="h-6 w-6 text-secondary" />
                <span>Campanhas</span>
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-6 flex flex-col gap-2 border-border/50 hover:border-accent hover:neon-glow-green transition-all duration-300"
              asChild
            >
              <Link to="/cardapio">
                <UtensilsCrossed className="h-6 w-6 text-accent" />
                <span>Cardápio</span>
              </Link>
            </Button>
            {isAdvanced ? (
              <Button 
                variant="outline" 
                className="h-auto py-6 flex flex-col gap-2 border-border/50 hover:border-primary hover:neon-glow-cyan transition-all duration-300"
                asChild
              >
                <Link to="/relatorios">
                  <BarChart3 className="h-6 w-6 text-primary" />
                  <span>Relatórios</span>
                </Link>
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="h-auto py-6 flex flex-col gap-2 border-border/50 opacity-40 cursor-not-allowed"
                disabled
              >
                <Lock className="h-6 w-6 text-muted-foreground" />
                <span className="text-muted-foreground">Relatórios</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default Index;
