
import { TiposGastosList } from "@/components/TiposGastosList";
import { AppLayout } from "@/components/layout/AppLayout";

const TiposGastos = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tipos de Gastos</h1>
          <p className="text-muted-foreground">
            Gerencie os tipos de gastos gerais dos equipamentos
          </p>
        </div>
        <TiposGastosList />
      </div>
    </AppLayout>
  );
};

export default TiposGastos;
