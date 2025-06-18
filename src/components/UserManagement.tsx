
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Shield, Users, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useUsersWithRoles, useAssignUserRole, useRemoveUserRole } from '@/hooks/useUserRoles';
import { AppRole, ROLE_LABELS, ROLE_DESCRIPTIONS } from '@/types/user-roles';
import { CadastroUsuarioDialog } from '@/components/CadastroUsuarioDialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const getRoleBadgeVariant = (role: AppRole) => {
  switch (role) {
    case 'administrador':
      return 'destructive';
    case 'operador':
      return 'default';
    case 'visualizador':
      return 'secondary';
    default:
      return 'outline';
  }
};

export const UserManagement = () => {
  const { data: users, isLoading, error } = useUsersWithRoles();
  const assignRoleMutation = useAssignUserRole();
  const removeRoleMutation = useRemoveUserRole();
  const [selectedRoles, setSelectedRoles] = useState<Record<string, AppRole>>({});

  const handleRoleChange = (userId: string, role: AppRole) => {
    setSelectedRoles(prev => ({ ...prev, [userId]: role }));
  };

  const handleAssignRole = async (userId: string) => {
    const role = selectedRoles[userId];
    if (role) {
      await assignRoleMutation.mutateAsync({ userId, role });
      setSelectedRoles(prev => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    }
  };

  const handleRemoveRole = async (userId: string) => {
    await removeRoleMutation.mutateAsync(userId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando usuários...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <span>Erro ao carregar usuários. Verifique suas permissões.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-end">
            <CadastroUsuarioDialog />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Papel Atual</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell className="font-medium">{user.nome}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {ROLE_LABELS[user.role]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(user.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Select
                          value={selectedRoles[user.user_id] || ''}
                          onValueChange={(value: AppRole) =>
                            handleRoleChange(user.user_id, value)
                          }
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Novo papel" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="administrador">Administrador</SelectItem>
                            <SelectItem value="operador">Operador</SelectItem>
                            <SelectItem value="visualizador">Visualizador</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button
                          size="sm"
                          onClick={() => handleAssignRole(user.user_id)}
                          disabled={
                            !selectedRoles[user.user_id] ||
                            selectedRoles[user.user_id] === user.role ||
                            assignRoleMutation.isPending
                          }
                        >
                          {assignRoleMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'Atribuir'
                          )}
                        </Button>

                        {user.role !== 'visualizador' && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                Remover
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remover papel do usuário</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja remover o papel de {ROLE_LABELS[user.role].toLowerCase()} 
                                  do usuário {user.nome}? O usuário ficará com o papel padrão de Visualizador.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRemoveRole(user.user_id)}
                                  disabled={removeRoleMutation.isPending}
                                >
                                  {removeRoleMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  ) : null}
                                  Confirmar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {users?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Legenda dos papéis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Descrição dos Papéis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(ROLE_DESCRIPTIONS).map(([role, description]) => (
              <div key={role} className="space-y-2">
                <Badge variant={getRoleBadgeVariant(role as AppRole)} className="mb-2">
                  {ROLE_LABELS[role as AppRole]}
                </Badge>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};