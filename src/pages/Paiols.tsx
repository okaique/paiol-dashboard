import { useState } from 'react';
import { PaiolsList } from "@/components/PaiolsList";
import { PaiolForm } from "@/components/PaiolForm";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import type { Paiol } from "@/types/database";

const Paiols = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPaiol, setEditingPaiol] = useState<Paiol | null>(null);

  const handleEdit = (paiol: Paiol) => {
    setEditingPaiol(paiol);
    setIsFormOpen(true);
  };

  const handleNew = () => {
    setEditingPaiol(null);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingPaiol(null);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingPaiol(null);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-6 justify-between">
          <div>
            <h1 className="text-3xl font-bold">Paióis</h1>
            <p className="text-muted-foreground">
              Gerencie os paióis de areia lavada
            </p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNew} className="w-full self-end sm:w-fit">
                <Plus className="h-4 w-4 mr-2" />
                Novo Paiol
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingPaiol ? 'Editar Paiol' : 'Novo Paiol'}
                </DialogTitle>
              </DialogHeader>
              <PaiolForm
                paiol={editingPaiol || undefined}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </DialogContent>
          </Dialog>
        </div>
        <PaiolsList onEdit={handleEdit} />
      </div>
    </AppLayout>
  );
};

export default Paiols;