
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

export const PaiolDetailsTabs = () => {
  return (
    <div className="overflow-x-auto">
      <TabsList className="grid grid-cols-3 lg:grid-cols-7 w-full lg:w-auto min-w-max">
        <TabsTrigger value="detalhes" className="text-xs sm:text-sm">Detalhes</TabsTrigger>
        <TabsTrigger value="dragagem" className="text-xs sm:text-sm">Dragagem</TabsTrigger>
        <TabsTrigger value="cubagem" className="text-xs sm:text-sm">Cubagem</TabsTrigger>
        <TabsTrigger value="custos" className="text-xs sm:text-sm">Custos</TabsTrigger>
        <TabsTrigger value="retiradas" className="text-xs sm:text-sm">Retiradas</TabsTrigger>
        <TabsTrigger value="historico" className="text-xs sm:text-sm">Histórico</TabsTrigger>
        <TabsTrigger value="timeline" className="text-xs sm:text-sm">Timeline</TabsTrigger>
      </TabsList>
    </div>
  );
};
