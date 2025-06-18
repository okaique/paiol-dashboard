
import { useState } from 'react';
import { PessoalList } from "@/components/PessoalList";
import { DragadorForm } from "@/components/DragadorForm";
import { AjudanteForm } from "@/components/AjudanteForm";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import type { Dragador, Ajudante } from "@/types/database";

const Pessoal = () => {
  const [isDragadorDialogOpen, setIsDragadorDialogOpen] = useState(false);
  const [isAjudanteDialogOpen, setIsAjudanteDialogOpen] = useState(false);
  const [editingDragador, setEditingDragador] = useState<Dragador | null>(null);
  const [editingAjudante, setEditingAjudante] = useState<Ajudante | null>(null);

  const handleEditDragador = (dragador: Dragador) => {
    setEditingDragador(dragador);
    setIsDragadorDialogOpen(true);
  };

  const handleEditAjudante = (ajudante: Ajudante) => {
    setEditingAjudante(ajudante);
    setIsAjudanteDialogOpen(true);
  };

  const handleDragadorDialogClose = () => {
    setIsDragadorDialogOpen(false);
    setEditingDragador(null);
  };

  const handleAjudanteDialogClose = () => {
    setIsAjudanteDialogOpen(false);
    setEditingAjudante(null);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Pessoal</h1>
          <p className="text-muted-foreground">
            Gerencie dragadores e ajudantes
          </p>
        </div>
        
        <Tabs defaultValue="dragadores" className="space-y-4">
          <TabsList>
            <TabsTrigger value="dragadores">Dragadores</TabsTrigger>
            <TabsTrigger value="ajudantes">Ajudantes</TabsTrigger>
          </TabsList>

          <TabsContent value="dragadores" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={isDragadorDialogOpen} onOpenChange={setIsDragadorDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Dragador
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingDragador ? 'Editar Dragador' : 'Novo Dragador'}
                    </DialogTitle>
                  </DialogHeader>
                  <DragadorForm
                    dragador={editingDragador}
                    onSuccess={handleDragadorDialogClose}
                    onCancel={handleDragadorDialogClose}
                  />
                </DialogContent>
              </Dialog>
            </div>
            <PessoalList type="dragador" onEditDragador={handleEditDragador} />
          </TabsContent>

          <TabsContent value="ajudantes" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={isAjudanteDialogOpen} onOpenChange={setIsAjudanteDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Ajudante
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingAjudante ? 'Editar Ajudante' : 'Novo Ajudante'}
                    </DialogTitle>
                  </DialogHeader>
                  <AjudanteForm
                    ajudante={editingAjudante}
                    onSuccess={handleAjudanteDialogClose}
                    onCancel={handleAjudanteDialogClose}
                  />
                </DialogContent>
              </Dialog>
            </div>
            <PessoalList type="ajudante" onEditAjudante={handleEditAjudante} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Pessoal;
