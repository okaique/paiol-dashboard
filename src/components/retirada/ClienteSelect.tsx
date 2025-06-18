
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { ClienteForm } from '@/components/ClienteForm';
import { useClientes } from '@/hooks/useClientes';
import type { Cliente } from '@/types/database';

interface ClienteSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
}

export const ClienteSelect = ({ value, onValueChange, error }: ClienteSelectProps) => {
  const { data: clientes = [], isLoading } = useClientes();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filtrar clientes com ID válido - garantir que nunca seja string vazia
  const validClientes = clientes.filter(cliente => 
    cliente.id && 
    typeof cliente.id === 'string' && 
    cliente.id.trim() !== '' && 
    cliente.nome && 
    typeof cliente.nome === 'string' &&
    cliente.nome.trim() !== ''
  );

  console.log('ClienteSelect - clientes válidos:', validClientes);
  console.log('ClienteSelect - loading:', isLoading);

  const handleClienteCreated = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="cliente_id">Cliente *</Label>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Novo Cliente</DialogTitle>
            </DialogHeader>
            <ClienteForm
              onSuccess={handleClienteCreated}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <Select value={value} onValueChange={onValueChange} disabled={isLoading}>
        <SelectTrigger>
          <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione um cliente"} />
        </SelectTrigger>
        <SelectContent>
          {validClientes.length > 0 ? (
            validClientes.map((cliente) => (
              <SelectItem key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </SelectItem>
            ))
          ) : (
            <div className="px-8 py-2 text-sm text-muted-foreground">
              {isLoading ? "Carregando..." : "Nenhum cliente cadastrado"}
            </div>
          )}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};
