
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RelatoriosCustosPorPaiol } from '@/components/RelatoriosCustosPorPaiol';
import { RelatoriosVolumesPorPeriodo } from '@/components/RelatoriosVolumesPorPeriodo';
import { RelatorioManutencoes } from '@/components/RelatorioManutencoes';
import { FileText, FileBarChart, Wrench } from 'lucide-react';
import { AppLayout } from "@/components/layout/AppLayout";

const Relatorios = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">
            Visualize relatórios de custos, volumes e manutenções
          </p>
        </div>

        <Tabs defaultValue="custos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="custos" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Custos por Paiol
            </TabsTrigger>
            <TabsTrigger value="volumes" className="flex items-center gap-2">
              <FileBarChart className="h-4 w-4" />
              Volumes por Período
            </TabsTrigger>
            <TabsTrigger value="manutencoes" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Manutenções
            </TabsTrigger>
          </TabsList>

          <TabsContent value="custos">
            <RelatoriosCustosPorPaiol />
          </TabsContent>

          <TabsContent value="volumes">
            <RelatoriosVolumesPorPeriodo />
          </TabsContent>

          <TabsContent value="manutencoes">
            <RelatorioManutencoes />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Relatorios;
