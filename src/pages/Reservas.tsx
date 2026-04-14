import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, CalendarDays } from "lucide-react";

type Reserva = {
  id: number;
  nome: string | null;
  whatsapp: string;
  data_reserva: string | null;
  horario_reserva: string | null;
  qtde_pessoas: number | null;
  observacoes: string | null;
  created_at: string;
};

const emptyForm = {
  nome: "",
  whatsapp: "",
  data_reserva: "",
  horario_reserva: "",
  qtde_pessoas: "",
  observacoes: "",
};

export default function Reservas() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Reserva | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: reservas = [], isLoading } = useQuery({
    queryKey: ["reservas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reservas")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Reserva[];
    },
  });

  const upsert = useMutation({
    mutationFn: async () => {
      const payload = {
        nome: form.nome || null,
        whatsapp: form.whatsapp,
        data_reserva: form.data_reserva || null,
        horario_reserva: form.horario_reserva || null,
        qtde_pessoas: form.qtde_pessoas ? Number(form.qtde_pessoas) : null,
        observacoes: form.observacoes || null,
      };

      if (editing) {
        const { error } = await supabase
          .from("reservas")
          .update(payload)
          .eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("reservas").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservas"] });
      toast.success(editing ? "Reserva atualizada!" : "Reserva criada!");
      closeDialog();
    },
    onError: () => toast.error("Erro ao salvar reserva"),
  });

  const remove = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("reservas").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservas"] });
      toast.success("Reserva excluída!");
    },
    onError: () => toast.error("Erro ao excluir reserva"),
  });

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (r: Reserva) => {
    setEditing(r);
    setForm({
      nome: r.nome ?? "",
      whatsapp: r.whatsapp,
      data_reserva: r.data_reserva ?? "",
      horario_reserva: r.horario_reserva ?? "",
      qtde_pessoas: r.qtde_pessoas?.toString() ?? "",
      observacoes: r.observacoes ?? "",
    });
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            Reservas
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gerencie as reservas dos clientes
          </p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" /> Nova Reserva
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Reservas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">Carregando...</p>
          ) : reservas.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhuma reserva encontrada</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>WhatsApp</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Pessoas</TableHead>
                  <TableHead>Observações</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservas.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.nome ?? "-"}</TableCell>
                    <TableCell>{r.whatsapp}</TableCell>
                    <TableCell>{r.data_reserva ?? "-"}</TableCell>
                    <TableCell>{r.horario_reserva ?? "-"}</TableCell>
                    <TableCell>{r.qtde_pessoas ?? "-"}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{r.observacoes ?? "-"}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(r)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => remove.mutate(r.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Reserva" : "Nova Reserva"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-foreground">Nome</label>
              <Input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome do cliente" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">WhatsApp *</label>
              <Input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="5511999999999" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Data da Reserva</label>
                <Input name="data_reserva" value={form.data_reserva} onChange={handleChange} placeholder="dd/mm/aaaa" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Horário</label>
                <Input name="horario_reserva" value={form.horario_reserva} onChange={handleChange} placeholder="19:00" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Qtde de Pessoas</label>
              <Input name="qtde_pessoas" type="number" value={form.qtde_pessoas} onChange={handleChange} placeholder="2" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Observações</label>
              <Textarea name="observacoes" value={form.observacoes} onChange={handleChange} placeholder="Observações adicionais" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancelar</Button>
            <Button onClick={() => upsert.mutate()} disabled={!form.whatsapp || upsert.isPending}>
              {upsert.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
