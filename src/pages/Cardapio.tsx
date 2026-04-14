import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { UtensilsCrossed, Coffee, Package, Plus, Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Cardapio = () => {
  const queryClient = useQueryClient();
  
  const [pratoDialogOpen, setPratoDialogOpen] = useState(false);
  const [bebidaDialogOpen, setBebidaDialogOpen] = useState(false);
  const [outroProdutoDialogOpen, setOutroProdutoDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const [editingPrato, setEditingPrato] = useState<{ id: number; nome: string | null; discriminacao: string | null; preco_unitario: number | null; disponivel: boolean } | null>(null);
  const [editingBebida, setEditingBebida] = useState<{ id: number; nome: string | null; tipo: string | null; discriminacao: string | null; valor: number | null; disponivel: string | null } | null>(null);
  const [editingOutroProduto, setEditingOutroProduto] = useState<{ id: number; produto: string | null; descricao: string | null; tipo: string | null; valor: number | null; disponivel: boolean | null } | null>(null);
  
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'prato' | 'bebida' | 'outro'; id: number; name: string } | null>(null);
  
  const [pratoForm, setPratoForm] = useState({ nome: "", discriminacao: "", preco_unitario: "" });
  const [bebidaForm, setBebidaForm] = useState({ nome: "", tipo: "", discriminacao: "", valor: "" });
  const [outroProdutoForm, setOutroProdutoForm] = useState({ produto: "", descricao: "", tipo: "", valor: "" });

  const { data: cardapio, isLoading: loadingCardapio } = useQuery({
    queryKey: ["cardapio"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cardapio").select("*").order("nome");
      if (error) throw error;
      return data;
    },
  });

  const { data: bebidas, isLoading: loadingBebidas } = useQuery({
    queryKey: ["bebidas"],
    queryFn: async () => {
      const { data, error } = await supabase.from("bebidas").select("*").order("nome");
      if (error) throw error;
      return data;
    },
  });

  const { data: outrosProdutos } = useQuery({
    queryKey: ["outros_produtos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("outros_produtos").select("*").order("produto");
      if (error) throw error;
      return data;
    },
  });

  const savePratoMutation = useMutation({
    mutationFn: async (prato: { id?: number; nome: string; discriminacao: string; preco_unitario: number }) => {
      if (prato.id) {
        const { error } = await supabase.from("cardapio").update({
          nome: prato.nome,
          discriminacao: prato.discriminacao,
          preco_unitario: prato.preco_unitario,
        }).eq("id", prato.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("cardapio").insert({
          nome: prato.nome,
          discriminacao: prato.discriminacao,
          preco_unitario: prato.preco_unitario,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cardapio"] });
      toast.success(editingPrato ? "Prato atualizado!" : "Prato adicionado!");
      setPratoDialogOpen(false);
      setEditingPrato(null);
      setPratoForm({ nome: "", discriminacao: "", preco_unitario: "" });
    },
    onError: () => toast.error("Erro ao salvar prato"),
  });

  const saveBebidaMutation = useMutation({
    mutationFn: async (bebida: { id?: number; nome: string; tipo: string; discriminacao: string; valor: number }) => {
      if (bebida.id) {
        const { error } = await supabase.from("bebidas").update({
          nome: bebida.nome, tipo: bebida.tipo, discriminacao: bebida.discriminacao, valor: bebida.valor,
        }).eq("id", bebida.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("bebidas").insert({
          nome: bebida.nome, tipo: bebida.tipo, discriminacao: bebida.discriminacao, valor: bebida.valor,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bebidas"] });
      toast.success(editingBebida ? "Bebida atualizada!" : "Bebida adicionada!");
      setBebidaDialogOpen(false);
      setEditingBebida(null);
      setBebidaForm({ nome: "", tipo: "", discriminacao: "", valor: "" });
    },
    onError: () => toast.error("Erro ao salvar bebida"),
  });

  const saveOutroProdutoMutation = useMutation({
    mutationFn: async (outro: { id?: number; produto: string; descricao: string; tipo: string; valor: number }) => {
      if (outro.id) {
        const { error } = await supabase.from("outros_produtos").update({
          produto: outro.produto, descricao: outro.descricao, tipo: outro.tipo, valor: outro.valor,
        }).eq("id", outro.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("outros_produtos").insert({
          produto: outro.produto, descricao: outro.descricao, tipo: outro.tipo, valor: outro.valor,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outros_produtos"] });
      toast.success(editingOutroProduto ? "Produto atualizado!" : "Produto adicionado!");
      setOutroProdutoDialogOpen(false);
      setEditingOutroProduto(null);
      setOutroProdutoForm({ produto: "", descricao: "", tipo: "", valor: "" });
    },
    onError: () => toast.error("Erro ao salvar produto"),
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ type, id }: { type: 'prato' | 'bebida' | 'outro'; id: number }) => {
      const table = type === 'prato' ? 'cardapio' : type === 'bebida' ? 'bebidas' : 'outros_produtos';
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cardapio"] });
      queryClient.invalidateQueries({ queryKey: ["bebidas"] });
      queryClient.invalidateQueries({ queryKey: ["outros_produtos"] });
      toast.success("Item excluído!");
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    },
    onError: () => toast.error("Erro ao excluir item"),
  });

  const togglePratoDisponibilidadeMutation = useMutation({
    mutationFn: async ({ id, disponivel }: { id: number; disponivel: boolean }) => {
      const { error } = await supabase.from("cardapio").update({ disponivel }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cardapio"] }),
    onError: () => toast.error("Erro ao atualizar disponibilidade"),
  });

  const toggleOutroProdutoDisponibilidadeMutation = useMutation({
    mutationFn: async ({ id, disponivel }: { id: number; disponivel: boolean }) => {
      const { error } = await supabase.from("outros_produtos").update({ disponivel }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outros_produtos"] }),
    onError: () => toast.error("Erro ao atualizar disponibilidade"),
  });

  const isLoading = loadingCardapio || loadingBebidas;

  const formatPrice = (price: number | null) => {
    if (!price) return "R$ 0,00";
    return `R$ ${price.toFixed(2).replace(".", ",")}`;
  };

  const openEditPrato = (prato: typeof cardapio extends (infer T)[] | null ? T : never) => {
    if (!prato) return;
    setEditingPrato(prato);
    setPratoForm({
      nome: prato.nome || "",
      discriminacao: prato.discriminacao || "",
      preco_unitario: prato.preco_unitario?.toString() || "",
    });
    setPratoDialogOpen(true);
  };

  const openEditBebida = (bebida: typeof bebidas extends (infer T)[] | null ? T : never) => {
    if (!bebida) return;
    setEditingBebida(bebida);
    setBebidaForm({
      nome: bebida.nome || "", tipo: bebida.tipo || "", discriminacao: bebida.discriminacao || "", valor: bebida.valor?.toString() || "",
    });
    setBebidaDialogOpen(true);
  };

  const openEditOutroProduto = (outro: typeof outrosProdutos extends (infer T)[] | null ? T : never) => {
    if (!outro) return;
    setEditingOutroProduto(outro);
    setOutroProdutoForm({
      produto: outro.produto || "", descricao: outro.descricao || "", tipo: outro.tipo || "", valor: outro.valor?.toString() || "",
    });
    setOutroProdutoDialogOpen(true);
  };

  const openNewPrato = () => { setEditingPrato(null); setPratoForm({ nome: "", discriminacao: "", preco_unitario: "" }); setPratoDialogOpen(true); };
  const openNewBebida = () => { setEditingBebida(null); setBebidaForm({ nome: "", tipo: "", discriminacao: "", valor: "" }); setBebidaDialogOpen(true); };
  const openNewOutroProduto = () => { setEditingOutroProduto(null); setOutroProdutoForm({ produto: "", descricao: "", tipo: "", valor: "" }); setOutroProdutoDialogOpen(true); };

  const confirmDelete = (type: 'prato' | 'bebida' | 'outro', id: number, name: string) => {
    setDeleteTarget({ type, id, name });
    setDeleteDialogOpen(true);
  };

  const handleSavePrato = () => {
    savePratoMutation.mutate({
      id: editingPrato?.id,
      nome: pratoForm.nome,
      discriminacao: pratoForm.discriminacao,
      preco_unitario: parseFloat(pratoForm.preco_unitario.replace(",", ".")) || 0,
    });
  };

  const handleSaveBebida = () => {
    saveBebidaMutation.mutate({
      id: editingBebida?.id,
      nome: bebidaForm.nome, tipo: bebidaForm.tipo, discriminacao: bebidaForm.discriminacao,
      valor: parseFloat(bebidaForm.valor.replace(",", ".")) || 0,
    });
  };

  const handleSaveOutroProduto = () => {
    saveOutroProdutoMutation.mutate({
      id: editingOutroProduto?.id,
      produto: outroProdutoForm.produto, descricao: outroProdutoForm.descricao, tipo: outroProdutoForm.tipo,
      valor: parseFloat(outroProdutoForm.valor.replace(",", ".")) || 0,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2"><span className="neon-text-cyan">Cardápio</span></h2>
          <p className="text-muted-foreground">Gerencie os itens do seu cardápio</p>
        </div>
      </div>

      <Tabs defaultValue="pratos" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/50">
          <TabsTrigger value="pratos" className="data-[state=active]:bg-primary/20"><UtensilsCrossed className="h-4 w-4 mr-2" />Pratos</TabsTrigger>
          <TabsTrigger value="bebidas" className="data-[state=active]:bg-secondary/20"><Coffee className="h-4 w-4 mr-2" />Bebidas</TabsTrigger>
          <TabsTrigger value="outros" className="data-[state=active]:bg-accent/20"><Package className="h-4 w-4 mr-2" />Outros</TabsTrigger>
        </TabsList>

        <TabsContent value="pratos" className="mt-6">
          <Card className="glass-card neon-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Pratos do Cardápio</CardTitle>
                <CardDescription>{cardapio?.length || 0} itens cadastrados</CardDescription>
              </div>
              <Button onClick={openNewPrato} className="neon-glow-cyan"><Plus className="h-4 w-4 mr-2" />Novo Prato</Button>
            </CardHeader>
            <CardContent>
              {cardapio && cardapio.length > 0 ? (
                <div className="grid gap-4">
                  {cardapio.map((item) => (
                    <div key={item.id} className={`p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/50 transition-colors ${!item.disponivel ? 'opacity-50' : ''}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{item.nome}</h4>
                        {!item.disponivel && <Badge variant="secondary" className="text-xs">Indisponível</Badge>}
                      </div>
                      {item.discriminacao && <p className="text-sm text-muted-foreground px-1 mb-3">{item.discriminacao}</p>}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <Switch checked={item.disponivel} onCheckedChange={(checked) => togglePratoDisponibilidadeMutation.mutate({ id: item.id, disponivel: checked })} />
                          <span className="text-xs text-muted-foreground hidden sm:inline">{item.disponivel ? 'Disponível' : 'Indisponível'}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="neon-text-cyan">{formatPrice(item.preco_unitario)}</Badge>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditPrato(item)}><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => confirmDelete('prato', item.id, item.nome || 'Item')}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <UtensilsCrossed className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum prato cadastrado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bebidas" className="mt-6">
          <Card className="glass-card neon-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Bebidas</CardTitle>
                <CardDescription>{bebidas?.length || 0} bebidas cadastradas</CardDescription>
              </div>
              <Button onClick={openNewBebida} className="neon-glow-magenta"><Plus className="h-4 w-4 mr-2" />Nova Bebida</Button>
            </CardHeader>
            <CardContent>
              {bebidas && bebidas.length > 0 ? (
                <div className="grid gap-4">
                  {bebidas.map((bebida) => (
                    <div key={bebida.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-secondary/50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium">{bebida.nome}</h4>
                        {bebida.discriminacao && <p className="text-sm text-muted-foreground mt-1">{bebida.discriminacao}</p>}
                        <div className="flex gap-2 mt-1">
                          {bebida.tipo && <Badge variant="secondary">{bebida.tipo}</Badge>}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="neon-text-magenta">{formatPrice(bebida.valor)}</Badge>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditBebida(bebida)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => confirmDelete('bebida', bebida.id, bebida.nome || 'Item')}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Coffee className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma bebida cadastrada</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outros" className="mt-6">
          <Card className="glass-card neon-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Outros Produtos</CardTitle>
                <CardDescription>{outrosProdutos?.length || 0} produtos cadastrados</CardDescription>
              </div>
              <Button onClick={openNewOutroProduto} className="neon-glow-green"><Plus className="h-4 w-4 mr-2" />Novo Produto</Button>
            </CardHeader>
            <CardContent>
              {outrosProdutos && outrosProdutos.length > 0 ? (
                <div className="grid gap-4">
                  {outrosProdutos.map((outro) => (
                    <div key={outro.id} className={`flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-accent/50 transition-colors ${!outro.disponivel ? 'opacity-50' : ''}`}>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">{outro.produto}</h4>
                          {!outro.disponivel && <Badge variant="secondary" className="text-xs">Indisponível</Badge>}
                        </div>
                        {outro.descricao && <p className="text-sm text-muted-foreground mt-1">{outro.descricao}</p>}
                        {outro.tipo && <Badge variant="secondary" className="mt-1">{outro.tipo}</Badge>}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch checked={outro.disponivel ?? false} onCheckedChange={(checked) => toggleOutroProdutoDisponibilidadeMutation.mutate({ id: outro.id, disponivel: checked })} />
                        </div>
                        <Badge variant="outline" className="neon-text-green">{formatPrice(outro.valor)}</Badge>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditOutroProduto(outro)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => confirmDelete('outro', outro.id, outro.produto || 'Item')}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum outro produto cadastrado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Prato Dialog */}
      <Dialog open={pratoDialogOpen} onOpenChange={setPratoDialogOpen}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>{editingPrato ? "Editar Prato" : "Novo Prato"}</DialogTitle>
            <DialogDescription>Preencha as informações do prato</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Nome</Label><Input value={pratoForm.nome} onChange={(e) => setPratoForm({ ...pratoForm, nome: e.target.value })} placeholder="Nome do prato" /></div>
            <div><Label>Descrição</Label><Textarea value={pratoForm.discriminacao} onChange={(e) => setPratoForm({ ...pratoForm, discriminacao: e.target.value })} placeholder="Descrição / Ingredientes" /></div>
            <div><Label>Preço</Label><Input value={pratoForm.preco_unitario} onChange={(e) => setPratoForm({ ...pratoForm, preco_unitario: e.target.value })} placeholder="0,00" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPratoDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSavePrato} className="neon-glow-cyan">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bebida Dialog */}
      <Dialog open={bebidaDialogOpen} onOpenChange={setBebidaDialogOpen}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>{editingBebida ? "Editar Bebida" : "Nova Bebida"}</DialogTitle>
            <DialogDescription>Preencha as informações da bebida</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Nome</Label><Input value={bebidaForm.nome} onChange={(e) => setBebidaForm({ ...bebidaForm, nome: e.target.value })} placeholder="Nome da bebida" /></div>
            <div><Label>Tipo</Label><Input value={bebidaForm.tipo} onChange={(e) => setBebidaForm({ ...bebidaForm, tipo: e.target.value })} placeholder="Tipo" /></div>
            <div><Label>Descrição</Label><Input value={bebidaForm.discriminacao} onChange={(e) => setBebidaForm({ ...bebidaForm, discriminacao: e.target.value })} placeholder="Descrição" /></div>
            <div><Label>Valor</Label><Input value={bebidaForm.valor} onChange={(e) => setBebidaForm({ ...bebidaForm, valor: e.target.value })} placeholder="0,00" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBebidaDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveBebida} className="neon-glow-magenta">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Outro Produto Dialog */}
      <Dialog open={outroProdutoDialogOpen} onOpenChange={setOutroProdutoDialogOpen}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>{editingOutroProduto ? "Editar Produto" : "Novo Produto"}</DialogTitle>
            <DialogDescription>Preencha as informações do produto</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Produto</Label><Input value={outroProdutoForm.produto} onChange={(e) => setOutroProdutoForm({ ...outroProdutoForm, produto: e.target.value })} placeholder="Nome do produto" /></div>
            <div><Label>Descrição</Label><Textarea value={outroProdutoForm.descricao} onChange={(e) => setOutroProdutoForm({ ...outroProdutoForm, descricao: e.target.value })} placeholder="Descrição" /></div>
            <div><Label>Tipo</Label><Input value={outroProdutoForm.tipo} onChange={(e) => setOutroProdutoForm({ ...outroProdutoForm, tipo: e.target.value })} placeholder="Tipo" /></div>
            <div><Label>Valor</Label><Input value={outroProdutoForm.valor} onChange={(e) => setOutroProdutoForm({ ...outroProdutoForm, valor: e.target.value })} placeholder="0,00" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOutroProdutoDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveOutroProduto} className="neon-glow-green">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="glass-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>Tem certeza que deseja excluir "{deleteTarget?.name}"? Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => deleteTarget && deleteMutation.mutate({ type: deleteTarget.type, id: deleteTarget.id })}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Cardapio;
