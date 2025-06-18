
import { AppLayout } from '@/components/layout/AppLayout';
import { EquipamentosList } from '@/components/EquipamentosList';

export default function Equipamentos() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipamentos</h1>
          <p className="text-muted-foreground">
            Gerencie os equipamentos da sua operação
          </p>
        </div>
        
        <EquipamentosList />
      </div>
    </AppLayout>
  );
}
