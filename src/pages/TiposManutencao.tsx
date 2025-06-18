
import { AppLayout } from '@/components/layout/AppLayout';
import { TiposManutencaoList } from '@/components/TiposManutencaoList';

export default function TiposManutencao() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tipos de Manutenção</h1>
          <p className="text-muted-foreground">
            Gerencie os tipos de manutenção disponíveis no sistema
          </p>
        </div>
        
        <TiposManutencaoList />
      </div>
    </AppLayout>
  );
}
