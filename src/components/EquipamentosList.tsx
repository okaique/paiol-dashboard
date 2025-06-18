
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit2, Eye, Trash2, Search } from 'lucide-react';
import { useEquipamentos } from '@/hooks/useEquipamentos';
import { useEquipamentoMutations } from '@/hooks/useEquipamentoMutations';
import { EquipamentoForm } from './EquipamentoForm';
import { Equipamento } from '@/types/database';
import { useNavigate } from 'react-router-dom';

export function EquipamentosList() {
  const { data: equipamentos, isLoading } = useEquipamentos();
  const { deleteEquipamento } = useEquipamentoMutations();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEquipamento, setSelectedEquipamento] = useState<Equipamento | undefined>();
  const navigate = useNavigate();

  const filteredEquipamentos = equipamentos?.filter(equipamento =>
    equipamento.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (equipamento.placa && equipamento.placa.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const handleEdit = (equipamento: Equipamento) => {
    setSelectedEquipamento(equipamento);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este equipamento?')) {
      await deleteEquipamento.mutateAsync(id);
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/equipamentos/${id}`);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedEquipamento(undefined);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando equipamentos...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="pt-6 mb-4 flex flex-col items-center gap-4 md:flex-row">
            <div className="w-full relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por modelo ou placa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={() => setIsFormOpen(true)} className="w-full self-end sm:w-fit">
              Novo Equipamento
            </Button>
          </div>

          {filteredEquipamentos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'Nenhum equipamento encontrado.' : 'Nenhum equipamento cadastrado.'}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Placa</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEquipamentos.map((equipamento) => (
                    <TableRow key={equipamento.id}>
                      <TableCell className="font-medium">
                        {equipamento.modelo}
                      </TableCell>
                      <TableCell>
                        {equipamento.placa || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={equipamento.ativo ? 'default' : 'secondary'}>
                          {equipamento.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(equipamento.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(equipamento)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(equipamento.id)}
                            disabled={deleteEquipamento.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <EquipamentoForm
        equipamento={selectedEquipamento}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
      />
    </div>
  );
};