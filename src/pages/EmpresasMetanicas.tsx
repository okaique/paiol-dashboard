
import { AppLayout } from '@/components/layout/AppLayout';
import { EmpresasMetanicasList } from '@/components/EmpresasMetanicasList';

export default function EmpresasMetanicas() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empresas Mecânicas</h1>
          <p className="text-muted-foreground">
            Gerencie as empresas mecânicas cadastradas no sistema
          </p>
        </div>
        
        <EmpresasMetanicasList />
      </div>
    </AppLayout>
  );
}
