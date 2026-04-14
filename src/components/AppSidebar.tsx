import { 
  Building2, 
  Settings, 
  Megaphone, 
  UtensilsCrossed, 
  BarChart3,
  Home,
  Users,
  ShoppingCart,
  Clock,
  PieChart,
  CalendarDays,
  LogOut,
  Lock
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logoGoodzap from "@/assets/logo_goodzap.png";
import { useModel } from "@/hooks/useModel";
import { useUserRole } from "@/hooks/useUserRole";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Informações da Empresa", url: "/empresa", icon: Building2 },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
  { title: "Campanhas", url: "/campanhas", icon: Megaphone },
  { title: "Cardápio", url: "/cardapio", icon: UtensilsCrossed },
  { title: "Relatórios", url: "/relatorios", icon: BarChart3 },
  { title: "Métricas de Vendas", url: "/metricas", icon: PieChart },
];

const operationalItems = [
  { title: "Clientes", url: "/clientes", icon: Users },
  { title: "Pedidos", url: "/pedidos", icon: ShoppingCart },
  { title: "Horários", url: "/horarios", icon: Clock },
  { title: "Reservas", url: "/reservas", icon: CalendarDays },
];

export function AppSidebar() {
  const { state, setOpen, isMobile, setOpenMobile } = useSidebar();
  const collapsed = !isMobile && state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { isRouteRestricted } = useModel();
  const { isAdmin } = useUserRole();

  const isActive = (path: string) => currentPath === path;

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado com sucesso!");
    navigate("/auth");
  };

  return (
    <Sidebar
      className="border-r border-border/50 bg-sidebar"
      collapsible="icon"
    >
      <div className="p-4 flex items-center justify-center border-b border-border/50">
        {!collapsed ? (
          <img src={logoGoodzap} alt="GoodZap Logo" className="h-8 object-contain" />
        ) : (
          <img src={logoGoodzap} alt="GoodZap Logo" className="h-6 w-6 object-contain" />
        )}
      </div>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground text-xs uppercase tracking-wider mb-2">
            {!collapsed && "Principal"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => {
                const restricted = isRouteRestricted(item.url, isAdmin);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild={!restricted} disabled={restricted}>
                      {restricted ? (
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg opacity-40 cursor-not-allowed">
                          <item.icon className="h-5 w-5 text-muted-foreground" />
                          {!collapsed && (
                            <span className="text-sm text-muted-foreground flex-1">{item.title}</span>
                          )}
                          {!collapsed && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                        </div>
                      ) : (
                        <NavLink 
                          to={item.url} 
                          end={item.url === "/"}
                          onClick={handleNavClick}
                          className={`
                            flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300
                            hover:bg-muted/50 group
                            ${isActive(item.url) ? "bg-primary/10 neon-border" : ""}
                          `}
                          activeClassName="bg-primary/10 neon-border"
                        >
                          <item.icon className={`h-5 w-5 transition-colors ${isActive(item.url) ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
                          {!collapsed && (
                            <span className={`text-sm ${isActive(item.url) ? "text-primary font-medium" : "text-foreground"}`}>
                              {item.title}
                            </span>
                          )}
                        </NavLink>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-muted-foreground text-xs uppercase tracking-wider mb-2">
            {!collapsed && "Operacional"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {operationalItems.map((item) => {
                const restricted = isRouteRestricted(item.url, isAdmin);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild={!restricted} disabled={restricted}>
                      {restricted ? (
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg opacity-40 cursor-not-allowed">
                          <item.icon className="h-5 w-5 text-muted-foreground" />
                          {!collapsed && (
                            <span className="text-sm text-muted-foreground flex-1">{item.title}</span>
                          )}
                          {!collapsed && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                        </div>
                      ) : (
                        <NavLink 
                          to={item.url} 
                          onClick={handleNavClick}
                          className={`
                            flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300
                            hover:bg-muted/50 group
                            ${isActive(item.url) ? "bg-secondary/10 neon-border" : ""}
                          `}
                          activeClassName="bg-secondary/10 neon-border"
                        >
                          <item.icon className={`h-5 w-5 transition-colors ${isActive(item.url) ? "text-secondary" : "text-muted-foreground group-hover:text-secondary"}`} />
                          {!collapsed && (
                            <span className={`text-sm ${isActive(item.url) ? "text-secondary font-medium" : "text-foreground"}`}>
                              {item.title}
                            </span>
                          )}
                        </NavLink>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout */}
        <SidebarGroup className="mt-auto pb-4">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 hover:bg-destructive/10 group cursor-pointer">
                  <LogOut className="h-5 w-5 text-muted-foreground group-hover:text-destructive transition-colors" />
                  {!collapsed && (
                    <span className="text-sm text-foreground group-hover:text-destructive">Sair</span>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
