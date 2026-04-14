import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useModel } from "@/hooks/useModel";
import { useUserRole } from "@/hooks/useUserRole";
import Index from "./pages/Index";
import Empresa from "./pages/Empresa";
import Configuracoes from "./pages/Configuracoes";
import Campanhas from "./pages/Campanhas";
import Cardapio from "./pages/Cardapio";
import Relatorios from "./pages/Relatorios";
import MetricasVendas from "./pages/MetricasVendas";
import Clientes from "./pages/Clientes";
import Pedidos from "./pages/Pedidos";
import Horarios from "./pages/Horarios";
import Reservas from "./pages/Reservas";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { session, loading } = useAuth();
  const { isRouteRestricted } = useModel();
  const { isAdmin } = useUserRole();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/empresa" element={<Empresa />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/campanhas" element={<Campanhas />} />
        <Route path="/cardapio" element={<Cardapio />} />
        <Route path="/relatorios" element={isRouteRestricted("/relatorios") ? <Navigate to="/" replace /> : <Relatorios />} />
        <Route path="/metricas" element={isRouteRestricted("/metricas") ? <Navigate to="/" replace /> : <MetricasVendas />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/pedidos" element={isRouteRestricted("/pedidos") ? <Navigate to="/" replace /> : <Pedidos />} />
        <Route path="/horarios" element={<Horarios />} />
        <Route path="/reservas" element={isRouteRestricted("/reservas", isAdmin) ? <Navigate to="/" replace /> : <Reservas />} />
        <Route path="/auth" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
