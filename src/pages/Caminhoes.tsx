
import { useState } from 'react';
import { CaminhoesList } from "@/components/CaminhoesList";
import { CaminhaoForm } from "@/components/CaminhaoForm";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import type { Caminhao } from "@/types/database";

const Caminhoes = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCaminhao, setEditingCaminhao] = useState<Caminhao | null>(null);

  const handleEdit = (caminhao: Caminhao) => {
    setEditingCaminhao(caminhao);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingCaminhao(null);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-6 justify-between">
          <div>
            <h1 className="text-3xl font-bold">Caminhões</h1>
            <p className="text-muted-foreground">
              Gerencie os caminhões cadastrados no sistema
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full self-end sm:w-fit">
                <Plus className="h-4 w-4 mr-2" />
                Novo Caminhão
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingCaminhao ? 'Editar Caminhão' : 'Novo Caminhão'}
                </DialogTitle>
              </DialogHeader>
              <CaminhaoForm
                caminhao={editingCaminhao}
                onSuccess={handleDialogClose}
                onCancel={handleDialogClose}
              />
            </DialogContent>
          </Dialog>
        </div>
        <CaminhoesList onEdit={handleEdit} />
      </div>
    </AppLayout>
  );
};

export default Caminhoes;