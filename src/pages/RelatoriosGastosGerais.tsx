
import { RelatorioGastosGerais } from "@/components/RelatorioGastosGerais";
import { AppLayout } from "@/components/layout/AppLayout";

const RelatoriosGastosGerais = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Relatórios de Gastos Gerais</h1>
          <p className="text-muted-foreground">
            Visualize e analise os gastos gerais dos equipamentos
          </p>
        </div>
        <RelatorioGastosGerais />
      </div>
    </AppLayout>
  );
};

export default RelatoriosGastosGerais;
