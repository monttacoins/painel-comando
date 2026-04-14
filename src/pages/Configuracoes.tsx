import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Clock, MapPin, Save, Zap, Gift, MessageSquare, Phone, Calendar, Star, Plus, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

const Configuracoes = () => {
  const queryClient = useQueryClient();
  
  // Form states
  const [formData, setFormData] = useState({
    tempo_entrega_minutos: 30,
    tempo_atraso_minutos: 10,
    distancia_maxima: 10,
    tempo_resposta_minutos: 5,
    goodzap_status: "ativo",
  });

  const [novoTelefone, setNovoTelefone] = useState({
    numero_atendente: "",
    numero_gerente: "",
  });

  const [novaPromocao, setNovaPromocao] = useState({ promocao: "", regras: "" });
  const [novaSaudacao, setNovaSaudacao] = useState("");
  const [novoHorarioExtra, setNovoHorarioExtra] = useState({ horario: "", detalhes: "" });
  const [novoNumeroEspecial, setNovoNumeroEspecial] = useState({ nome: "", telefone: "" });

  // Queries
  const { data: config, isLoading: loadingConfig } = useQuery({
    queryKey: ["configuracoes_goodzap"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("configuracoes_goodzap")
        .select("*")
        .limit(1)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
  });

  const { data: promocoes, isLoading: loadingPromocoes } = useQuery({
    queryKey: ["promocoes_goodzap"],
    queryFn: async () => {
      const { data, error } = await supabase.from("promocoes_goodzap").select("*").order("id");
      if (error) throw error;
      return data;
    },
  });

  const { data: saudacoes, isLoading: loadingSaudacoes } = useQuery({
    queryKey: ["saudacoes_goodzap"],
    queryFn: async () => {
      const { data, error } = await supabase.from("saudacoes_goodzap").select("*").order("id");
      if (error) throw error;
      return data;
    },
  });

  const { data: telefones, isLoading: loadingTelefones } = useQuery({
    queryKey: ["telefones_admin_goodzap"],
    queryFn: async () => {
      const { data, error } = await supabase.from("telefones_admin_goodzap").select("*").order("id");
      if (error) throw error;
      return data;
    },
  });

  const { data: horariosExtras, isLoading: loadingHorariosExtras } = useQuery({
    queryKey: ["horarios_goodzap"],
    queryFn: async () => {
      const { data, error } = await supabase.from("horarios_goodzap").select("*").order("id");
      if (error) throw error;
      return data;
    },
  });

  const { data: numerosEspeciais, isLoading: loadingNumerosEspeciais } = useQuery({
    queryKey: ["numeros_especiais"],
    queryFn: async () => {
      const { data, error } = await supabase.from("numeros_especiais").select("*").order("id");
      if (error) throw error;
      return data;
    },
  });

  // Effects
  useEffect(() => {
    if (config) {
      setFormData({
        tempo_entrega_minutos: config.tempo_entrega_minutos ?? 30,
        tempo_atraso_minutos: config.tempo_atraso_minutos ?? 10,
        distancia_maxima: config.distancia_maxima ?? 10,
        tempo_resposta_minutos: config.tempo_resposta_minutos ?? 5,
        goodzap_status: config.goodzap_status || "ativo",
      });
    }
  }, [config]);

  // Removed useEffect for telefones since we now display multiple

  // Mutations
  const configMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (config?.id) {
        const { error } = await supabase.from("configuracoes_goodzap").update(data).eq("id", config.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("configuracoes_goodzap").insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configuracoes_goodzap"] });
      toast({ title: "Sucesso!", description: "Configurações salvas." });
    },
    onError: () => {
      toast({ title: "Erro", description: "Falha ao salvar.", variant: "destructive" });
    },
  });

  const addTelefoneMutation = useMutation({
    mutationFn: async (data: typeof novoTelefone) => {
      // Desativa todos os outros antes de adicionar o novo como ativo
      const { error: deactivateError } = await supabase
        .from("telefones_admin_goodzap")
        .update({ ativa: false })
        .neq("id", 0);
      if (deactivateError) throw deactivateError;
      
      const { error } = await supabase.from("telefones_admin_goodzap").insert([{ ...data, ativa: true }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["telefones_admin_goodzap"] });
      setNovoTelefone({ numero_atendente: "", numero_gerente: "" });
      toast({ title: "Sucesso!", description: "Telefones adicionados." });
    },
    onError: () => {
      toast({ title: "Erro", description: "Falha ao adicionar telefones.", variant: "destructive" });
    },
  });

  const toggleTelefoneMutation = useMutation({
    mutationFn: async ({ id, ativa }: { id: number; ativa: boolean }) => {
      // Se estiver ativando, desativa todos os outros primeiro
      if (ativa) {
        const { error: deactivateError } = await supabase
          .from("telefones_admin_goodzap")
          .update({ ativa: false })
          .neq("id", id);
        if (deactivateError) throw deactivateError;
      }
      const { error } = await supabase.from("telefones_admin_goodzap").update({ ativa }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["telefones_admin_goodzap"] }),
  });

  const deleteTelefoneMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("telefones_admin_goodzap").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["telefones_admin_goodzap"] });
      toast({ title: "Telefones removidos." });
    },
  });

  const addPromocaoMutation = useMutation({
    mutationFn: async (data: { promocao: string; regras: string }) => {
      const { error } = await supabase.from("promocoes_goodzap").insert([{ ...data, ativa: true }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promocoes_goodzap"] });
      setNovaPromocao({ promocao: "", regras: "" });
      toast({ title: "Sucesso!", description: "Promoção adicionada." });
    },
  });

  const togglePromocaoMutation = useMutation({
    mutationFn: async ({ id, ativa }: { id: number; ativa: boolean }) => {
      const { error } = await supabase.from("promocoes_goodzap").update({ ativa }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["promocoes_goodzap"] }),
  });

  const deletePromocaoMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("promocoes_goodzap").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promocoes_goodzap"] });
      toast({ title: "Promoção removida." });
    },
  });

  const addSaudacaoMutation = useMutation({
    mutationFn: async (saudacao: string) => {
      // Desativa todas as outras antes de adicionar a nova como ativa
      const { error: deactivateError } = await supabase
        .from("saudacoes_goodzap")
        .update({ ativa: false })
        .neq("id", 0);
      if (deactivateError) throw deactivateError;
      
      const { error } = await supabase.from("saudacoes_goodzap").insert([{ saudacao, ativa: true }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saudacoes_goodzap"] });
      setNovaSaudacao("");
      toast({ title: "Sucesso!", description: "Saudação adicionada." });
    },
  });

  const toggleSaudacaoMutation = useMutation({
    mutationFn: async ({ id, ativa }: { id: number; ativa: boolean }) => {
      // Se estiver ativando, desativa todos os outros primeiro
      if (ativa) {
        const { error: deactivateError } = await supabase
          .from("saudacoes_goodzap")
          .update({ ativa: false })
          .neq("id", id);
        if (deactivateError) throw deactivateError;
      }
      const { error } = await supabase.from("saudacoes_goodzap").update({ ativa }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["saudacoes_goodzap"] }),
  });

  const deleteSaudacaoMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("saudacoes_goodzap").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saudacoes_goodzap"] });
      toast({ title: "Saudação removida." });
    },
  });

  const addHorarioExtraMutation = useMutation({
    mutationFn: async (data: { horario: string; detalhes: string }) => {
      const { error } = await supabase.from("horarios_goodzap").insert([{ ...data, ativa: true }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["horarios_goodzap"] });
      setNovoHorarioExtra({ horario: "", detalhes: "" });
      toast({ title: "Sucesso!", description: "Horário extra adicionado." });
    },
  });

  const toggleHorarioExtraMutation = useMutation({
    mutationFn: async ({ id, ativa }: { id: number; ativa: boolean }) => {
      const { error } = await supabase.from("horarios_goodzap").update({ ativa }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["horarios_goodzap"] }),
  });

  const deleteHorarioExtraMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("horarios_goodzap").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["horarios_goodzap"] });
      toast({ title: "Horário extra removido." });
    },
  });

  const addNumeroEspecialMutation = useMutation({
    mutationFn: async (data: { nome: string; telefone: string }) => {
      const { error } = await supabase.from("numeros_especiais").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["numeros_especiais"] });
      setNovoNumeroEspecial({ nome: "", telefone: "" });
      toast({ title: "Sucesso!", description: "Número especial adicionado." });
    },
  });

  const deleteNumeroEspecialMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("numeros_especiais").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["numeros_especiais"] });
      toast({ title: "Número especial removido." });
    },
  });

  const isLoading = loadingConfig || loadingPromocoes || loadingSaudacoes || loadingTelefones || loadingHorariosExtras || loadingNumerosEspeciais;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">
          <span className="neon-text-magenta">Configurações</span> do Sistema
        </h2>
        <p className="text-muted-foreground">Ajuste os parâmetros do GoodZap</p>
      </div>

      <div className="grid gap-6">
        {/* Status do GoodZap */}
        <Card className="glass-card neon-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Status do GoodZap
            </CardTitle>
            <CardDescription>Ative ou desative o sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label className={formData.goodzap_status === "ativo" ? "neon-text-green" : "text-red-500"}>
                  {formData.goodzap_status === "ativo" ? "Sistema Ativo" : "Sistema Inativo"}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {formData.goodzap_status === "ativo" 
                    ? "O GoodZap está respondendo automaticamente" 
                    : "O GoodZap está pausado e não responde mensagens"}
                </p>
              </div>
              <Switch 
                checked={formData.goodzap_status === "ativo"}
                onCheckedChange={(checked) => {
                  const newStatus = checked ? "ativo" : "inativo";
                  setFormData(prev => ({ ...prev, goodzap_status: newStatus }));
                  // Salva automaticamente no banco ao alterar o toggle
                  if (config?.id) {
                    configMutation.mutate({ ...formData, goodzap_status: newStatus });
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tempos e Entrega */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="glass-card neon-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-secondary" />
                Tempos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tempo de Entrega (min)</Label>
                <Input 
                  type="number"
                  value={formData.tempo_entrega_minutos}
                  onChange={(e) => setFormData(prev => ({ ...prev, tempo_entrega_minutos: parseInt(e.target.value) || 0 }))}
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Tempo de Atraso (min)</Label>
                <Input 
                  type="number"
                  value={formData.tempo_atraso_minutos}
                  onChange={(e) => setFormData(prev => ({ ...prev, tempo_atraso_minutos: parseInt(e.target.value) || 0 }))}
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Tempo de Resposta (min)</Label>
                <Input 
                  type="number"
                  value={formData.tempo_resposta_minutos}
                  onChange={(e) => setFormData(prev => ({ ...prev, tempo_resposta_minutos: parseInt(e.target.value) || 0 }))}
                  className="bg-muted/50"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card neon-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-accent" />
                Entrega
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Distância Máxima (km)</Label>
                <Input 
                  type="number"
                  value={formData.distancia_maxima}
                  onChange={(e) => setFormData(prev => ({ ...prev, distancia_maxima: parseInt(e.target.value) || 0 }))}
                  className="bg-muted/50"
                />
              </div>
              <Button 
                onClick={() => configMutation.mutate(formData)}
                className="w-full neon-glow-magenta mt-4"
                disabled={configMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {configMutation.isPending ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Telefones de Contato */}
        <Card className="glass-card neon-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Telefones de Contato
            </CardTitle>
            <CardDescription>Números para atendimento e gerência (adicione múltiplos grupos)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Número do Atendente</Label>
                <Input 
                  value={novoTelefone.numero_atendente}
                  onChange={(e) => setNovoTelefone(prev => ({ ...prev, numero_atendente: e.target.value }))}
                  placeholder="(11) 99999-9999"
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Número do Gerente</Label>
                <Input 
                  value={novoTelefone.numero_gerente}
                  onChange={(e) => setNovoTelefone(prev => ({ ...prev, numero_gerente: e.target.value }))}
                  placeholder="(11) 99999-9999"
                  className="bg-muted/50"
                />
              </div>
            </div>
            <Button 
              onClick={() => (novoTelefone.numero_atendente || novoTelefone.numero_gerente) && addTelefoneMutation.mutate(novoTelefone)}
              disabled={(!novoTelefone.numero_atendente && !novoTelefone.numero_gerente) || addTelefoneMutation.isPending}
              className="neon-glow-cyan"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Grupo de Telefones
            </Button>

            <div className="space-y-2 mt-4">
              {telefones?.map((tel) => (
                <div key={tel.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-3">
                    <Switch 
                      checked={tel.ativa || false}
                      onCheckedChange={(checked) => toggleTelefoneMutation.mutate({ id: tel.id, ativa: checked })}
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Atendente</p>
                        <p className="font-medium">{tel.numero_atendente || "-"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Gerente</p>
                        <p className="font-medium">{tel.numero_gerente || "-"}</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteTelefoneMutation.mutate(tel.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {(!telefones || telefones.length === 0) && (
                <p className="text-center text-muted-foreground py-4">Nenhum grupo de telefones cadastrado</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Promoções */}
        <Card className="glass-card neon-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-secondary" />
              Promoções
            </CardTitle>
            <CardDescription>Gerencie as promoções ativas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input 
                value={novaPromocao.promocao}
                onChange={(e) => setNovaPromocao(prev => ({ ...prev, promocao: e.target.value }))}
                placeholder="Nome da promoção"
                className="bg-muted/50"
              />
              <Input 
                value={novaPromocao.regras}
                onChange={(e) => setNovaPromocao(prev => ({ ...prev, regras: e.target.value }))}
                placeholder="Regras"
                className="bg-muted/50"
              />
            </div>
            <Button 
              onClick={() => novaPromocao.promocao && addPromocaoMutation.mutate(novaPromocao)}
              disabled={!novaPromocao.promocao || addPromocaoMutation.isPending}
              className="neon-glow-cyan"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Promoção
            </Button>

            <div className="space-y-2 mt-4">
              {promocoes?.map((promo) => (
                <div key={promo.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-3">
                    <Switch 
                      checked={promo.ativa || false}
                      onCheckedChange={(checked) => togglePromocaoMutation.mutate({ id: promo.id, ativa: checked })}
                    />
                    <div>
                      <p className="font-medium">{promo.promocao}</p>
                      {promo.regras && <p className="text-sm text-muted-foreground">{promo.regras}</p>}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deletePromocaoMutation.mutate(promo.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {(!promocoes || promocoes.length === 0) && (
                <p className="text-center text-muted-foreground py-4">Nenhuma promoção cadastrada</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Saudações */}
        <Card className="glass-card neon-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-accent" />
              Saudações
            </CardTitle>
            <CardDescription>Mensagens de boas-vindas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Textarea 
                value={novaSaudacao}
                onChange={(e) => setNovaSaudacao(e.target.value)}
                placeholder="Digite a saudação..."
                className="bg-muted/50"
              />
            </div>
            <Button 
              onClick={() => novaSaudacao && addSaudacaoMutation.mutate(novaSaudacao)}
              disabled={!novaSaudacao || addSaudacaoMutation.isPending}
              className="neon-glow-magenta"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Saudação
            </Button>

            <div className="space-y-2 mt-4">
              {saudacoes?.map((saud) => (
                <div key={saud.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-3">
                    <Switch 
                      checked={saud.ativa || false}
                      onCheckedChange={(checked) => toggleSaudacaoMutation.mutate({ id: saud.id, ativa: checked })}
                    />
                    <p className="text-sm">{saud.saudacao}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteSaudacaoMutation.mutate(saud.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {(!saudacoes || saudacoes.length === 0) && (
                <p className="text-center text-muted-foreground py-4">Nenhuma saudação cadastrada</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Horários Extras */}
        <Card className="glass-card neon-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Horários Extras
            </CardTitle>
            <CardDescription>Horários especiais de funcionamento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input 
                value={novoHorarioExtra.horario}
                onChange={(e) => setNovoHorarioExtra(prev => ({ ...prev, horario: e.target.value }))}
                placeholder="Horário (ex: 18:00 - 23:00)"
                className="bg-muted/50"
              />
              <Input 
                value={novoHorarioExtra.detalhes}
                onChange={(e) => setNovoHorarioExtra(prev => ({ ...prev, detalhes: e.target.value }))}
                placeholder="Detalhes"
                className="bg-muted/50"
              />
            </div>
            <Button 
              onClick={() => novoHorarioExtra.horario && addHorarioExtraMutation.mutate(novoHorarioExtra)}
              disabled={!novoHorarioExtra.horario || addHorarioExtraMutation.isPending}
              className="neon-glow-cyan"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Horário Extra
            </Button>

            <div className="space-y-2 mt-4">
              {horariosExtras?.map((horario) => (
                <div key={horario.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-3">
                    <Switch 
                      checked={horario.ativa || false}
                      onCheckedChange={(checked) => toggleHorarioExtraMutation.mutate({ id: horario.id, ativa: checked })}
                    />
                    <div>
                      <p className="font-medium">{horario.horario}</p>
                      {horario.detalhes && <p className="text-sm text-muted-foreground">{horario.detalhes}</p>}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteHorarioExtraMutation.mutate(horario.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {(!horariosExtras || horariosExtras.length === 0) && (
                <p className="text-center text-muted-foreground py-4">Nenhum horário extra cadastrado</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Números Especiais */}
        <Card className="glass-card neon-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-secondary" />
              Números Especiais
            </CardTitle>
            <CardDescription>Números VIP ou de contatos importantes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input 
                value={novoNumeroEspecial.nome}
                onChange={(e) => setNovoNumeroEspecial(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Nome"
                className="bg-muted/50"
              />
              <Input 
                value={novoNumeroEspecial.telefone}
                onChange={(e) => setNovoNumeroEspecial(prev => ({ ...prev, telefone: e.target.value }))}
                placeholder="Telefone"
                className="bg-muted/50"
              />
            </div>
            <Button 
              onClick={() => novoNumeroEspecial.nome && novoNumeroEspecial.telefone && addNumeroEspecialMutation.mutate(novoNumeroEspecial)}
              disabled={!novoNumeroEspecial.nome || !novoNumeroEspecial.telefone || addNumeroEspecialMutation.isPending}
              className="neon-glow-magenta"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Número Especial
            </Button>

            <div className="space-y-2 mt-4">
              {numerosEspeciais?.map((numero) => (
                <div key={numero.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div>
                    <p className="font-medium">{numero.nome}</p>
                    <p className="text-sm text-muted-foreground">{numero.telefone}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteNumeroEspecialMutation.mutate(numero.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {(!numerosEspeciais || numerosEspeciais.length === 0) && (
                <p className="text-center text-muted-foreground py-4">Nenhum número especial cadastrado</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Configuracoes;
