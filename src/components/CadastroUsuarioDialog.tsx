
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAssignUserRole } from '@/hooks/useUserRoles';
import { AppRole, ROLE_LABELS } from '@/types/user-roles';
import { useToast } from '@/hooks/use-toast';

export const CadastroUsuarioDialog = () => {
  const { signUp } = useAuth();
  const assignRoleMutation = useAssignUserRole();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    password: '',
    role: 'visualizador' as AppRole,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Criar o usuário
      const { error: signUpError } = await signUp(userData.email, userData.password, userData.nome);
      
      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      toast({
        title: "Usuário cadastrado com sucesso",
        description: `${userData.nome} foi cadastrado e receberá um email de confirmação.`,
      });

      // Resetar formulário e fechar dialog
      setUserData({
        nome: '',
        email: '',
        password: '',
        role: 'visualizador' as AppRole,
      });
      setOpen(false);

    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full self-end sm:w-fit">
          <UserPlus className="h-4 w-4 mr-2" />
          Cadastrar Usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Usuário</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo usuário. Ele receberá um email de confirmação.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                value={userData.nome}
                onChange={(e) => setUserData({ ...userData, nome: e.target.value })}
                placeholder="Nome completo do usuário"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                placeholder="email@exemplo.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha Temporária</Label>
              <Input
                id="password"
                type="password"
                value={userData.password}
                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                placeholder="Senha temporária"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Papel do Usuário</Label>
              <Select
                value={userData.role}
                onValueChange={(value: AppRole) => setUserData({ ...userData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o papel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="administrador">{ROLE_LABELS.administrador}</SelectItem>
                  <SelectItem value="operador">{ROLE_LABELS.operador}</SelectItem>
                  <SelectItem value="visualizador">{ROLE_LABELS.visualizador}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <Alert className="mb-4 border-destructive">
              <AlertDescription className="text-destructive">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Cadastrar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};