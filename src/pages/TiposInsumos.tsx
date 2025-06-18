
import { TiposInsumosList } from "@/components/TiposInsumosList";
import { AppLayout } from "@/components/layout/AppLayout";

const TiposInsumos = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tipos de Insumos</h1>
          <p className="text-muted-foreground">
            Gerencie os tipos de insumos utilizados nas dragagens
          </p>
        </div>
        <TiposInsumosList />
      </div>
    </AppLayout>
  );
};

export default TiposInsumos;
