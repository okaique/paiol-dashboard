
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { AppRole, UserRole, UserWithRole } from '@/types/user-roles';

export const useUserRole = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async (): Promise<AppRole | null> => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return 'visualizador'; // Usuário sem papel específico = visualizador
        }
        throw error;
      }

      return data.role as AppRole;
    },
    enabled: !!user?.id,
  });
};

export const useUsersWithRoles = () => {
  return useQuery({
    queryKey: ['users-with-roles'],
    queryFn: async (): Promise<UserWithRole[]> => {
      const { data, error } = await supabase.rpc('get_users_with_roles');

      if (error) {
        console.error('Erro ao buscar usuários:', error);
        throw error;
      }

      return data || [];
    },
  });
};

export const useAssignUserRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { data, error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: role,
          assigned_by: (await supabase.auth.getUser()).data.user?.id,
          assigned_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao atribuir papel:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-with-roles'] });
      queryClient.invalidateQueries({ queryKey: ['user-role'] });
      toast({
        title: "Sucesso",
        description: "Papel do usuário atualizado com sucesso!",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao atribuir papel:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar papel do usuário.",
        variant: "destructive",
      });
    },
  });
};

export const useRemoveUserRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error('Erro ao remover papel:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-with-roles'] });
      queryClient.invalidateQueries({ queryKey: ['user-role'] });
      toast({
        title: "Sucesso",
        description: "Papel do usuário removido com sucesso!",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao remover papel:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao remover papel do usuário.",
        variant: "destructive",
      });
    },
  });
};
