
import { GastosGeraisList } from "@/components/GastosGeraisList";
import { AppLayout } from "@/components/layout/AppLayout";

const GastosGerais = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gastos Gerais</h1>
          <p className="text-muted-foreground">
            Registre e gerencie os gastos gerais dos equipamentos
          </p>
        </div>
        <GastosGeraisList />
      </div>
    </AppLayout>
  );
};

export default GastosGerais;
